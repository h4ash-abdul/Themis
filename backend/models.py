from pydantic import BaseModel
from typing import List, Optional, Dict

class BehavioralSignal(BaseModel):
    tactic: str
    yielded: bool
    severity: float

class Choice(BaseModel):
    id: str
    text: str
    next_node_id: Optional[str]
    signal: BehavioralSignal

class VoiceChoiceRequest(BaseModel):
    session_id: str
    spoken_text: str

class DecisionNode(BaseModel):
    id: str
    scenario_id: str
    actor: str
    text: str
    tactic_tags: List[str]
    choices: List[Choice]

class SimulationScenario(BaseModel):
    id: str
    title: str
    start_node_id: str


class VoiceDecisionNode(BaseModel):
    id: str
    scenario_id: str
    actor: str
    text: str
    tactic_tags: List[str]
    is_terminal: bool = False
    
class LLMEvaluationResult(BaseModel):
    yielded: bool
    severity: float
    tactic: str
    next_actor: str
    next_text: str
    next_tactic_tags: List[str]
    is_terminal: bool

class TacticProfile(BaseModel):
    encounters: int = 0
    yields: int = 0
    total_severity: float = 0.0
    
    @property
    def average_severity_yielded(self) -> float:
        return self.total_severity / self.yields if self.yields > 0 else 0.0

class BehavioralProfile(BaseModel):
    session_id: str
    tactics: Dict[str, TacticProfile] = {}
    
class StartSimulationRequest(BaseModel):
    session_id: str
    scenario_id: str

class ChoiceRequest(BaseModel):
    session_id: str
    choice_id: str
    
class ReportRequest(BaseModel):
    session_id: str
    tactic: str
    location: str
    description: str

class TextChoiceRequest(BaseModel):
    session_id: str
    tactic: str
    yielded: bool

