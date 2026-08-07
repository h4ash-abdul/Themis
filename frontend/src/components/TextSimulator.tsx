"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scenarios, Scenario, ScenarioStep, ScenarioOption } from "@/data/scenarios";
import { scenariosTa } from "@/data/scenariosTa";
import { scenariosHi } from "@/data/scenariosHi";
import { scenariosMl } from "@/data/scenariosMl";
import { scenariosTe } from "@/data/scenariosTe";
import { AlertTriangle, ArrowRight, MessageSquare, Mail, Phone, Lightbulb, Play } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function TextSimulator({ onBack }: { onBack: () => void }) {
  const { t, locale } = useTranslation();
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
    if (selectedOption) return;
    setSelectedOption(opt.id);

    let sessionId = localStorage.getItem("themis_session_id");
    if (!sessionId || sessionId === "anonymous") {
      sessionId = crypto.randomUUID();
      localStorage.setItem("themis_session_id", sessionId);
    }

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      await fetch(`${API_URL}/api/simulation/text_choice`, {
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
          <h2 className="text-3xl font-bold">{t("text_simulator.analysis_complete")}</h2>
          <p className="text-neutral-400">
            {t("simulator.session_logged")}
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="h-12 px-8 border border-white text-white font-bold uppercase hover:bg-neutral-800 transition-colors"
            >
              {t("text_simulator.view_behavioral_profile")}
            </button>
            <button 
              onClick={resetSimulator}
              className="h-12 px-8 border border-neutral-700 hover:bg-neutral-900 transition-colors uppercase font-bold"
            >
              {t("simulator.restart")}
            </button>
          </div>
        </div>
      );
    }

    const currentStep: ScenarioStep = selectedScenario.steps[currentStepIndex];
    const progressPercentage = ((currentStepIndex + (selectedOption ? 1 : 0)) / selectedScenario.steps.length) * 100;
    
    const activeOption = currentStep.options.find(opt => opt.id === selectedOption);

    return (
      <div className="w-full max-w-4xl mx-auto py-12 z-10 flex flex-col min-h-[70vh] font-mono">
        <button 
          onClick={resetSimulator}
          className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest mb-12"
        >
          <ArrowRight size={16} className="rotate-180" />
          {t("text_simulator.terminate_connection")}
        </button>

        <motion.div 
          key={currentStepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="w-full h-1 bg-neutral-900 mb-8">
            <motion.div 
              className="h-full bg-yellow-500"
              initial={{ width: `${(currentStepIndex / selectedScenario.steps.length) * 100}%` }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="text-neutral-400 italic">
            {currentStep.context}
          </p>

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
                  <div className="flex items-center gap-4 text-yellow-500 border-b border-yellow-900/50 pb-4">
                    <AlertTriangle size={32} />
                    <h2 className="text-2xl font-bold tracking-widest">{t("text_simulator.what_just_happened")}</h2>
                  </div>
                  
                  <div className="text-lg text-yellow-100 leading-relaxed space-y-4">
                    <p>{activeOption?.feedback}</p>
                    <p className="text-sm text-yellow-500/70 pt-4 uppercase tracking-widest border-t border-yellow-900/30">
                      {t("simulator.tactics")}: {t(`tactics.${activeOption?.tactic || 'unknown'}`)}
                    </p>
                  </div>

                  <button 
                    onClick={handleContinue}
                    className="w-full h-12 border border-yellow-500/50 hover:bg-yellow-500 hover:text-black transition-colors flex items-center justify-between px-6"
                  >
                    <span>{t("text_simulator.continue")}</span>
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  const activeScenarios = 
    locale === "ta" ? scenariosTa : 
    locale === "hi" ? scenariosHi : 
    locale === "ml" ? scenariosMl : 
    locale === "te" ? scenariosTe : 
    scenarios;

  return (
    <div className="w-full max-w-6xl mx-auto py-12 z-10 flex flex-col min-h-[70vh] font-mono">
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-12 text-sm"
      >
        <ArrowRight size={16} className="rotate-180" /> {t("text_simulator.back_to_menu")}
      </button>

      <div className="space-y-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">{t("home.text_scenarios")}</h2>
        <p className="text-neutral-400 text-lg max-w-2xl font-sans">
          {t("text_simulator.description")}
        </p>
      </div>

      <div className="space-y-6">
        {activeScenarios.map((scenario) => (
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
