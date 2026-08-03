import json
import fakeredis
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import Optional, List
import random

from models import StartSimulationRequest, ChoiceRequest, ReportRequest, DecisionNode, VoiceChoiceRequest, VoiceDecisionNode, LLMEvaluationResult, BehavioralProfile, TacticProfile, TextChoiceRequest
from mock_data import mock_nodes, mock_nodes_ta, mock_nodes_hi, mock_nodes_ml, mock_nodes_te, scenarios
from database import create_db_and_tables, get_session, ScamReport, engine

app = FastAPI(title="THEMIS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = fakeredis.FakeRedis(decode_responses=True)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def get_session_key(session_id: str) -> str:
    return f"sim:session:{session_id}"

@app.post("/api/simulation/start", response_model=DecisionNode)
def start_simulation(req: StartSimulationRequest, db: Session = Depends(get_session)):
    # Dynamic Generation Phase 4
    # Check trending tactics in DB
    statement = select(ScamReport.tactic)
    reports = db.exec(statement).all()
    
    selected_scenario = scenarios[0] # Default
    if reports:
        # Simple trend logic: most common tactic
        trending_tactic = max(set(reports), key=reports.count)
        # Find a scenario that tests this tactic
        for scenario in scenarios:
            start_node = mock_nodes.get(scenario.start_node_id)
            if start_node and trending_tactic in start_node.tactic_tags:
                selected_scenario = scenario
                break
    
    if req.locale == "ta":
        nodes = mock_nodes_ta
    elif req.locale == "hi":
        nodes = mock_nodes_hi
    elif req.locale == "ml":
        nodes = mock_nodes_ml
    elif req.locale == "te":
        nodes = mock_nodes_te
    else:
        nodes = mock_nodes
    start_node = nodes.get(selected_scenario.start_node_id)
    if not start_node:
        raise HTTPException(status_code=500, detail="Start node not found")
        
    session_data = {
        "scenario_id": selected_scenario.id,
        "current_node_id": start_node.id,
        "history": [],
        "profile": BehavioralProfile(session_id=req.session_id, tactics={}).model_dump_json(),
        "locale": req.locale
    }
    redis_client.set(get_session_key(req.session_id), json.dumps(session_data))
    return start_node

@app.post("/api/simulation/choice", response_model=DecisionNode)
def submit_choice(req: ChoiceRequest):
    session_key = get_session_key(req.session_id)
    session_json = redis_client.get(session_key)
    if not session_json:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session_data = json.loads(session_json)
    current_node = mock_nodes.get(session_data["current_node_id"])
    chosen = next((c for c in current_node.choices if c.id == req.choice_id), None)
    if not chosen:
        raise HTTPException(status_code=400, detail="Invalid choice ID")
        
    profile = BehavioralProfile.model_validate_json(session_data["profile"])
    signal = chosen.signal
    
    if signal.tactic not in profile.tactics:
        profile.tactics[signal.tactic] = TacticProfile()
        
    tactic_stat = profile.tactics[signal.tactic]
    tactic_stat.encounters += 1
    if signal.yielded:
        tactic_stat.yields += 1
        tactic_stat.total_severity += signal.severity
        
    session_data["profile"] = profile.model_dump_json()
    session_data["history"].append(req.choice_id)
    
    next_node = mock_nodes.get(chosen.next_node_id) if chosen.next_node_id else None
    session_data["current_node_id"] = chosen.next_node_id if next_node else None
        
    redis_client.set(session_key, json.dumps(session_data))
    
import os
from google import genai
from google.genai import types

# Load env variables (for GEMINI_API_KEY)
from dotenv import load_dotenv
load_dotenv()

try:
    gemini_client = genai.Client()
except Exception:
    gemini_client = None

@app.post("/api/simulation/voice_choice", response_model=VoiceDecisionNode)
def submit_voice_choice(req: VoiceChoiceRequest):
    session_key = get_session_key(req.session_id)
    session_json = redis_client.get(session_key)
    if not session_json:
        raise HTTPException(status_code=404, detail="Session not found")
        
    session_data = json.loads(session_json)
    step_count = session_data.get("step_count", 0) + 1
    
    # In a real app we'd retrieve the conversation history to give the LLM context.
    # For now, we simulate the LLM call or actually call it if key is present.
    
    prompt = f"""
    You are roleplaying as a scammer on the phone. The user just said: "{req.spoken_text}".
    This is step {step_count} of 10.
    Did the user yield to your tactic? (true/false)
    What is the severity of their yield? (0.0 to 1.0)
    What tactic did you use previously? (e.g. authority, urgency, fear)
    What should you say next to escalate the scam?
    What tactic are you using now?
    """

    if req.locale == "ta":
        prompt += "\nIMPORTANT: Your generated text (next_text) MUST be in the Tamil language (தமிழ்)."
    elif req.locale == "hi":
        prompt += "\nIMPORTANT: Your generated text (next_text) MUST be in the Hindi language (हिन्दी)."
    elif req.locale == "ml":
        prompt += "\nIMPORTANT: Your generated text (next_text) MUST be in the Malayalam language (മലയാളം)."
    elif req.locale == "te":
        prompt += "\nIMPORTANT: Your generated text (next_text) MUST be in the Telugu language (తెలుగు)."

    if gemini_client and os.getenv("GEMINI_API_KEY"):
        try:
            response = gemini_client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=LLMEvaluationResult,
                    temperature=0.7,
                ),
            )
            result = LLMEvaluationResult.model_validate_json(response.text)
        except Exception:
            result = None
    else:
        result = None

    if result is None:
        # Fallback to g4f (GPT4Free) for intelligent responses without an API key!
        try:
            from g4f.client import Client as G4FClient
            from g4f.Provider import DuckDuckGo
            import re
            
            g4f_client = G4FClient()
            g4f_prompt = prompt + "\n\nRespond ONLY with a valid JSON object strictly matching this schema: {\"yielded\": bool, \"severity\": float, \"tactic\": string, \"next_actor\": string, \"next_text\": string, \"next_tactic_tags\": [string], \"is_terminal\": bool}"
            
            response = g4f_client.chat.completions.create(
                model="gpt-4o-mini",
                provider=DuckDuckGo,
                messages=[{"role": "user", "content": g4f_prompt}]
            )
            
            text = response.choices[0].message.content
            # Clean up potential markdown formatting from free providers
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
                
            # Try to parse the JSON
            result = LLMEvaluationResult.model_validate_json(text)
        except Exception as e:
            print("G4F Failed:", e)
            result = None
            
    if result is None:
        # Last resort fallback if both Gemini and G4F fail
        text = req.spoken_text.lower()
        if any(w in text for w in ["yes", "ok", "okay", "sure", "fine", "alright"]):
            reply = random.choice([
                "Good. Now provide your social security number for verification.",
                "Excellent. Let's proceed with the payment.",
                "Thank you for cooperating. Read me the 16 digits on the front of your card."
            ])
            tactic = "authority"
            yielded = True
        elif any(w in text for w in ["no", "stop", "why", "who", "fake", "scam"]):
            reply = random.choice([
                "If you refuse to cooperate, I will dispatch the local police to your house immediately.",
                "Do not question me! This is a federal matter and you are in serious trouble.",
                "This is your final warning. Comply right now or face severe legal consequences."
            ])
            tactic = "fear"
            yielded = False
        else:
            reply = random.choice([
                "I don't have time for this nonsense. Are you going to pay the fine or not?",
                "Listen to me carefully. Your bank accounts will be frozen in 10 minutes if you do not do exactly as I say.",
                "I am transferring this case to the legal department if you don't cooperate right now."
            ])
            tactic = "urgency"
            yielded = False
            
        result = LLMEvaluationResult(
            yielded=yielded, severity=0.5, tactic=tactic,
            next_actor="Scammer", next_text=reply,
            next_tactic_tags=[tactic], is_terminal=False
        )

    # Process signal
    profile = BehavioralProfile.model_validate_json(session_data["profile"])
    
    if result.tactic not in profile.tactics:
        profile.tactics[result.tactic] = TacticProfile()
        
    tactic_stat = profile.tactics[result.tactic]
    tactic_stat.encounters += 1
    if result.yielded:
        tactic_stat.yields += 1
        tactic_stat.total_severity += result.severity
        
    is_terminal = step_count >= 5
    
    new_node = VoiceDecisionNode(
        id=f"node_{step_count}",
        scenario_id=session_data["scenario_id"],
        actor=result.next_actor,
        text=result.next_text,
        tactic_tags=result.next_tactic_tags,
        is_terminal=is_terminal
    )
    
    session_data["profile"] = profile.model_dump_json()
    session_data["step_count"] = step_count
    session_data["history"].append(req.spoken_text)
    session_data["current_node_id"] = new_node.id if not is_terminal else None
        
    redis_client.set(session_key, json.dumps(session_data))
    
    return new_node

