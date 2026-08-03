"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      question: "You receive an urgent phone call claiming your Social Security Number has been suspended due to suspicious activity. What should you do?",
      options: [
        "Verify your SSN with the caller to resolve the issue.",
        "Hang up immediately and ignore the call.",
        "Ask the caller for their badge number and then verify your SSN.",
        "Transfer money to the 'safe account' they provide."
      ],
      correct: 1,
      explanation: "The SSA will never suspend your number or call you threatening arrest or legal action. Hanging up is the only safe response to these vishing (voice phishing) attempts."
    },
    {
      question: "You get a text message from your bank with a link to verify a recent $500 charge you didn't make. What is the safest action?",
      options: [
        "Click the link to decline the charge immediately.",
        "Reply 'STOP' to the text message.",
        "Do not click the link; log into your bank app directly or call the number on the back of your card.",
        "Forward the message to your friends to warn them."
      ],
      correct: 2,
      explanation: "Scammers often use fake alerts to create urgency. Clicking the link takes you to a spoofed login page designed to steal your credentials."
    },
    {
      question: "Which of the following is the most secure way to handle online passwords?",
      options: [
        "Use a strong password like 'P@ssw0rd2024' for all your important accounts.",
        "Write your passwords down on a sticky note attached to your monitor.",
        "Use a password manager to generate and store unique, complex passwords for every site.",
        "Change your password every 30 days by adding a new number to the end."
      ],
      correct: 2,
      explanation: "Using a password manager ensures you have long, unique, and complex passwords for every service, minimizing the impact of any single data breach."
    },
    {
      question: "You receive an email from your company's CEO asking you to urgently purchase $500 in gift cards for a client presentation. What should you do?",
      options: [
        "Purchase the gift cards immediately using the corporate card.",
        "Reply to the email asking for confirmation.",
        "Ignore the email and wait for them to call you.",
        "Contact the CEO via a known internal communication channel (like Slack or phone) to verify."
      ],
      correct: 3,
      explanation: "This is a classic Business Email Compromise (BEC) and gift card scam. Always verify unusual financial requests out of band using trusted contact methods."
    },
    {
      question: "What is a 'Deepfake' in the context of cyber threats?",
      options: [
        "A very deep level of the dark web where hackers buy credentials.",
        "A highly convincing AI-generated audio or video used to impersonate someone.",
        "A type of malware that hides deep within your operating system kernel.",
        "A hacking technique used to bypass two-factor authentication."
      ],
      correct: 1,
      explanation: "Deepfakes use artificial intelligence to synthesize realistic human voices or faces, often used in vishing attacks to impersonate trusted individuals like family members or executives."
    },
    {
      question: "You get a pop-up on your computer warning that it is infected with a virus, prompting you to call a toll-free number for Support. What is the best action?",
      options: [
        "Call the number immediately to avoid losing your data.",
        "Download the recommended antivirus software from the pop-up.",
        "Close the browser window or restart your computer, and run a scan with your installed antivirus.",
        "Pay the requested fee to have the virus removed remotely."
      ],
      correct: 2,
      explanation: "Tech support pop-up scams rely on fear and urgency. Legitimate companies will never force you to call a number via a browser pop-up. Close the window; your computer is likely fine."
    },
    {
      question: "Why is it dangerous to use public USB charging stations (also known as 'juice jacking')?",
      options: [
        "They can overload and fry your phone's battery.",
        "Malicious charging ports can secretly transfer data or install malware on your device.",
        "They are often ungrounded and pose a shock hazard.",
        "They track your physical location via GPS."
      ],
      correct: 1,
      explanation: "Because USB cables transmit both power and data, compromised charging stations can silently steal data or inject malware. Use a 'data blocker' or charge via a wall outlet instead."
    }
  ];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentQuestion(q => q + 1);
  };

  if (currentQuestion >= questions.length) {
    return (
      <div className="font-mono flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tighter">QUIZ COMPLETE</h1>
        <div className="text-6xl font-black">
          {score} / {questions.length}
        </div>
        <p className="text-neutral-400 max-w-md">
          {score === questions.length 
            ? "Excellent situational awareness. Your defense posture is optimal." 
            : "Review the Cyber Awareness Portal to strengthen your defense posture."}
        </p>
        <button 
          onClick={() => {
            setCurrentQuestion(0);
            setScore(0);
            setSelectedOption(null);
            setShowExplanation(false);
          }}
          className="h-14 px-8 brutalist-border bg-white text-black font-bold uppercase hover:bg-neutral-200 transition-colors"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="font-mono max-w-3xl mx-auto mt-12">
      <div className="flex justify-between items-end border-b border-neutral-800 pb-4 mb-8">
        <h1 className="text-2xl font-bold tracking-tighter">THREAT ASSESSMENT</h1>
        <span className="text-neutral-500 text-sm">QUESTION {currentQuestion + 1} OF {questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h2 className="text-xl leading-relaxed">{q.question}</h2>

          <div className="space-y-4">
            {q.options.map((opt, idx) => {
              let btnClass = "w-full text-left p-4 brutalist-border transition-colors ";
              if (!showExplanation) {
                btnClass += "hover:bg-neutral-900 cursor-pointer";
              } else {
                btnClass += "cursor-default ";
                if (idx === q.correct) {
                  btnClass += "bg-green-950/30 border-green-500/50 text-green-400";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-950/30 border-red-500/50 text-red-400";
                } else {
                  btnClass += "opacity-50";
                }
              }

              return (
                <button 
                  key={idx} 
                  onClick={() => handleSelect(idx)}
                  className={btnClass}
                  disabled={showExplanation}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showExplanation && idx === q.correct && <CheckCircle size={20} />}
                    {showExplanation && idx === selectedOption && idx !== q.correct && <XCircle size={20} />}
                  </div>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-neutral-900 brutalist-border space-y-4"
            >
              <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400">Tactical Debriefing</h3>
              <p className="text-neutral-200">{q.explanation}</p>
              
              <button 
                onClick={handleNext}
                className="mt-4 h-12 px-6 brutalist-border bg-white text-black font-bold flex items-center justify-between hover:bg-neutral-200 transition-colors w-full"
              >
                <span>NEXT QUESTION</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
