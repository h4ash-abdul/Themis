"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Lock, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

const SCAM_TYPES = [
  "UPI / payment request", "Bank or card impersonation", "Job or task-work offer", "Instant loan app",
  "OTP / verification code theft", "Investment or crypto scheme", "Lottery or prize win", "Romance or friendship",
  "Delivery / customs parcel", "Tech support / remote access"
];

const CONTACT_METHODS = ["SMS", "WhatsApp", "Phone Call", "Email", "Social Media", "Other"];
const REGIONS = ["North", "South", "East", "West", "Central", "North-East", "Outside country"];
const MONEY_LOST = ["No money lost", "Under 1,000", "1,000 - 10,000", "10,000 - 1,00,000", "Over 1,00,000"];

const TACTICS = [
  "Urgency / deadline", "Claimed authority", "Fear or threat", "Too-good-to-be-true reward", "Emotional appeal",
  "Asked for OTP or password", "Asked to install an app", "Asked to keep it secret"
];

const MONTHLY_DATA = [
  { month: "Sep", reports: 1800, losses: 500 },
  { month: "Oct", reports: 2000, losses: 700 },
  { month: "Nov", reports: 2500, losses: 900 },
  { month: "Dec", reports: 3000, losses: 1100 },
  { month: "Jan", reports: 2800, losses: 950 },
  { month: "Feb", reports: 2900, losses: 1000 },
  { month: "Mar", reports: 3200, losses: 1200 },
  { month: "Apr", reports: 3600, losses: 1300 },
];

const REGIONAL_DATA = [
  { region: "West", reports: "4,620", share: 25 },
  { region: "North", reports: "4,310", share: 23 },
  { region: "South", reports: "3,980", share: 22 },
  { region: "East", reports: "2,410", share: 13 },
  { region: "Central", reports: "1,890", share: 10 },
  { region: "North-East", reports: "860", share: 5 },
  { region: "Outside country", reports: "400", share: 2 },
];