@app.get("/api/simulation/profile/{session_id}", response_model=BehavioralProfile)

def get_profile(session_id: str):
    session_json = redis_client.get(get_session_key(session_id))
    if not session_json:
        raise HTTPException(status_code=404, detail="Session not found")
    return BehavioralProfile.model_validate_json(json.loads(session_json)["profile"])

@app.post("/api/simulation/text_choice")
def submit_text_choice(req: TextChoiceRequest):
    session_key = get_session_key(req.session_id)
    session_json = redis_client.get(session_key)
    if not session_json:
        # Create a new profile if they didn't hit /start
        profile = BehavioralProfile(session_id=req.session_id, tactics={})
        session_data = {"profile": profile.model_dump_json(), "history": []}
    else:
        session_data = json.loads(session_json)
        profile = BehavioralProfile.model_validate_json(session_data["profile"])
        
    if req.tactic not in profile.tactics:
        profile.tactics[req.tactic] = TacticProfile()
        
    tactic_stat = profile.tactics[req.tactic]
    tactic_stat.encounters += 1
    if req.yielded:
        tactic_stat.yields += 1
        tactic_stat.total_severity += 0.5 # Default severity for text choices
        
    session_data["profile"] = profile.model_dump_json()
    redis_client.set(session_key, json.dumps(session_data))
    return {"status": "success"}

@app.post("/api/reports", response_model=dict)
def submit_report(req: ReportRequest, db: Session = Depends(get_session)):
    report = ScamReport(
        session_id=req.session_id,
        tactic=req.tactic,
        location=req.location,
        description=req.description
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return {"status": "success", "report_id": report.id}

@app.get("/api/reports/trends")
def get_trends(db: Session = Depends(get_session)):
    reports = db.exec(select(ScamReport)).all()
    trends = {}
    for r in reports:
        trends[r.tactic] = trends.get(r.tactic, 0) + 1
    return [{"name": k, "value": v} for k, v in trends.items()]

