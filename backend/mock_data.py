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

mock_nodes_ta = {
    "node_1": DecisionNode(
        id="node_1",
        scenario_id="scenario_1",
        actor="Unknown Caller",
        text="வணக்கம், இது உங்கள் வங்கியின் மோசடி தடுப்பு பிரிவு. உங்கள் கணக்கில் $500 சந்தேகத்திற்குரிய பரிவர்த்தனையை நாங்கள் கண்டறிந்துள்ளோம். இந்த பரிவர்த்தனையை நீங்கள் செய்தீர்களா?",
        tactic_tags=["authority", "urgency"],
        choices=[
            Choice(
                id="choice_1_1",
                text="இல்லை, நான் செய்யவில்லை! நான் என்ன செய்ய வேண்டும்?",
                next_node_id="node_2",
                signal=BehavioralSignal(tactic="authority", yielded=True, severity=0.3)
            ),
            Choice(
                id="choice_1_2",
                text="இது எந்த வங்கி? அதிகாரப்பூர்வ எண்ணில் நான் உங்களை திரும்ப அழைக்கிறேன்.",
                next_node_id=None,
                signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0)
            )
        ]
    ),
    "node_2": DecisionNode(
        id="node_2",
        scenario_id="scenario_1",
        actor="Bank Representative",
        text="நாங்கள் உடனடியாக உங்கள் கணக்கைப் பாதுகாக்க வேண்டும், இல்லையெனில் 10 நிமிடங்களில் பணம் பரிமாற்றம் செய்யப்படும். உங்கள் கணக்கின் PIN-ஐ தயவுசெய்து உறுதிப்படுத்தவும், அப்போதுதான் நான் அதை முடக்க முடியும்.",
        tactic_tags=["urgency", "false-legitimacy"],
        choices=[
            Choice(
                id="choice_2_1",
                text="சரி, என் PIN 1234.",
                next_node_id=None,
                signal=BehavioralSignal(tactic="urgency", yielded=True, severity=1.0)
            ),
            Choice(
                id="choice_2_2",
                text="நான் தொலைபேசியில் என் PIN-ஐ வழங்க மாட்டேன்.",
                next_node_id=None,
                signal=BehavioralSignal(tactic="urgency", yielded=False, severity=0.0)
            )
        ]
    ),
    "node_3": DecisionNode(
        id="node_3",
        scenario_id="scenario_2",
        actor="Local Police",
        text="இது அதிகாரி டேவிஸ். செலுத்தப்படாத வரி பாக்கிகள் தொடர்பாக உங்களை கைது செய்வதற்கான வாரண்ட் எங்களிடம் உள்ளது. நீங்கள் இப்போதே கிரிப்டோ மூலம் அபராதத்தை செலுத்தவில்லை என்றால், அதிகாரிகள் அனுப்பப்படுவார்கள்.",
        tactic_tags=["authority", "fear"],
        choices=[
            Choice(
                id="choice_3_1",
                text="ஐயோ, எப்படி செலுத்துவது என்று சொல்லுங்கள்!",
                next_node_id=None,
                signal=BehavioralSignal(tactic="authority", yielded=True, severity=1.0)
            ),
            Choice(
                id="choice_3_2",
                text="இது ஒரு மோசடி போலத் தெரிகிறது. நான் அழைப்பை துண்டிக்கிறேன்.",
                next_node_id=None,
                signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0)
            )
        ]
    )
}