// Reusable Pill Component for brutalist multi/single select
const Pill = ({ label, selected, onClick }: { label: string, selected: boolean, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 border transition-colors font-mono text-sm ${
      selected 
        ? "bg-white text-black border-white font-bold" 
        : "bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400"
    }`}
  >
    {label}
  </button>
);

export default function ReportsPage() {
  // Form State
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [contactMethod, setContactMethod] = useState(CONTACT_METHODS[0]);
  const [region, setRegion] = useState(REGIONS[0]);
  const [moneyLost, setMoneyLost] = useState(MONEY_LOST[0]);
  const [selectedTactics, setSelectedTactics] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const toggleArrayItem = (item: string, array: string[], setArray: (val: string[]) => void) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Mock submission delay
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        // Reset form
        setSelectedTypes([]);
        setSelectedTactics([]);
        setDescription("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="font-mono space-y-24 pb-24">
      
      {/* SECTION 1: REPORT A SCAM */}
      <section className="space-y-8 max-w-5xl">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Report a scam</h1>
          <p className="text-neutral-400 max-w-3xl leading-relaxed">
            One minute, no account, no personal details. Your report feeds the community trend dashboard and generates safety steps tailored to what happened to you.
          </p>
          <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-950 px-4 py-2 text-neutral-400 text-sm mt-4">
            <Lock size={14} />
            <span>Anonymous by design — we never ask for your name, number or account details.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pt-8">
          
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">What kind of scam was it?</label>
            <div className="flex flex-wrap gap-3">
              {SCAM_TYPES.map(type => (
                <Pill 
                  key={type} 
                  label={type} 
                  selected={selectedTypes.includes(type)} 
                  onClick={() => toggleArrayItem(type, selectedTypes, setSelectedTypes)} 
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">How did they reach you?</label>
              <select 
                value={contactMethod} 
                onChange={(e) => setContactMethod(e.target.value)}
                className="w-full bg-transparent border border-neutral-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
              >
                {CONTACT_METHODS.map(method => <option key={method} value={method} className="bg-black">{method}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Your broad region</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-transparent border border-neutral-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
              >
                {REGIONS.map(r => <option key={r} value={r} className="bg-black">{r}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Did you lose money?</label>
            <div className="flex flex-wrap gap-3">
              {MONEY_LOST.map(amount => (
                <Pill 
                  key={amount} 
                  label={amount} 
                  selected={moneyLost === amount} 
                  onClick={() => setMoneyLost(amount)} 
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Tactics they used</label>
            <div className="flex flex-wrap gap-3">
              {TACTICS.map(tactic => (
                <Pill 
                  key={tactic} 
                  label={tactic} 
                  selected={selectedTactics.includes(tactic)} 
                  onClick={() => toggleArrayItem(tactic, selectedTactics, setSelectedTactics)} 
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">What happened? (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent border border-neutral-700 p-4 text-white focus:outline-none focus:border-white transition-colors min-h-[120px]"
              placeholder="Describe the message or call in your own words. Please leave out names, numbers and account details."
            />
          </div>

          <button 
            type="submit"
            disabled={status !== "idle"}
            className="h-14 px-8 border border-white bg-white text-black font-bold uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50 inline-flex items-center gap-4"
          >
            <span>{status === "submitting" ? "SUBMITTING..." : status === "success" ? "REPORT LOGGED" : "SUBMIT REPORT"}</span>
            {status === "success" ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
        </form>
      </section>

      {/* SECTION 2: FRAUD TREND DASHBOARD */}
      <section className="space-y-12">
        <div className="space-y-4 border-t border-neutral-800 pt-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Fraud trend dashboard</h2>
          <p className="text-neutral-400 max-w-3xl leading-relaxed">
            Anonymised, aggregated reporting data. Use it to see which tactic is circulating right now — recognition is easier when you know what is going around.
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between h-32">
            <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Reports (8 Months)</span>
            <span className="text-2xl md:text-3xl font-bold">22,007</span>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between h-32">
            <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Month-on-Month</span>
            <span className="text-2xl md:text-3xl font-bold">+8%</span>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between h-32">
            <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Most Reported</span>
            <span className="text-lg md:text-xl font-bold">UPI / payment request</span>
          </div>
          <div className="border border-neutral-800 bg-neutral-950 p-6 flex flex-col justify-between h-32">
            <span className="text-xs text-neutral-500 uppercase tracking-widest font-bold">From this device</span>
            <span className="text-2xl md:text-3xl font-bold">0</span>
          </div>
        </div>

        {/* Area Chart */}
        <div className="border border-neutral-800 bg-neutral-950 p-6 space-y-6">
          <h3 className="text-xl font-bold">Reports and losses by month</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLosses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#666666" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#666666" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={true} horizontal={true} />
                <XAxis dataKey="month" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="reports" stroke="#ffffff" fillOpacity={1} fill="url(#colorReports)" />
                <Area type="monotone" dataKey="losses" stroke="#666666" fillOpacity={1} fill="url(#colorLosses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Spread */}
        <div className="border border-neutral-800 bg-neutral-950 p-6 space-y-6">
          <h3 className="text-xl font-bold">Regional spread</h3>
          
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 text-xs text-neutral-500 uppercase tracking-widest font-bold pb-4 border-b border-neutral-800">
              <div className="col-span-4">Region</div>
              <div className="col-span-3">Reports</div>
              <div className="col-span-5">Share</div>
            </div>
            
            {/* Table Rows */}
            <div className="space-y-1">
              {REGIONAL_DATA.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 items-center py-4 border-b border-neutral-800/50 text-sm">
                  <div className="col-span-4 font-bold">{row.region}</div>
                  <div className="col-span-3 text-neutral-400">{row.reports}</div>
                  <div className="col-span-5 flex items-center gap-4">
                    <div className="h-1.5 bg-neutral-800 w-full max-w-[120px] overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${row.share}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-white"
                      />
                    </div>
                    <span className="text-neutral-500 text-xs">{row.share}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-neutral-500 pt-4">
            Baseline figures are illustrative aggregates modelled on published cybercrime reporting; reports submitted on this device are added on top and never leave your browser.
          </p>
        </div>

      </section>
    </div>
  );
}
