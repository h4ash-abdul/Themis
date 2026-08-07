import { Queue, Worker } from 'bullmq';
import express from 'express';
import Redis from 'ioredis';
import { exec } from 'child_process';
import crypto from 'crypto';

// Setup Redis Connection
const redisConnection = new Redis({
  host: '127.0.0.1',
  port: 6379
});

// Setup Express App
const app = express();
app.use(express.json());

// In-memory Database for Demonstration
const deploymentsDb = new Map(); 
const branchUrlsDb = new Map();

// ==========================================
// REQUIREMENT 1: BUILD QUEUE
// ==========================================
const buildQueue = new Queue('deployments', { connection: redisConnection });

// Webhook endpoint to trigger a build on code change
app.post('/webhook', async (req, res) => {
  const { repository, commitHash, branch } = req.body;
  
  // Generate a unique ID for this specific deployment
  const deploymentId = crypto.randomUUID();
  
  // Requirement 3: Preview Deployment URL Generation
  const previewUrl = `https://${deploymentId.split('-')[0]}-${repository.name}.preview.domain.com`;
  
  const jobData = {
    deploymentId,
    repositoryUrl: repository.url,
    commitHash,
    branch,
    previewUrl
  };

  // Add to database
  deploymentsDb.set(deploymentId, { status: 'queued', ...jobData });

  // Enqueue the build job
  const job = await buildQueue.add('build', jobData, {
    jobId: deploymentId // Allow us to find and cancel it easily
  });

  res.status(202).json({ 
    message: 'Build queued',
    deploymentId,
    previewUrl 
  });
});

// The Builder Worker (Executes the queued jobs)
const builderWorker = new Worker('deployments', async job => {
  const { deploymentId, repositoryUrl, commitHash, branch, previewUrl } = job.data;
  
  deploymentsDb.set(deploymentId, { ...deploymentsDb.get(deploymentId), status: 'building' });
  
  console.log(`[Builder] Starting build for ${deploymentId}`);

  try {
    // Mock build process (clone, install, build, deploy to container/S3)
    await mockBuildProcess(repositoryUrl, commitHash);
    
    // Deployment successful
    deploymentsDb.set(deploymentId, { ...deploymentsDb.get(deploymentId), status: 'success' });
    
    // REQUIREMENT 4: BRANCH-SPECIFIC PREVIEW URLS
    // Update the persistent branch URL routing to point to this new deployment
    const branchUrl = `https://${branch}-${repositoryUrl.split('/').pop()}.preview.domain.com`;
    branchUrlsDb.set(branch, {
      currentDeploymentId: deploymentId,
      branchUrl: branchUrl
    });

    console.log(`[Builder] Success! Accessible at: ${previewUrl}`);
    console.log(`[Builder] Branch URL updated: ${branchUrl}`);

  } catch (error) {
    if (error.message === 'cancelled') {
      deploymentsDb.set(deploymentId, { ...deploymentsDb.get(deploymentId), status: 'cancelled' });
    } else {
      deploymentsDb.set(deploymentId, { ...deploymentsDb.get(deploymentId), status: 'failed', error: error.message });
    }
  }
}, { connection: redisConnection });


// ==========================================
// REQUIREMENT 2: CANCEL DEPLOYMENT
// ==========================================
app.post('/api/deployments/:id/cancel', async (req, res) => {
  const { id } = req.params;
  const deployment = deploymentsDb.get(id);

  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found' });
  }

  // If the job is still in the queue (pending)
  if (deployment.status === 'queued') {
    const job = await buildQueue.getJob(id);
    if (job) {
      await job.remove(); // Remove from queue
      deploymentsDb.set(id, { ...deployment, status: 'cancelled' });
      return res.json({ message: 'Deployment cancelled from queue.' });
    }
  }

  // If the job is actively building
  if (deployment.status === 'building') {
    // In BullMQ, we can send a custom event or check job.isActive()
    // For shell processes, we'd kill the child process PID stored in memory.
    killRunningBuildProcess(id); 
    deploymentsDb.set(id, { ...deployment, status: 'cancelled' });
    return res.json({ message: 'Active deployment aborted.' });
  }

  res.status(400).json({ error: `Cannot cancel deployment with status: ${deployment.status}` });
});


// ==========================================
// REQUIREMENT 3 & 4: RETRIEVE URLS
// ==========================================
app.get('/api/deployments/:id', (req, res) => {
  const deployment = deploymentsDb.get(req.params.id);
  if (!deployment) return res.status(404).json({ error: 'Not found' });
  
  // Returns the unique preview URL for this specific commit
  res.json(deployment); 
});

app.get('/api/branches/:branch', (req, res) => {
  const branchData = branchUrlsDb.get(req.params.branch);
  if (!branchData) return res.status(404).json({ error: 'No deployments for this branch yet.' });
  
  // Returns the persistent branch URL and the deployment it currently points to
  res.json(branchData);
});


// --- Helper Functions (Mocks) ---
async function mockBuildProcess(repo, commit) {
  return new Promise((resolve, reject) => {
    // Simulate a 10 second build time
    const timeout = setTimeout(() => resolve(), 10000);
    // In reality, you'd store the timeout/PID to cancel it later
  });
}

function killRunningBuildProcess(deploymentId) {
  console.log(`[System] Sending kill signal to build process for ${deploymentId}`);
  // e.g., process.kill(buildProcesses[deploymentId].pid);
}

export { app, buildQueue, builderWorker };
