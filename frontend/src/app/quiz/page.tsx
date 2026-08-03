"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const { t, getNestedObject } = useTranslation();
  
  const questions: any[] = getNestedObject("quiz.questions") || [];

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
        <h1 className="text-2xl font-bold tracking-tighter">{t("quiz.title")}</h1>
        <span className="text-neutral-500 text-sm">{t("quiz.question")} {currentQuestion + 1} / {questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <h2 className="text-xl leading-relaxed">{q?.question}</h2>

          <div className="space-y-4">
            {q?.options.map((opt: string, idx: number) => {
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
              <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400">{t("quiz.tactical_debriefing")}</h3>
              <p className="text-neutral-200">{q?.explanation}</p>
              
              <button 
                onClick={handleNext}
                className="mt-4 h-12 px-6 brutalist-border bg-white text-black font-bold flex items-center justify-between hover:bg-neutral-200 transition-colors w-full"
              >
                <span>{t("quiz.next_question")}</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
