"use client";

import Link from "next/link";
import { ScrambledTitle } from "@/components/ui/modern-animated-hero-section";
import { useTranslation } from "@/lib/i18n";

export default function Navbar() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <header className="flex items-center justify-between border-b border-neutral-800 pb-6 mb-12 shrink-0">
      <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:text-red-500 transition-colors">
        <ScrambledTitle />
      </Link>
      <div className="flex items-center gap-8">
        <nav className="text-sm font-mono text-neutral-300 font-semibold drop-shadow-md uppercase flex gap-6">
          <Link href="/" className="hover:text-white transition-colors">{t("nav.simulator")}</Link>
          <Link href="/learn" className="hover:text-white transition-colors">{t("nav.learn")}</Link>
          <Link href="/quiz" className="hover:text-white transition-colors">{t("nav.quiz")}</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">{t("nav.dashboard")}</Link>
          <Link href="/reports" className="hover:text-white transition-colors">{t("nav.reports")}</Link>
        </nav>
        
        {/* Language Toggle */}
        <div className="flex items-center gap-2 border border-neutral-800 rounded bg-black text-xs font-mono font-bold p-1">
          <button 
            onClick={() => setLocale("en")}
            className={`px-3 py-1 rounded transition-colors ${locale === "en" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLocale("ta")}
            className={`px-3 py-1 rounded transition-colors ${locale === "ta" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
          >
            TA
          </button>
          <button 
            onClick={() => setLocale("hi")}
            className={`px-3 py-1 rounded transition-colors ${locale === "hi" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
          >
            HI
          </button>
          <button 
            onClick={() => setLocale("ml")}
            className={`px-3 py-1 rounded transition-colors ${locale === "ml" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
          >
            ML
          </button>
          <button 
            onClick={() => setLocale("te")}
            className={`px-3 py-1 rounded transition-colors ${locale === "te" ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
          >
            TE
          </button>
        </div>
      </div>
    </header>
  );
}
