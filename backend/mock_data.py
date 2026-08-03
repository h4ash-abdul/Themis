from models import DecisionNode, Choice, BehavioralSignal, SimulationScenario

mock_scenario = SimulationScenario(
    id="scenario_1",
    title="The Fake Bank Call",
    start_node_id="node_1"
)

mock_nodes = {
    "node_1": DecisionNode(
        id="node_1",
        scenario_id="scenario_1",
        actor="Unknown Caller",
        text="Hello, this is fraud protection from your bank. We've detected a suspicious charge of $500. Have you made this transaction?",
        tactic_tags=["authority", "urgency"],
        choices=[
            Choice(
                id="choice_1_1",
                text="No, I didn't! What should I do?",
                next_node_id="node_2",
                signal=BehavioralSignal(tactic="authority", yielded=True, severity=0.3)
            ),
            Choice(
                id="choice_1_2",
                text="Which bank is this? I'll call you back on the official number.",
                next_node_id=None,
                signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0)
            )
        ]
    ),
    "node_2": DecisionNode(
        id="node_2",
        scenario_id="scenario_1",
        actor="Bank Representative",
        text="We need to secure your account immediately, or the transfer will clear in 10 minutes. Please confirm your account PIN so I can freeze it.",
        tactic_tags=["urgency", "false-legitimacy"],
        choices=[
            Choice(
                id="choice_2_1",
                text="Okay, my PIN is 1234.",
                next_node_id=None,
                signal=BehavioralSignal(tactic="urgency", yielded=True, severity=1.0)
            ),
            Choice(
                id="choice_2_2",
                text="I won't give my PIN over the phone.",
                next_node_id=None,
                signal=BehavioralSignal(tactic="urgency", yielded=False, severity=0.0)
            )
        ]
    ),
    "node_3": DecisionNode(
        id="node_3",
        scenario_id="scenario_2",
        actor="Local Police",
        text="This is Officer Davis. We have a warrant for your arrest regarding unpaid tax debts. If you don't pay the fine right now via crypto, officers will be dispatched.",
        tactic_tags=["authority", "fear"],
        choices=[
            Choice(
                id="choice_3_1",
                text="Oh no, please tell me how to pay!",
                next_node_id=None,
                signal=BehavioralSignal(tactic="authority", yielded=True, severity=1.0)
            ),
            Choice(
                id="choice_3_2",
                text="This sounds like a scam. I am hanging up.",
                next_node_id=None,
                signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0)
            )
        ]
    )
}

mock_scenario_2 = SimulationScenario(
    id="scenario_2",
    title="The Fake Police Call",
    start_node_id="node_3"
)

scenarios = [mock_scenario, mock_scenario_2]
