export type ScenarioOption = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  tactic: string;
};

export type ScenarioStep = {
  context: string;
  senderName: string;
  senderType: string;
  timestamp: string;
  message: string;
  options: ScenarioOption[];
};

export type Scenario = {
  id: string;
  title: string;
  subtitle: string;
  level: "FOUNDATIONAL" | "INTERMEDIATE" | "ADVANCED";
  duration: string;
  tags: string[];
  steps: ScenarioStep[];
};

export const scenarios: Scenario[] = [
  {
    id: "fraud-callback",
    title: "The Fraud Department Callback",
    subtitle: "A text about a blocked payment, then a call from someone very calm.",
    level: "FOUNDATIONAL",
    duration: "10 min",
    tags: ["Manufactured urgency", "Authority impersonation", "Safe-account myth"],
    steps: [
      {
        context: "You are on the sofa. Your phone buzzes with a message in the same thread as your real bank alerts.",
        senderName: "NORTHBANK",
        senderType: "Text message",
        timestamp: "21:47",
        message: "NORTHBANK: A payment of £842.00 to CRYPTO-EX LTD is pending. If this wasn't you, reply NO or call 0800 118 4402 immediately.",
        options: [
          {
            id: "opt1",
            text: "Reply NO straight away",
            isCorrect: false,
            tactic: "urgency",
            feedback: "By replying NO, you signal to the scammers that your phone number is active and you are responsive, making you a prime target for the follow-up phone call."
          },
          {
            id: "opt2",
            text: "Call the number in the message",
            isCorrect: false,
            tactic: "authority",
            feedback: "The number provided in the SMS connects directly to the scammers' fake call center, where they will impersonate your bank and ask for your credentials."
          },
          {
            id: "opt3",
            text: "Ignore the text entirely",
            isCorrect: true,
            tactic: "urgency",
            feedback: "Independent verification. You control the channel, so the attacker cannot control what you see. There was no pending payment."
          }
        ]
      },
      {
        context: "You ignored the text. Five minutes later, your phone rings. The caller ID says 'NORTHBANK FRAUD'.",
        senderName: "NORTHBANK FRAUD",
        senderType: "Voice Call",
        timestamp: "21:52",
        message: "Hello, this is James from the Northbank Fraud Team. We've detected an unauthorized attempt to transfer £842.00. Your account is currently compromised. Are you somewhere safe to talk?",
        options: [
          {
            id: "opt2_1",
            text: "Yes, how do we stop the transfer?",
            isCorrect: false,
            tactic: "fear",
            feedback: "Engaging confirms you are hooked. They will now escalate the urgency to panic you into transferring funds to a 'safe account'."
          },
          {
            id: "opt2_2",
            text: "Hang up immediately",
            isCorrect: true,
            tactic: "false-legitimacy",
            feedback: "Perfect. Scammers can easily spoof Caller ID to make it look like your bank is calling. Never trust incoming calls regarding fraud."
          },
          {
            id: "opt2_3",
            text: "Ask James for his employee ID",
            isCorrect: false,
            tactic: "false-legitimacy",
            feedback: "A scammer will simply invent an employee ID. This false sense of security tricks you into trusting them further."
          }
        ]
      },
      {
        context: "You hung up, but he calls right back. The phone is ringing persistently.",
        senderName: "NORTHBANK FRAUD",
        senderType: "Voice Call",
        timestamp: "21:53",
        message: "Please do not hang up. If you drop this call, we are legally required to freeze all your assets for 14 days pending a full fraud investigation.",
        options: [
          {
            id: "opt3_1",
            text: "Wait, don't freeze my accounts!",
            isCorrect: false,
            tactic: "fear",
            feedback: "Fear is a powerful motivator. By threatening your financial stability, they bypass your logical thinking."
          },
          {
            id: "opt3_2",
            text: "Hang up again and turn on Do Not Disturb",
            isCorrect: true,
            tactic: "fear",
            feedback: "Banks will never threaten to arbitrarily freeze your accounts for hanging up. This is pure manipulation."
          },
          {
            id: "opt3_3",
            text: "Say you will go to the branch tomorrow",
            isCorrect: false,
            tactic: "urgency",
            feedback: "They will counter this by saying the transfer clears in 10 minutes, forcing you back into their urgent timeline."
          }
        ]
      },
      {
        context: "You decided to listen to see what he wants. He sounds very professional.",
        senderName: "James (Scammer)",
        senderType: "Voice Call",
        timestamp: "21:54",
        message: "Thank you for staying on the line. To verify your identity and stop the transfer, I just sent a 6-digit verification code to your phone. Please read it back to me.",
        options: [
          {
            id: "opt4_1",
            text: "Read him the code to stop the transfer",
            isCorrect: false,
            tactic: "authority",
            feedback: "You just gave him the 2FA code to log into your actual bank account. He is now initiating the real transfer."
          },
          {
            id: "opt4_2",
            text: "Refuse to provide the code",
            isCorrect: true,
            tactic: "authority",
            feedback: "Banks will NEVER ask you to read a verification code back to them over the phone. Those codes are for your eyes only."
          }
        ]
      },
      {
        context: "Since you refused, his tone changes from helpful to severe.",
        senderName: "James (Scammer)",
        senderType: "Voice Call",
        timestamp: "21:55",
        message: "Sir, if you refuse to cooperate with a bank official during an active cybercrime investigation, I will have to dispatch the police to your address for complicity.",
        options: [
          {
            id: "opt5_1",
            text: "Argue that you haven't done anything wrong",
            isCorrect: false,
            tactic: "fear",
            feedback: "Arguing keeps you engaged. They want you emotional and defensive."
          },
          {
            id: "opt5_2",
            text: "End the call. Real bank employees don't threaten police action.",
            isCorrect: true,
            tactic: "fear",
            feedback: "Correct. The escalation to police threats is a classic sign of a scam unraveling."
          }
        ]
      },
      {
        context: "Let's pretend you stayed on. He 'calms down' and offers a solution.",
        senderName: "James (Scammer)",
        senderType: "Voice Call",
        timestamp: "21:56",
        message: "Look, I want to help you. The only way to secure your money from the hackers right now is to temporarily move it to a secure, government-backed vault account we've generated for you.",
        options: [
          {
            id: "opt6_1",
            text: "Ask for the account details to make the transfer",
            isCorrect: false,
            tactic: "isolation",
            feedback: "This is the 'Safe Account' myth. There is no such thing. You are just wiring money directly to the scammer."
          },
          {
            id: "opt6_2",
            text: "Tell him you're calling the police yourself",
            isCorrect: true,
            tactic: "isolation",
            feedback: "Calling their bluff breaks their control. They rely on you believing they are the only authority."
          }
        ]
      },
      {
        context: "Final push. He sends you an urgent text with account details.",
        senderName: "NORTHBANK",
        senderType: "Text message",
        timestamp: "21:58",
        message: "SECURE VAULT ACC: 88493022 SORT: 04-00-09. Transfer entire balance immediately to prevent loss.",
        options: [
          {
            id: "opt7_1",
            text: "Make the transfer",
            isCorrect: false,
            tactic: "urgency",
            feedback: "You have lost your money. Authorized Push Payment (APP) fraud is notoriously difficult to reverse."
          },
          {
            id: "opt7_2",
            text: "Block the number and call your bank's official number on the back of your card",
            isCorrect: true,
            tactic: "urgency",
            feedback: "The safest response. Independent verification through official channels guarantees you are talking to the real bank."
          }
        ]
      }
    ]
  },
  {
    id: "fake-recruiter",
    title: "The Recruiter Who Found You",
    subtitle: "A dream role, a fast offer, and one small equipment cost.",
    level: "INTERMEDIATE",
    duration: "7 min",
    tags: ["Reciprocity", "Sunk-cost framing", "Advance-fee pivot"],
    steps: [
      {
        context: "You receive an email on a Tuesday morning from a recruiter.",
        senderName: "Sarah, Tech Solutions Inc.",
        senderType: "Email",
        timestamp: "09:15",
        message: "Hi! I found your profile online and we have a fully remote Senior Developer position starting at $150k. Your background is a perfect fit. Can we do a quick text-based interview on Telegram today?",
        options: [
          {
            id: "opt1",
            text: "Download Telegram and message her",
            isCorrect: false,
            tactic: "false-legitimacy",
            feedback: "Legitimate companies do not conduct initial professional interviews over encrypted messaging apps like Telegram."
          },
          {
            id: "opt2",
            text: "Ask if you can do a video call instead",
            isCorrect: true,
            tactic: "false-legitimacy",
            feedback: "Scammers hate video calls because it exposes their identity or location."
          }
        ]
      },
      {
        context: "You hopped on Telegram. The 'interview' consists of 10 generic questions.",
        senderName: "Sarah (HR)",
        senderType: "Text message",
        timestamp: "10:30",
        message: "Great answers! Our hiring manager reviewed them and we'd love to offer you the job. We need you to start this Monday.",
        options: [
          {
            id: "opt2_1",
            text: "Accept the offer!",
            isCorrect: false,
            tactic: "urgency",
            feedback: "A job offer without a real voice/video interview or technical screening is a massive red flag."
          },
          {
            id: "opt2_2",
            text: "Say this feels too fast and ask for an official offer letter via email",
            isCorrect: true,
            tactic: "urgency",
            feedback: "Slowing down the process breaks their momentum."
          }
        ]
      },
      {
        context: "She sends an extremely professional-looking PDF offer letter. It has a corporate seal.",
        senderName: "Sarah, Tech Solutions Inc.",
        senderType: "Email",
        timestamp: "11:00",
        message: "Attached is your official offer. Please sign. Also, to set up your home office, we need you to purchase the approved MacBook Pro via our vendor portal for $2,500. We will reimburse you in your first paycheck.",
        options: [
          {
            id: "opt3_1",
            text: "Sign it and proceed to the portal",
            isCorrect: false,
            tactic: "authority",
            feedback: "This is the 'Advance-fee' scam. The job doesn't exist, and the 'vendor portal' goes straight to the scammer's crypto wallet."
          },
          {
            id: "opt3_2",
            text: "Tell them to buy it and ship it to you",
            isCorrect: true,
            tactic: "authority",
            feedback: "Real companies provide hardware. They don't make you buy it from a 'special portal' using your own money."
          }
        ]
      },
      {
        context: "She replies, citing 'company policy'.",
        senderName: "Sarah (HR)",
        senderType: "Text message",
        timestamp: "11:15",
        message: "Unfortunately, company policy requires contractors to procure their own equipment for tax reasons initially. If you don't purchase it today, we will have to move on to the next candidate.",
        options: [
          {
            id: "opt4_1",
            text: "Panic and buy it so you don't lose the $150k job",
            isCorrect: false,
            tactic: "fear",
            feedback: "They are using the fear of missing out (FOMO) on a life-changing salary to blind you to the obvious theft."
          },
          {
            id: "opt4_2",
            text: "Walk away from the offer",
            isCorrect: true,
            tactic: "fear",
            feedback: "Correct. No legitimate job requires you to pay to work for them."
          }
        ]
      },
      {
        context: "You tell her you don't have $2,500 upfront. She offers a 'solution'.",
        senderName: "Sarah (HR)",
        senderType: "Text message",
        timestamp: "11:20",
        message: "Okay, we can send you a check for $3,000. Deposit it, keep $500 as a sign-on bonus, and wire the remaining $2,500 to the vendor.",
        options: [
          {
            id: "opt5_1",
            text: "Accept the check",
            isCorrect: false,
            tactic: "false-legitimacy",
            feedback: "This is a Fake Check scam. The check will clear initially, you will wire real money, and two weeks later the check will bounce, leaving you $2,500 in debt."
          },
          {
            id: "opt5_2",
            text: "Refuse the check",
            isCorrect: true,
            tactic: "false-legitimacy",
            feedback: "Never accept checks from strangers who ask you to wire a portion of it elsewhere."
          }
        ]
      },
      {
        context: "She gets aggressive.",
        senderName: "Sarah (HR)",
        senderType: "Text message",
        timestamp: "11:25",
        message: "You already signed the employment contract. If you back out now, our legal team will sue you for breach of contract and wasting company resources.",
        options: [
          {
            id: "opt6_1",
            text: "Apologize and ask how to proceed",
            isCorrect: false,
            tactic: "fear",
            feedback: "The contract is fake. They are using legal threats to intimidate you into compliance."
          },
          {
            id: "opt6_2",
            text: "Block her on all platforms",
            isCorrect: true,
            tactic: "fear",
            feedback: "Blocking is the best defense. They have no legal standing."
          }
        ]
      },
      {
        context: "A final email arrives from a 'Lawyer'.",
        senderName: "Legal Dept",
        senderType: "Email",
        timestamp: "12:00",
        message: "NOTICE OF INTENT TO SUE: Pay a $500 cancellation fee via Bitcoin within 24 hours or we will file in small claims court.",
        options: [
          {
            id: "opt7_1",
            text: "Pay the $500 to make it go away",
            isCorrect: false,
            tactic: "fear",
            feedback: "Paying marks you as a lucrative target. They will keep demanding money."
          },
          {
            id: "opt7_2",
            text: "Mark as Spam and ignore",
            isCorrect: true,
            tactic: "fear",
            feedback: "Lawyers do not demand cancellation fees via Bitcoin. Completely ignore."
          }
        ]
      }
    ]
  },
  {
    id: "voice-clone",
    title: "The Voice You Recognise",
    subtitle: "Your daughter's voice, three seconds of it, and a number you don't know.",
    level: "ADVANCED",
    duration: "10 min",
    tags: ["Synthetic voice", "Acute distress", "Channel isolation"],
    steps: [
      {
        context: "You are at work. Your phone rings from an unknown number. When you answer, you hear your daughter crying.",
        senderName: "Unknown Number",
        senderType: "Voice Call",
        timestamp: "14:22",
        message: "'Mom, please help me! I'm so scared!'",
        options: [
          {
            id: "opt1",
            text: "Say 'Sarah, is that you? Where are you?'",
            isCorrect: false,
            tactic: "fear",
            feedback: "You just gave them her name. Scammers use short clips of crying (often AI-generated) and rely on you to fill in the blanks."
          },
          {
            id: "opt2",
            text: "Ask who is calling before giving a name",
            isCorrect: true,
            tactic: "fear",
            feedback: "Good. Never volunteer names. Let them prove they know who they are."
          }
        ]
      },
      {
        context: "A man's voice abruptly takes over the phone.",
        senderName: "Unknown Caller",
        senderType: "Voice Call",
        timestamp: "14:23",
        message: "Listen carefully. I have your daughter. She's in the back of my van. If you hang up or call the police, I will hurt her.",
        options: [
          {
            id: "opt2_1",
            text: "Beg him not to hurt her",
            isCorrect: false,
            tactic: "fear",
            feedback: "This confirms you believe the lie. They now have complete psychological control."
          },
          {
            id: "opt2_2",
            text: "Mute your phone and text your daughter on another device",
            isCorrect: true,
            tactic: "isolation",
            feedback: "This is the single most important step. Break the isolation and verify independently."
          }
        ]
      },
      {
        context: "The man demands money.",
        senderName: "Unknown Caller",
        senderType: "Voice Call",
        timestamp: "14:24",
        message: "I want $5,000 sent to me right now. Do you have a car? Drive to the nearest Bitcoin ATM immediately. Do not hang up the phone.",
        options: [
          {
            id: "opt3_1",
            text: "Say you are getting in the car",
            isCorrect: false,
            tactic: "urgency",
            feedback: "You are complying with their instructions. Bitcoin is untraceable, which is why kidnappers demand it."
          },
          {
            id: "opt3_2",
            text: "Tell him you need to hear her voice again",
            isCorrect: true,
            tactic: "isolation",
            feedback: "Scammers using AI voice clones often can't generate live conversational responses, so they will make excuses."
          }
        ]
      },
      {
        context: "He refuses to let her speak.",
        senderName: "Unknown Caller",
        senderType: "Voice Call",
        timestamp: "14:25",
        message: "No! You don't make the rules. She's tied up. Get in your car now or I'm pulling over to hurt her.",
        options: [
          {
            id: "opt4_1",
            text: "Ask him a question only your daughter would know (e.g., 'What's the dog's name?')",
            isCorrect: true,
            tactic: "false-legitimacy",
            feedback: "A 'Proof of Life' question is a great tactic if you can't reach her directly."
          },
          {
            id: "opt4_2",
            text: "Start driving to the bank",
            isCorrect: false,
            tactic: "fear",
            feedback: "You are operating purely on fear. Take a breath and attempt to verify."
          }
        ]
      },
      {
        context: "He gets angry at the question.",
        senderName: "Unknown Caller",
        senderType: "Voice Call",
        timestamp: "14:26",
        message: "Do you think this is a joke?! You're wasting time. I'm going to shoot her if you ask me one more stupid question.",
        options: [
          {
            id: "opt5_1",
            text: "Apologize and stop asking questions",
            isCorrect: false,
            tactic: "fear",
            feedback: "They use anger to shut down your critical thinking."
          },
          {
            id: "opt5_2",
            text: "Realize his inability to answer means she isn't there",
            isCorrect: true,
            tactic: "fear",
            feedback: "If he actually had her, getting the dog's name to secure $5,000 would be easy. He doesn't have her."
          }
        ]
      },
      {
        context: "Your other phone lights up. It's a text from your daughter.",
        senderName: "Sarah (Daughter)",
        senderType: "Text message",
        timestamp: "14:27",
        message: "Hey mom, I'm in class. Everything okay? Why are you calling me?",
        options: [
          {
            id: "opt6_1",
            text: "Tell the man on the phone you know he's lying",
            isCorrect: false,
            tactic: "authority",
            feedback: "There is no benefit to confronting a scammer. They might record your voice or harass you further."
          },
          {
            id: "opt6_2",
            text: "Silently hang up",
            isCorrect: true,
            tactic: "isolation",
            feedback: "You have verified she is safe. The scam is over. Terminate the connection immediately."
          }
        ]
      },
      {
        context: "The scammer texts you from a spoofed number.",
        senderName: "911 Dispatch",
        senderType: "Text message",
        timestamp: "14:28",
        message: "POLICE ALERT: We have surrounded the suspect. Do not block the number, we need you to negotiate.",
        options: [
          {
            id: "opt7_1",
            text: "Reply asking if Sarah is safe",
            isCorrect: false,
            tactic: "authority",
            feedback: "It's the scammer spoofing 911 to get you back on the hook."
          },
          {
            id: "opt7_2",
            text: "Ignore. Block the number.",
            isCorrect: true,
            tactic: "authority",
            feedback: "The police do not text you to negotiate hostage situations. Block and move on."
          }
        ]
      }
    ]
  }
];