mock_nodes_hi = {
    "node_1": DecisionNode(
        id="node_1",
        scenario_id="scenario_1",
        actor="Unknown Caller",
        text="नमस्ते, यह आपके बैंक से धोखाधड़ी संरक्षण है। हमने $500 के एक संदिग्ध शुल्क का पता लगाया है। क्या आपने यह लेन-देन किया है?",
        tactic_tags=["authority", "urgency"],
        choices=[
            Choice(id="choice_1_1", text="नहीं, मैंने नहीं किया! मुझे क्या करना चाहिए?", next_node_id="node_2", signal=BehavioralSignal(tactic="authority", yielded=True, severity=0.3)),
            Choice(id="choice_1_2", text="यह कौन सा बैंक है? मैं आपको आधिकारिक नंबर पर वापस कॉल करूंगा।", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0))
        ]
    ),
    "node_2": DecisionNode(
        id="node_2",
        scenario_id="scenario_1",
        actor="Bank Representative",
        text="हमें आपके खाते को तुरंत सुरक्षित करने की आवश्यकता है, अन्यथा स्थानांतरण 10 मिनट में साफ़ हो जाएगा। कृपया अपने खाते के पिन की पुष्टि करें ताकि मैं इसे फ़्रीज़ कर सकूँ।",
        tactic_tags=["urgency", "false-legitimacy"],
        choices=[
            Choice(id="choice_2_1", text="ठीक है, मेरा पिन 1234 है।", next_node_id=None, signal=BehavioralSignal(tactic="urgency", yielded=True, severity=1.0)),
            Choice(id="choice_2_2", text="मैं फोन पर अपना पिन नहीं दूंगा।", next_node_id=None, signal=BehavioralSignal(tactic="urgency", yielded=False, severity=0.0))
        ]
    ),
    "node_3": DecisionNode(
        id="node_3",
        scenario_id="scenario_2",
        actor="Local Police",
        text="यह अधिकारी डेविस है। आपके पास कर ऋण का भुगतान न करने के संबंध में आपकी गिरफ्तारी का वारंट है। यदि आप अभी क्रिप्टो के माध्यम से जुर्माना नहीं भरते हैं, तो अधिकारियों को भेजा जाएगा।",
        tactic_tags=["authority", "fear"],
        choices=[
            Choice(id="choice_3_1", text="ओह नहीं, कृपया मुझे बताएं कि कैसे भुगतान करें!", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=True, severity=1.0)),
            Choice(id="choice_3_2", text="यह एक घोटाला लगता है। मैं फोन काट रहा हूँ।", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0))
        ]
    )
}

mock_nodes_ml = {
    "node_1": DecisionNode(
        id="node_1",
        scenario_id="scenario_1",
        actor="Unknown Caller",
        text="നമസ്കാരം, ഇത് നിങ്ങളുടെ ബാങ്കിൽ നിന്നുള്ള ഫ്രോഡ് പ്രൊട്ടക്ഷൻ ആണ്. $500-ന്റെ സംശയാസ്പദമായ ഒരു ഇടപാട് ഞങ്ങൾ കണ്ടെത്തി. നിങ്ങളാണോ ഈ ഇടപാട് നടത്തിയത്?",
        tactic_tags=["authority", "urgency"],
        choices=[
            Choice(id="choice_1_1", text="ഇല്ല, ഞാനല്ല! ഞാൻ എന്താണ് ചെയ്യേണ്ടത്?", next_node_id="node_2", signal=BehavioralSignal(tactic="authority", yielded=True, severity=0.3)),
            Choice(id="choice_1_2", text="ഇതേത് ബാങ്കാണ്? ഔദ്യോഗിക നമ്പറിൽ ഞാൻ തിരികെ വിളിക്കാം.", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0))
        ]
    ),
    "node_2": DecisionNode(
        id="node_2",
        scenario_id="scenario_1",
        actor="Bank Representative",
        text="ഞങ്ങൾക്ക് ഉടനടി നിങ്ങളുടെ അക്കൗണ്ട് സുരക്ഷിതമാക്കേണ്ടതുണ്ട്, അല്ലെങ്കിൽ 10 മിനിറ്റിനുള്ളിൽ പണം കൈമാറ്റം ചെയ്യപ്പെടും. അക്കൗണ്ട് മരവിപ്പിക്കുന്നതിനായി ദയവായി നിങ്ങളുടെ പിൻ സ്ഥിരീകരിക്കുക.",
        tactic_tags=["urgency", "false-legitimacy"],
        choices=[
            Choice(id="choice_2_1", text="ശരി, എന്റെ പിൻ 1234 ആണ്.", next_node_id=None, signal=BehavioralSignal(tactic="urgency", yielded=True, severity=1.0)),
            Choice(id="choice_2_2", text="ഫോണിലൂടെ ഞാൻ എന്റെ പിൻ നൽകില്ല.", next_node_id=None, signal=BehavioralSignal(tactic="urgency", yielded=False, severity=0.0))
        ]
    ),
    "node_3": DecisionNode(
        id="node_3",
        scenario_id="scenario_2",
        actor="Local Police",
        text="ഇത് ഓഫീസർ ഡേവിസ് ആണ്. അടയ്ക്കാത്ത നികുതി കുടിശ്ശിക സംബന്ധിച്ച് നിങ്ങളെ അറസ്റ്റ് ചെയ്യാൻ ഞങ്ങൾക്ക് വാറണ്ടുണ്ട്. നിങ്ങൾ ഇപ്പോൾ തന്നെ ക്രിപ്റ്റോ വഴി പിഴയടച്ചില്ലെങ്കിൽ, ഉദ്യോഗസ്ഥരെ അയയ്ക്കുന്നതാണ്.",
        tactic_tags=["authority", "fear"],
        choices=[
            Choice(id="choice_3_1", text="അയ്യോ, എങ്ങനെയാണ് പണമടക്കേണ്ടതെന്ന് ദയവായി പറയൂ!", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=True, severity=1.0)),
            Choice(id="choice_3_2", text="ഇതൊരു തട്ടിപ്പ് പോലെ തോന്നുന്നു. ഞാൻ ഫോൺ വെക്കുകയാണ്.", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0))
        ]
    )
}

