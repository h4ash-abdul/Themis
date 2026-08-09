"use client";

import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
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

export default function Dashboard() {
  const [profile, setProfile] = useState<BehavioralProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const sid = localStorage.getItem("themis_session_id");
    
    if (sid) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      fetch(`${API_URL}/api/simulation/profile/${sid}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Profile not found");
          }
          return res.json();
        })
        .then(data => {
          setProfile(data);
          setLoading(false);
        })
        .catch(() => {
          setProfile(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] font-mono space-y-4">
      <div className="text-xl text-neutral-300 font-bold tracking-widest uppercase animate-pulse">
        {t("dashboard.loading")}
      </div>
      <div className="text-xs text-neutral-500 uppercase">
        Establishing secure connection... (may take up to 60s)
      </div>
    </div>
  );

  const data = profile ? Object.entries(profile.tactics).map(([tactic, stats]) => ({
    subject: tactic.toUpperCase(),
    A: stats.yields > 0 ? (stats.yields / stats.encounters) * 100 : 0,
    fullMark: 100,
  })) : [];

  if (data.length === 0 && profile) {
    data.push({ subject: t("dashboard.no_data"), A: 0, fullMark: 100 });
  }

  const trendsData = [
    { 
      name: t("dashboard.emerging_trends.trends.voice_cloning"), 
      increase: 340, 
      desc: t("dashboard.emerging_trends.descriptions.voice_cloning"),
      impactLabel: "CRITICAL"
    },
    { 
      name: t("dashboard.emerging_trends.trends.deepfake"), 
      increase: 210, 
      desc: t("dashboard.emerging_trends.descriptions.deepfake"),
      impactLabel: "HIGH"
    },
    { 
      name: t("dashboard.emerging_trends.trends.crypto"), 
      increase: 185, 
      desc: t("dashboard.emerging_trends.descriptions.crypto"),
      impactLabel: "HIGH"
    },
    { 
      name: t("dashboard.emerging_trends.trends.smishing"), 
      increase: 120, 
      desc: t("dashboard.emerging_trends.descriptions.smishing"),
      impactLabel: "MEDIUM"
    }
  ];

  return (
    <div className="font-mono space-y-12 pb-24">
      {profile ? (
        <>
          <div className="space-y-4 border-b border-neutral-800 pb-8">
            <h1 className="text-4xl font-bold tracking-tighter">{t("dashboard.title")}</h1>
            <div className="text-sm text-neutral-500 uppercase tracking-widest flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {t("dashboard.session_id")} {profile.session_id}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="brutalist-border p-4 md:p-6 h-[300px] md:h-[400px] flex items-center justify-center bg-neutral-950">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Vulnerability" dataKey="A" stroke="#ff3333" fill="#ff3333" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">{t("dashboard.tactical_breakdown")}</h3>
                <div className="space-y-4">
                  {Object.entries(profile.tactics).map(([tactic, stats]) => (
                    <div key={tactic} className="flex justify-between items-center border-b border-neutral-800 pb-2">
                      <span className="uppercase text-neutral-400">{t(`tactics.${tactic}`)}</span>
                      <div className="text-right">
                        <div className="text-lg">{stats.yields} / {stats.encounters}</div>
                        <div className="text-xs text-neutral-600 uppercase">{t("dashboard.yields").replace(':', '')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 border-t border-neutral-800 pt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  {t("dashboard.recommendations")}
                </h3>
                <div className="brutalist-border bg-neutral-900 p-6 space-y-4">
                  {(() => {
                    let maxYield = -1;
                    let topTactic = "";
                    Object.entries(profile.tactics).forEach(([tactic, stats]) => {
                      const yieldRate = stats.encounters > 0 ? stats.yields / stats.encounters : 0;
                      if (yieldRate > maxYield) {
                        maxYield = yieldRate;
                        topTactic = tactic;
                      }
                    });

                    if (maxYield === 0 || maxYield === -1) {
                      return (
                        <p className="text-neutral-300">
                          {t("dashboard.excellent_posture")}
                        </p>
                      );
                    }

                    const advice = t(`dashboard.advice.${topTactic}`);
                    const finalAdvice = advice === `dashboard.advice.${topTactic}` ? t("dashboard.advice.default") : advice;

                    return (
                      <>
                        <h4 className="font-bold text-red-400 uppercase tracking-widest text-sm">
                          {t("dashboard.identified_vulnerability")} {t(`tactics.${topTactic}`)}
                        </h4>
                        <p className="text-neutral-300 leading-relaxed">
                          {finalAdvice}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="font-mono text-center space-y-4 mt-20 mb-12">
          <h2 className="text-2xl font-bold">{t("dashboard.no_profile")}</h2>
          <p className="text-neutral-500">{t("dashboard.no_profile_desc")}</p>
        </div>
      )}

      {/* Emerging Trends Section */}
      <div className="mt-16 space-y-8 border-t border-neutral-800 pt-16">
        <div className="space-y-4 pb-8 border-b border-neutral-800 text-center">
          <h2 className="text-3xl font-bold tracking-tighter uppercase">{t("dashboard.emerging_trends.title")}</h2>
          <p className="text-neutral-500 uppercase tracking-widest text-sm">
            {t("dashboard.emerging_trends.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="brutalist-border p-4 md:p-6 h-[350px] md:h-[400px] bg-neutral-950 flex flex-col">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-neutral-400 text-sm">{t("dashboard.emerging_trends.increase")}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendsData} margin={{ top: 0, right: 30, left: 20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} axisLine={false} tickLine={false} width={150} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{fill: '#111'}}
                />
                <Bar dataKey="increase" fill="#ffffff" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {trendsData.map((trend, idx) => (
              <div key={idx} className="brutalist-border p-4 bg-black flex flex-col space-y-3 relative overflow-hidden group hover:border-white transition-colors">
                <div className="absolute top-0 right-0 p-2 opacity-10 font-bold text-6xl select-none group-hover:opacity-20 transition-opacity">
                  {idx + 1}
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <h4 className="font-bold text-white tracking-widest uppercase text-sm">{trend.name}</h4>
                  <span className={`text-xs font-bold px-2 py-1 uppercase ${trend.impactLabel === 'CRITICAL' ? 'bg-red-600 text-white' : trend.impactLabel === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-yellow-600 text-black'}`}>
                    {t("dashboard.emerging_trends.impact")}: {trend.impactLabel}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 relative z-10">{trend.desc}</p>
                <div className="text-sm text-red-400 font-bold flex items-center gap-2 relative z-10">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  +{trend.increase}% {t("dashboard.emerging_trends.increase")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

