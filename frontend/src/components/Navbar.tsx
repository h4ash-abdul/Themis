"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrambledTitle } from "@/components/ui/modern-animated-hero-section";
import { useTranslation } from "@/lib/i18n";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { t, locale, setLocale } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const LanguageSelector = () => (
    <div className="flex flex-wrap items-center gap-2 border border-neutral-800 rounded bg-black text-xs font-mono font-bold p-1 w-full md:w-auto justify-center md:justify-start">
      {["en", "ta", "hi", "ml", "te"].map((lang) => (
        <button 
          key={lang}
          onClick={() => { setLocale(lang); closeMobileMenu(); }}
          className={`px-3 py-2 md:py-1 rounded transition-colors uppercase ${locale === lang ? "bg-white text-black" : "text-neutral-500 hover:text-white"}`}
        >
          {lang}
        </button>
      ))}
    </div>
  );

  return (
    <header className="relative flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-800 pb-4 md:pb-6 mb-8 md:mb-12 shrink-0">
      <div className="flex items-center justify-between w-full md:w-auto">
        <Link href="/" onClick={closeMobileMenu} className="text-xl font-bold tracking-tighter text-white hover:text-red-500 transition-colors">
          <ScrambledTitle />
        </Link>
        <button 
          className="md:hidden text-white p-2" 
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <nav className="text-sm font-mono text-neutral-300 font-semibold drop-shadow-md uppercase flex gap-6">
          <Link href="/" className="hover:text-white transition-colors">{t("nav.simulator")}</Link>
          <Link href="/learn" className="hover:text-white transition-colors">{t("nav.learn")}</Link>
          <Link href="/quiz" className="hover:text-white transition-colors">{t("nav.quiz")}</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">{t("nav.dashboard")}</Link>
          <Link href="/reports" className="hover:text-white transition-colors">{t("nav.reports")}</Link>
        </nav>
        <LanguageSelector />
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden flex flex-col items-center gap-6 pt-8 pb-4 w-full overflow-hidden"
          >
            <nav className="text-lg font-mono text-neutral-300 font-semibold drop-shadow-md uppercase flex flex-col items-center gap-6 w-full">
              <Link href="/" onClick={closeMobileMenu} className="w-full text-center hover:text-white transition-colors py-2">{t("nav.simulator")}</Link>
              <Link href="/learn" onClick={closeMobileMenu} className="w-full text-center hover:text-white transition-colors py-2">{t("nav.learn")}</Link>
              <Link href="/quiz" onClick={closeMobileMenu} className="w-full text-center hover:text-white transition-colors py-2">{t("nav.quiz")}</Link>
              <Link href="/dashboard" onClick={closeMobileMenu} className="w-full text-center hover:text-white transition-colors py-2">{t("nav.dashboard")}</Link>
              <Link href="/reports" onClick={closeMobileMenu} className="w-full text-center hover:text-white transition-colors py-2">{t("nav.reports")}</Link>
            </nav>
            <div className="w-full pt-4 border-t border-neutral-800">
              <LanguageSelector />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