mock_nodes_te = {
    "node_1": DecisionNode(
        id="node_1",
        scenario_id="scenario_1",
        actor="Unknown Caller",
        text="నమస్కారం, ఇది మీ బ్యాంక్ ఫ్రాడ్ ప్రొటెక్షన్ విభాగం. మేము $500 అనుమానాస్పద లావాదేవీని గుర్తించాము. ఈ లావాదేవీ మీరే చేశారా?",
        tactic_tags=["authority", "urgency"],
        choices=[
            Choice(id="choice_1_1", text="లేదు, నేను చేయలేదు! నేనేం చేయాలి?", next_node_id="node_2", signal=BehavioralSignal(tactic="authority", yielded=True, severity=0.3)),
            Choice(id="choice_1_2", text="ఇది ఏ బ్యాంక్? నేను అధికారిక నంబర్‌కు తిరిగి కాల్ చేస్తాను.", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0))
        ]
    ),
    "node_2": DecisionNode(
        id="node_2",
        scenario_id="scenario_1",
        actor="Bank Representative",
        text="మేము మీ ఖాతాను వెంటనే సురక్షితం చేయాలి, లేకపోతే 10 నిమిషాల్లో బదిలీ పూర్తవుతుంది. దయచేసి మీ ఖాతా పిన్‌ను నిర్ధారించండి, తద్వారా నేను దానిని స్తంభింపజేయగలను.",
        tactic_tags=["urgency", "false-legitimacy"],
        choices=[
            Choice(id="choice_2_1", text="సరే, నా പിన్ 1234.", next_node_id=None, signal=BehavioralSignal(tactic="urgency", yielded=True, severity=1.0)),
            Choice(id="choice_2_2", text="నేను ఫోన్‌లో నా పిన్ ఇవ్వను.", next_node_id=None, signal=BehavioralSignal(tactic="urgency", yielded=False, severity=0.0))
        ]
    ),
    "node_3": DecisionNode(
        id="node_3",
        scenario_id="scenario_2",
        actor="Local Police",
        text="ఇది ఆఫీసర్ డేవిస్. చెల్లించని పన్ను బకాయిలకు సంబంధించి మిమ్మల్ని అరెస్ట్ చేయడానికి మా వద్ద వారెంట్ ఉంది. మీరు ఇప్పుడే క్రిప్టో ద్వారా జరిమానా చెల్లించకపోతే, అధికారులు పంపబడతారు.",
        tactic_tags=["authority", "fear"],
        choices=[
            Choice(id="choice_3_1", text="అయ్యో, దయచేసి ఎలా చెల్లించాలో చెప్పండి!", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=True, severity=1.0)),
            Choice(id="choice_3_2", text="ఇది స్కామ్ లాగా ఉంది. నేను ఫోన్ కట్ చేస్తున్నాను.", next_node_id=None, signal=BehavioralSignal(tactic="authority", yielded=False, severity=0.0))
        ]
    )
}

scenarios = [mock_scenario, mock_scenario_2]
