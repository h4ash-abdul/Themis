"use client";

import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

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

  useEffect(() => {
    // In a real app we'd get this from a cookie or context.
    // For now we'll just try to fetch assuming the backend has some session
    // Or we tell the user they need to run a simulation first.
    // To make this work easily for demo, we'll fetch a mock or the last session.
    // Actually, since session is in Simulator, we can just use localStorage.
    const sid = localStorage.getItem("themis_session_id");
    
    if (sid) {
      fetch(`http://localhost:8000/api/simulation/profile/${sid}`)
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

  if (loading) return <div className="font-mono text-neutral-500">LOADING PROFILE...</div>;

  if (!profile) {
    return (
      <div className="font-mono text-center space-y-4 mt-20">
        <h2 className="text-2xl font-bold">NO PROFILE FOUND</h2>
        <p className="text-neutral-500">You must run the simulator first to generate a behavioral profile.</p>
      </div>
    );
  }

  // Format data for radar chart
  const data = Object.entries(profile.tactics).map(([tactic, stats]) => ({
    subject: tactic.toUpperCase(),
    A: stats.yields > 0 ? (stats.yields / stats.encounters) * 100 : 0,
    fullMark: 100,
  }));

  // Fallback if empty
  if (data.length === 0) {
    data.push({ subject: "NO DATA", A: 0, fullMark: 100 });
  }

  return (
    <div className="font-mono space-y-12">
      <div className="space-y-4 border-b border-neutral-800 pb-8">
        <h1 className="text-4xl font-bold tracking-tighter">BEHAVIORAL PROFILE</h1>
        <div className="text-sm text-neutral-500 uppercase tracking-widest flex items-center gap-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          SESSION ID: {profile.session_id}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="brutalist-border p-6 h-[400px] flex items-center justify-center bg-neutral-950">
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
            <h3 className="text-xl font-bold mb-4">TACTICAL BREAKDOWN</h3>
            <div className="space-y-4">
              {Object.entries(profile.tactics).map(([tactic, stats]) => (
                <div key={tactic} className="flex justify-between items-center border-b border-neutral-800 pb-2">
                  <span className="uppercase text-neutral-400">{tactic}</span>
                  <div className="text-right">
                    <div className="text-lg">{stats.yields} / {stats.encounters}</div>
                    <div className="text-xs text-neutral-600">YIELDS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Personalized Recommendations */}
          <div className="mt-8 border-t border-neutral-800 pt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              SAFETY RECOMMENDATIONS
            </h3>
            <div className="brutalist-border bg-neutral-900 p-6 space-y-4">
              {(() => {
                // Find most yielded tactic
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
                      Excellent defense posture. You did not yield to any manipulation tactics during the simulation. Continue to maintain a healthy skepticism towards unsolicited contacts.
                    </p>
                  );
                }

                // Tailored advice
                const adviceMap: Record<string, string> = {
                  authority: "You showed a vulnerability to authority figures (e.g., Police, Bank Officials). Remember that real organizations will never call and demand immediate payment or sensitive data. Always hang up and call the official number on their website.",
                  urgency: "You were manipulated by artificial urgency. Scammers use time pressure so you don't have time to think. Always take a deep breath and wait 5 minutes before making any financial decision.",
                  fear: "Fear-based tactics (threats of arrest or account closure) successfully pressured you. Legitimate entities do not operate via phone threats. If threatened, hang up immediately—it is a scam.",
                  isolation: "You yielded when the caller told you not to speak to anyone else. Isolation is a huge red flag. Always discuss unusual financial requests with a trusted family member or friend before acting.",
                  "false-legitimacy": "Spoofed Caller IDs or fake badge numbers tricked you. Caller ID is easily faked. Never trust incoming caller information; verify independently by initiating the call yourself."
                };

                const advice = adviceMap[topTactic] || "Be cautious of emotional manipulation over the phone. Verify all claims independently.";

                return (
                  <>
                    <h4 className="font-bold text-red-400 uppercase tracking-widest text-sm">
                      Identified Vulnerability: {topTactic}
                    </h4>
                    <p className="text-neutral-300 leading-relaxed">
                      {advice}
                    </p>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
