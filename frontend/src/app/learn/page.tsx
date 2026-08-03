"use client";

import { ShieldAlert, CreditCard, UserX, Smartphone, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function LearnPage() {
  const { t, getNestedObject } = useTranslation();
  
  const icons = [
    <ShieldAlert key="1" className="text-red-500" size={32} />,
    <UserX key="2" className="text-blue-500" size={32} />,
    <CreditCard key="3" className="text-green-500" size={32} />,
    <Smartphone key="4" className="text-yellow-500" size={32} />
  ];

  const localizedThreats = getNestedObject("learn.threats") || [];
  
  const threats = localizedThreats.map((threat: any, idx: number) => ({
    ...threat,
    icon: icons[idx % icons.length]
  }));

  return (
    <div className="font-mono space-y-12 max-w-4xl mx-auto">
      <div className="space-y-4 border-b border-neutral-800 pb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter">{t("learn.title")}</h1>
        <p className="text-neutral-500 uppercase tracking-widest text-sm max-w-2xl mx-auto">
          {t("learn.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {threats.map((threat: any, idx: number) => (
          <div key={idx} className="brutalist-border p-6 bg-neutral-950 flex flex-col md:flex-row gap-6 items-start">
            <div className="p-4 bg-black brutalist-border shrink-0">
              {threat.icon}
            </div>
            <div className="space-y-4 flex-1">
              <h2 className="text-2xl font-bold tracking-tight">{threat.title}</h2>
              <p className="text-neutral-300 leading-relaxed">
                {threat.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-800">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">{t("learn.common_tactics")}</h3>
                  <ul className="list-disc list-inside text-sm text-neutral-400 space-y-1">
                    {threat.tactics.map((t: string, i: number) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2 bg-neutral-900 p-4 brutalist-border">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={14} className="text-yellow-500" />
                    {t("learn.defense_strategy")}
                  </h3>
                  <p className="text-sm text-neutral-300">
                    {threat.defense}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

