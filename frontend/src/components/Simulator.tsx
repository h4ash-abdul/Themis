"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Terminal, ArrowRight, Mic, MicOff, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TextSimulator from "@/components/TextSimulator";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { useTranslation } from "@/lib/i18n";

interface TacticProfile {
  encounters: number;
  yields: number;
  average_severity_yielded: number;
}

interface BehavioralProfile {
  session_id: string;
  tactics: Record<string, TacticProfile>;
}

interface VoiceDecisionNode {
  id: string;
  scenario_id: string;
  actor: string;
  text: string;
  tactic_tags: string[];
  is_terminal: boolean;
}

interface SimulationSession {
  sessionId: string;
  scenarioId: string;
}

export default function Simulator() {
  const [session, setSession] = useState<SimulationSession | null>(null);
  const [currentNode, setCurrentNode] = useState<VoiceDecisionNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [interruption, setInterruption] = useState<{tactic: string, text: string} | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const { t, locale } = useTranslation();
  
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const transcriptRef = useRef(""); 
  const silenceTimeoutRef = useRef<any>(null); 
  const sessionRef = useRef(session);

  // Keep refs in sync
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
          let finalStr = "";
          for (let i = 0; i < event.results.length; i++) {
            finalStr += event.results[i][0].transcript;
          }
          
          setTranscript(finalStr);
          transcriptRef.current = finalStr; // update synchronously

          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
          }
          
          silenceTimeoutRef.current = setTimeout(() => {
            if (isListeningRef.current && transcriptRef.current.trim()) {
              isListeningRef.current = false;
              setIsListening(false);
              recognition.stop();
              
              const finalSubmission = transcriptRef.current;
              transcriptRef.current = "";
              setTranscript("");
              
              // We must use sessionRef because handleVoiceSubmit in this closure has stale session state!
              if (sessionRef.current) {
                // Call handleVoiceSubmit manually instead of relying on the stale closure version if we want,
                // BUT the stale handleVoiceSubmit also captures `session`!
                // So we must rewrite handleVoiceSubmit or just do the fetch here.
                // Actually, handleVoiceSubmit is NOT recreated, it uses the stale state.
                // Let's call a safe submit function!
                safeVoiceSubmit(finalSubmission, sessionRef.current.sessionId);
              }
            }
          }, 1500);
        };
        
        recognition.onend = () => {
          if (isListeningRef.current) {
            try {
              recognition.start();
            } catch (e) {
              console.warn("Could not auto-restart mic", e);
              isListeningRef.current = false;
              setIsListening(false);
            }
          }
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const safeVoiceSubmit = async (spoken_text: string, currentSessionId: string) => {
    if (!currentSessionId || !spoken_text.trim()) return;
    
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/simulation/voice_choice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: currentSessionId,
          spoken_text,
          locale
        })
      });
      
      const nextNode = await res.json();
      if (nextNode.is_terminal) {
        setIsFinished(true);
        setCurrentNode(null);
        speak(t("simulator.session_logged"));
      } else {
        setCurrentNode(nextNode);
        speak(nextNode.text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Text-To-Speech
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      
      let preferredVoice;
      if (locale === "ta") {
        preferredVoice = voices.find(v => v.lang.includes("ta") || v.name.includes("Tamil"));
      } else if (locale === "hi") {
        preferredVoice = voices.find(v => v.lang.includes("hi") || v.name.includes("Hindi"));
      } else if (locale === "ml") {
        preferredVoice = voices.find(v => v.lang.includes("ml") || v.name.includes("Malayalam"));
      } else if (locale === "te") {
        preferredVoice = voices.find(v => v.lang.includes("te") || v.name.includes("Telugu"));
      }
      
      if (!preferredVoice) {
        preferredVoice = voices.find(v => 
          v.name.includes("Online (Natural)") || 
          v.name.includes("Google US English") || 
          v.name.includes("Google UK English Male")
        );
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      }
      
      utterance.rate = locale === "en" ? 1.25 : 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListen = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    if (isListening) {
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current.stop();
      if (transcript.trim() && session) {
        safeVoiceSubmit(transcript, session.sessionId);
      }
    } else {
      setTranscript("");
      isListeningRef.current = true;
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Mic already started", e);
      }
    }
  };

  // Initialize Session
  const [simulatorMode, setSimulatorMode] = useState<"menu" | "text">("menu");

  const startSimulation = async () => {
    setLoading(true);
    try {
      const newSessionId = crypto.randomUUID();
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/simulation/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: newSessionId,
          scenario_id: "scenario_1",
          locale
        })
      });
      if (!res.ok) throw new Error("Failed to start simulation");
      const data = await res.json();
      setSession({ sessionId: newSessionId, scenarioId: data.scenario_id });
      localStorage.setItem("themis_session_id", newSessionId);
      setCurrentNode({
        ...data,
        is_terminal: false
      });
      speak(data.text);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceSubmit = async (spoken_text: string) => {
    if (!session || !spoken_text.trim()) return;
    
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_URL}/api/simulation/voice_choice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: session.sessionId,
          spoken_text,
          locale
        })
      });
      
      const nextNode = await res.json();
      
      // We don't have explicit yielding passed to the frontend in the new model directly in the node,
      // But we can check if the backend recorded a yield in the profile or just let the LLM handle the flow.
      // For simplicity here, we rely on the LLM's continuity.
      
      if (nextNode.is_terminal) {
        setIsFinished(true);
        setCurrentNode(null);
        speak(t("simulator.session_logged"));
      } else {
        setCurrentNode(nextNode);
        speak(nextNode.text);
        setTranscript("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearInterruption = () => {
    setInterruption(null);
  };

  // Start Screen
  if (!session && !isFinished) {
    if (simulatorMode === "text") {
      return <TextSimulator onBack={() => setSimulatorMode("menu")} />;
    }

    return (
      <div className="w-full flex-1 flex flex-col z-10 font-mono">
        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl text-center space-y-12"
          >
            <div className="space-y-6">
              <h1 
                className="text-7xl md:text-[9rem] font-black tracking-tighter leading-none"
                style={{
                  backgroundImage: "radial-gradient(circle, white 2px, transparent 2.5px)",
                  backgroundSize: "8px 8px",
                  backgroundPosition: "center",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                THEMIS
              </h1>
              <p className="text-neutral-400 font-bold drop-shadow-md uppercase text-sm md:text-base tracking-[0.3em]">
                {t("home.subtitle")}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button 
                onClick={startSimulation}
                disabled={loading}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden brutalist-border bg-white px-8 font-medium text-black brutalist-button hover:bg-neutral-200 transition-colors"
              >
                <span className="flex items-center gap-2 font-mono text-sm">
                  <Terminal size={18} />
                  {loading ? t("home.initializing") : t("home.voice_simulator")}
                </span>
              </button>
              
              <button 
                onClick={() => setSimulatorMode("text")}
                disabled={loading}
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden brutalist-border bg-black text-white px-8 font-medium hover:bg-neutral-900 transition-colors"
              >
                <span className="flex items-center gap-2 font-mono text-sm">
                  <MessageSquare size={18} />
                  {t("home.text_scenarios")}
                </span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* SCROLL REVEAL SECTIONS */}
        <section className="min-h-[70vh] flex flex-col justify-center border-t border-neutral-800 py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">{t("home.features.learn.title")}</h2>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed">{t("home.features.learn.desc")}</p>
            <Link href="/learn" className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:gap-4 transition-all">
              {t("home.features.learn.btn")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>

        <section className="min-h-[70vh] flex flex-col justify-center items-end text-right border-t border-neutral-800 py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">{t("home.features.quiz.title")}</h2>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed">{t("home.features.quiz.desc")}</p>
            <Link href="/quiz" className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:gap-4 transition-all flex-row-reverse">
              {t("home.features.quiz.btn")} <ArrowRight size={18} className="rotate-180" /> 
            </Link>
          </motion.div>
        </section>

        <section className="min-h-[70vh] flex flex-col justify-center border-t border-neutral-800 py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">{t("home.features.dashboard.title")}</h2>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed">{t("home.features.dashboard.desc")}</p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:gap-4 transition-all">
              {t("home.features.dashboard.btn")} <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>

        <section className="min-h-[70vh] flex flex-col justify-center items-end text-right border-t border-neutral-800 py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">{t("home.features.reports.title")}</h2>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed">{t("home.features.reports.desc")}</p>
            <Link href="/reports" className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:gap-4 transition-all flex-row-reverse">
              {t("home.features.reports.btn")} <ArrowRight size={18} className="rotate-180" />
            </Link>
          </motion.div>
        </section>
      </div>
    );
  }

  // Interruption Screen (if we manually trigger it)
  if (interruption) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-mono text-red-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full p-8 brutalist-border border-red-500/50 bg-red-950/20 backdrop-blur-sm space-y-6"
        >
          <div className="flex items-center gap-4 text-red-500 border-b border-red-900/50 pb-4">
            <AlertTriangle size={32} />
            <h2 className="text-2xl font-bold tracking-widest">{t("simulator.critical_exposure")}</h2>
          </div>
          <p className="text-lg text-red-200 leading-relaxed">
            {interruption.text}
          </p>
          <button 
            onClick={clearInterruption}
            className="w-full h-12 brutalist-border border-red-500/50 hover:bg-red-500 hover:text-black transition-colors flex items-center justify-between px-6"
          >
            <span>{t("simulator.acknowledge")}</span>
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  // Finished Screen
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-mono">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl text-center space-y-8"
        >
          <h2 className="text-3xl font-bold">{t("simulator.terminated")}</h2>
          <p className="text-neutral-400">
            {t("simulator.session_logged")}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="h-12 px-8 brutalist-border brutalist-button"
          >
            {t("simulator.restart")}
          </button>
        </motion.div>
      </div>
    );
  }

  // Active Scenario Screen
  if (currentNode) {
    return (
      <div className="max-w-3xl mx-auto w-full font-mono mt-12">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentNode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            {/* Context Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 text-sm text-neutral-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t("simulator.active_connection")}: {currentNode.actor.toUpperCase()}
              </span>
              <span>{t("simulator.node")}: {currentNode.id} ({t("simulator.tactics")}: {currentNode.tactic_tags.map(tag => t(`tactics.${tag}`)).join(", ")})</span>
            </div>

            {/* Narrative / Text */}
            <div className="text-2xl md:text-3xl font-light leading-relaxed text-neutral-200">
              "{currentNode.text}"
            </div>

            {/* Voice Control */}
            <div className="pt-12 flex flex-col items-center justify-center space-y-6">
              <button
                onClick={toggleListen}
                disabled={loading}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? "bg-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]" 
                    : "bg-neutral-900 text-neutral-400 brutalist-border hover:bg-white hover:text-black"
                }`}
              >
                {isListening ? <Mic size={32} /> : <MicOff size={32} />}
              </button>
              
              <div className="h-12 text-center text-neutral-400 max-w-lg mx-auto">
                {isListening && !transcript && t("simulator.listening")}
                {transcript && <span className="text-white italic">"{transcript}"</span>}
                {loading && <span className="animate-pulse">{t("simulator.processing")}</span>}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return null;
}
