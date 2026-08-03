"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "@/lib/i18n";
import { Lock, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

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

export default function Reports() {
  const { t, getNestedObject } = useTranslation();
  
  const TACTICS = getNestedObject("reports.tactics_list") || ["Urgency / deadline", "Claimed authority", "Fear or threat", "Too-good-to-be-true reward", "Emotional appeal", "Asked for OTP or password", "Asked to install an app", "Asked to keep it secret"];
  const CONTACT_METHODS = getNestedObject("reports.contact_methods") || ["SMS", "WhatsApp", "Phone Call", "Email", "Social Media", "Other"];
  const REGIONS = getNestedObject("reports.regions_list") || ["North", "South", "East", "West", "Central", "North-East", "Outside country"];
  const MONEY_LOST = getNestedObject("reports.money_lost_list") || ["No money lost", "Under 1,000", "1,000 - 10,000", "10,000 - 1,00,000", "Over 1,00,000"];

  const REGIONAL_DATA = [
    { region: REGIONS[0], reports: 4200, share: 28 },
    { region: REGIONS[1], reports: 3800, share: 25 },
    { region: REGIONS[3], reports: 3100, share: 21 },
    { region: REGIONS[2], reports: 2100, share: 14 },
    { region: REGIONS[4], reports: 1200, share: 8 },
    { region: REGIONS[5], reports: 600, share: 4 },
  ];

  const [selectedTypesIdx, setSelectedTypesIdx] = useState<number[]>([]);
  const [contactMethodIdx, setContactMethodIdx] = useState(0);
  const [regionIdx, setRegionIdx] = useState(0);
  const [moneyLostIdx, setMoneyLostIdx] = useState(0);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const toggleType = (idx: number) => {
    if (selectedTypesIdx.includes(idx)) {
      setSelectedTypesIdx(selectedTypesIdx.filter(i => i !== idx));
    } else {
      setSelectedTypesIdx([...selectedTypesIdx, idx]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setSelectedTypesIdx([]);
        setDescription("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="font-mono space-y-24 pb-24">
      <section className="space-y-8 max-w-5xl">
        <div className="space-y-4 border-b border-neutral-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">{t("reports.title")}</h1>
          <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm">
            {t("reports.subtitle")}
          </p>
          <div className="inline-flex items-center gap-2 border border-neutral-800 bg-neutral-950 px-4 py-2 text-neutral-400 text-sm mt-4">
            <Lock size={14} />
            <span>{t("reports.anonymous_disclaimer")}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pt-8">
          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{t("reports.type_label")}</label>
            <div className="flex flex-wrap gap-3">
              {TACTICS.map((type: string, idx: number) => (
                <Pill 
                  key={idx} 
                  label={type} 
                  selected={selectedTypesIdx.includes(idx)} 
                  onClick={() => toggleType(idx)} 
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{t("reports.platform_label")}</label>
              <select 
                value={contactMethodIdx} 
                onChange={(e) => setContactMethodIdx(Number(e.target.value))}
                className="w-full bg-transparent border border-neutral-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
              >
                {CONTACT_METHODS.map((method: string, idx: number) => <option key={idx} value={idx} className="bg-black">{method}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{t("reports.region_label")}</label>
              <select 
                value={regionIdx} 
                onChange={(e) => setRegionIdx(Number(e.target.value))}
                className="w-full bg-transparent border border-neutral-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
              >
                {REGIONS.map((r: string, idx: number) => <option key={idx} value={idx} className="bg-black">{r}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{t("reports.money_lost_label")}</label>
            <div className="flex flex-wrap gap-3">
              {MONEY_LOST.map((amount: string, idx: number) => (
                <Pill 
                  key={idx} 
                  label={amount} 
                  selected={moneyLostIdx === idx} 
                  onClick={() => setMoneyLostIdx(idx)} 
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-neutral-500 font-bold">{t("reports.description_label")}</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-transparent border border-neutral-700 p-4 text-white focus:outline-none focus:border-white transition-colors min-h-[120px]"
              placeholder={t("reports.description_placeholder")}
            />
          </div>

          <button 
            type="submit"
            disabled={status !== "idle"}
            className="h-14 px-8 border border-white bg-white text-black font-bold uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50 inline-flex items-center gap-4"
          >
            <span>{status === "submitting" ? t("reports.submitting") : status === "success" ? t("reports.success") : t("reports.submit")}</span>
            {status === "success" ? <Check size={18} /> : <ArrowRight size={18} />}
          </button>
        </form>
      </section>

      <section className="space-y-12">
        <div className="space-y-4 border-t border-neutral-800 pt-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">{t("reports.fraud_trends")}</h2>
          <p className="text-neutral-400 max-w-3xl leading-relaxed">
            {t("reports.trends_subtitle")}
          </p>
        </div>

        <div className="border border-neutral-800 bg-neutral-950 p-6 space-y-6">
          <h3 className="text-xl font-bold">{t("reports.monthly_stats")}</h3>
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
          <h3 className="text-xl font-bold">{t("reports.regional_spread")}</h3>
          
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-12 text-xs text-neutral-500 uppercase tracking-widest font-bold pb-4 border-b border-neutral-800">
              <div className="col-span-4">{t("reports.region")}</div>
              <div className="col-span-3">{t("reports.incidents")}</div>
              <div className="col-span-5">{t("reports.share")}</div>
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
            {t("reports.baseline_disclaimer")}
          </p>
        </div>

      </section>
    </div>
  );
}

