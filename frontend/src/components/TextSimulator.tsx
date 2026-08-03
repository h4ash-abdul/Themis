"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scenarios, Scenario, ScenarioStep, ScenarioOption } from "@/data/scenarios";
import { Play, MessageSquare, Mail, Phone, ArrowRight, ArrowLeft, Lightbulb } from "lucide-react";

export default function TextSimulator({ onBack }: { onBack: () => void }) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scenarioComplete, setScenarioComplete] = useState(false);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "text message": return <MessageSquare size={16} className="text-yellow-500" />;
      case "email": return <Mail size={16} className="text-yellow-500" />;
      case "voice call": return <Phone size={16} className="text-yellow-500" />;
      default: return <MessageSquare size={16} className="text-yellow-500" />;
    }
  };

  const handleOptionSelect = async (opt: ScenarioOption) => {
    if (selectedOption) return; // Prevent changing answer
    setSelectedOption(opt.id);

    // Report choice to backend
    const sessionId = localStorage.getItem("themis_session_id") || "anonymous";
    try {
      await fetch("http://localhost:8000/api/simulation/text_choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          tactic: opt.tactic,
          yielded: !opt.isCorrect
        })
      });
    } catch (err) {
      console.error("Failed to report choice", err);
    }
  };

  const handleContinue = () => {
    if (!selectedScenario) return;
    
    if (currentStepIndex < selectedScenario.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setScenarioComplete(true);
    }
  };

  const resetSimulator = () => {
    setSelectedScenario(null);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setScenarioComplete(false);
  };

  if (selectedScenario) {
    if (scenarioComplete) {
      return (
        <div className="w-full max-w-4xl mx-auto py-24 z-10 flex flex-col min-h-[70vh] items-center justify-center text-center space-y-8 font-mono">
          <h2 className="text-5xl font-black text-white">SIMULATION COMPLETE</h2>
          <p className="text-neutral-400 max-w-xl">
            You have successfully navigated this threat scenario. Remember these tactics when you face them in the real world.
          </p>
          <button 
            onClick={resetSimulator}
            className="h-14 px-8 border border-white bg-white text-black font-bold uppercase hover:bg-neutral-200 transition-colors mt-8"
          >
            RETURN TO MENU
          </button>
        </div>
      );
    }

    const currentStep: ScenarioStep = selectedScenario.steps[currentStepIndex];
    const progressPercentage = ((currentStepIndex + (selectedOption ? 1 : 0)) / selectedScenario.steps.length) * 100;
    
    // Find the currently selected option object for feedback
    const activeOption = currentStep.options.find(opt => opt.id === selectedOption);

    return (
      <div className="w-full max-w-4xl mx-auto py-12 z-10 flex flex-col min-h-[70vh] font-mono">
        <button 
          onClick={resetSimulator}
          className="self-start flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8 font-mono text-sm"
        >
          <ArrowLeft size={16} /> BACK TO SCENARIOS
        </button>

        <motion.div 
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          {/* Progress Bar */}
          <div className="w-full h-1 bg-neutral-900 mb-8">
            <motion.div 
              className="h-full bg-yellow-500"
              initial={{ width: `${(currentStepIndex / selectedScenario.steps.length) * 100}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Context */}
          <p className="text-neutral-400 italic">
            {currentStep.context}
          </p>

          {/* Message Box */}
          <div className="border border-neutral-800 bg-[#0a0a0a] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-neutral-900 flex items-center justify-center border border-neutral-800">
                  {getIcon(currentStep.senderType)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm tracking-wide uppercase">{currentStep.senderName}</div>
                  <div className="text-neutral-500 text-xs">{currentStep.senderType}</div>
                </div>
              </div>
              <div className="text-neutral-500 text-sm">{currentStep.timestamp}</div>
            </div>
            <p className="text-white text-lg leading-relaxed font-sans">
              {currentStep.message}
            </p>
          </div>

          {/* Interaction Area */}
          <div className="space-y-4 pt-4">
            <AnimatePresence mode="wait">
              {!selectedOption ? (
                <motion.div 
                  key="options"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  {currentStep.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleOptionSelect(opt)}
                      className="w-full text-left p-5 border border-neutral-800 hover:border-white hover:bg-neutral-900 transition-all flex items-center justify-between group"
                    >
                      <span className="text-lg text-white">
                        {opt.text}
                      </span>
                      <ArrowRight size={20} className="text-neutral-600 group-hover:text-white transition-colors" />
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  key="feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-yellow-600/50 bg-[#0f0f0a] p-6 space-y-6"
                >
                  <div className="flex items-center gap-3 text-yellow-500 font-bold uppercase tracking-widest text-sm">
                    <Lightbulb size={18} />
                    WHAT JUST HAPPENED
                  </div>
                  
                  <p className="text-white leading-relaxed">
                    {activeOption?.feedback}
                  </p>

                  <button 
                    onClick={handleContinue}
                    className="bg-yellow-500 text-black font-bold px-8 py-3 hover:bg-yellow-400 transition-colors uppercase"
                  >
                    Continue
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 z-10 flex flex-col min-h-[70vh] font-mono">
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-12 text-sm"
      >
        <ArrowLeft size={16} /> BACK TO MAIN MENU
      </button>

      <div className="space-y-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">Choose your exposure</h2>
        <p className="text-neutral-400 text-lg max-w-2xl font-sans">
          Each simulation is a real attack pattern reconstructed decision by decision. There are no trick questions — only the pressure the attacker actually applies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.id}
            className="border border-neutral-800 bg-[#0a0a0a] p-8 flex flex-col justify-between space-y-8 hover:border-neutral-500 transition-colors group cursor-pointer"
            onClick={() => { setSelectedScenario(scenario); setCurrentStepIndex(0); setSelectedOption(null); }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-bold tracking-widest uppercase">
                <span className="text-yellow-500">{scenario.level}</span>
                <span className="text-neutral-500 flex items-center gap-1">
                  ⏱ {scenario.duration}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white uppercase">{scenario.title}</h3>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans">
                {scenario.subtitle}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-4">
                {scenario.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 border border-neutral-700 rounded-full text-xs text-neutral-300 bg-neutral-900/50 uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-yellow-500 font-bold text-sm group-hover:text-yellow-400 transition-colors uppercase tracking-widest">
              <Play size={16} /> Begin simulation
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
