"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "../locales/en.json";
import ta from "../locales/ta.json";
import hi from "../locales/hi.json";
import ml from "../locales/ml.json";
import te from "../locales/te.json";

type Locale = "en" | "ta" | "hi" | "ml" | "te";
type Dictionary = typeof en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  getNestedObject: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = {
  en,
  ta,
  hi,
  ml,
  te,
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("themis_locale") as Locale;
    if (saved && (saved === "en" || saved === "ta" || saved === "hi" || saved === "ml" || saved === "te")) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("themis_locale", newLocale);
  };

  const t = (key: string, variables?: Record<string, string | number>) => {
    const keys = key.split(".");
    let value: any = dictionaries[locale];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value];
      } else {
        // Fallback to English if key missing in Tamil
        let fallback: any = dictionaries["en"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk as keyof typeof fallback];
          } else {
            return key; // Return key if entirely missing
          }
        }
        value = fallback;
        break;
      }
    }

    if (typeof value !== "string") return key;

    // Handle interpolation, e.g., "Hello {name}"
    if (variables) {
      return value.replace(/\{(\w+)\}/g, (_, v) => {
        return variables[v] !== undefined ? String(variables[v]) : `{${v}}`;
      });
    }

    return value;
  };

  const getNestedObject = (key: string) => {
    const keys = key.split(".");
    let value: any = dictionaries[locale];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value];
      } else {
        let fallback: any = dictionaries["en"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk as keyof typeof fallback];
          } else {
            return null;
          }
        }
        value = fallback;
        break;
      }
    }
    return value;
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, getNestedObject }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within a LanguageProvider");
  return context;
};
