import { useState, useEffect } from 'react';
import { ArrowRight, GitBranch, PlayCircle, XCircle, Link2, TerminalSquare } from 'lucide-react';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: 'Build Queue',
      description: 'Smart queuing system that orchestrates your builds without overwhelming infrastructure.',
      icon: <TerminalSquare className="h-6 w-6 text-accent-lime" />,
    },
    {
      title: 'Branch-Specific URLs',
      description: 'Persistent URLs for every branch, updating automatically with each new commit.',
      icon: <GitBranch className="h-6 w-6 text-accent-blue" />,
    },
    {
      title: 'Preview Deployment URL',
      description: 'Shareable unique links generated instantly for every single code change.',
      icon: <Link2 className="h-6 w-6 text-accent-lightBlue" />,
    },
    {
      title: 'Cancel Deployment',
      description: 'Abort running builds instantly with one click to free up resources immediately.',
      icon: <XCircle className="h-6 w-6 text-accent-orange" />,
    },
  ];

  return (
    <div className="min-h-screen bg-navy-900 text-white selection:bg-accent-orange overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-6 md:px-16 border-b border-white/5 bg-navy-900/80 backdrop-blur-md">
        <div className="font-display text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          <PlayCircle className="text-accent-orange h-8 w-8" />
          Mission Beta
        </div>
        <button className="hidden md:block font-display text-[13px] font-semibold uppercase tracking-[0.08em] text-white hover:text-accent-orange transition-colors">
          Log In
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-16 hero-gradient flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* Background Grid Accent */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10 max-w-5xl text-center space-y-8">
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <span className="font-display text-[12px] font-semibold uppercase tracking-[0.11em] text-accent-blue mb-6 block">
              Automated Previews
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[100px] leading-[0.9] font-medium text-white mb-8">
              Test changes <br className="hidden md:block" />
              <span className="text-accent-lightBlue">before</span> production.
            </h1>
            <p className="font-body text-lg md:text-2xl text-accent-blue max-w-2xl mx-auto font-light leading-relaxed mb-12">
              Design a platform where every code change automatically creates an isolated preview environment that teammates can access through a unique URL.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <button className="w-full sm:w-auto bg-accent-orange hover:bg-accent-orangeHover text-white font-display text-[14px] font-semibold uppercase tracking-[0.08em] px-10 py-5 rounded-[2px] transition-all flex items-center justify-center gap-4 group">
              Start Deploying
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-transparent border border-white/20 hover:border-white/50 text-white font-display text-[14px] font-semibold uppercase tracking-[0.08em] px-10 py-5 rounded-[2px] transition-all">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Core Requirements / Features Section */}
      <section className="py-24 px-6 md:px-16 bg-navy-800 relative z-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 md:flex items-end justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl font-medium text-white mb-6">
                Automate the workflow from <span className="text-accent-lime">code update</span> to shareable preview.
              </h2>
            </div>
            <div className="hidden md:block">
              <span className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-accent-blue">
                Non-Negotiable Core Requirements
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="card-gradient border border-white/10 p-8 md:p-12 rounded-[4px] hover:border-white/20 transition-colors group"
              >
                <div className="bg-navy-900 w-14 h-14 flex items-center justify-center rounded-sm mb-8 group-hover:scale-110 transition-transform border border-white/5">
                  {feature.icon}
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-medium text-white mb-4">
                  {feature.title}
                </h3>
                <p className="font-body text-accent-blue text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className="py-32 px-6 md:px-16 flex flex-col items-center justify-center text-center">
        <h2 className="font-display text-4xl md:text-6xl font-medium text-white mb-8">
          Ready to isolate your <br/> preview environments?
        </h2>
        <button className="bg-accent-orange hover:bg-accent-orangeHover text-white font-display text-[14px] font-semibold uppercase tracking-[0.08em] px-10 py-5 rounded-[2px] transition-all flex items-center justify-center gap-4 group">
          Get Started Now
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    </div>
  );
}
