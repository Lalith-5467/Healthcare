/**
 * LanguageContext — Patient/User portal EN <-> Tamil language state.
 *
 * Wraps only the Patient/User portal (DashboardPage).
 * Persists preference under localStorage key "medicare_language".
 * Provides useLanguage() hook and t() helper to all patient components.
 * Falls back to English for any missing translation key.
 */
import React, { createContext, useContext, useState, useCallback } from "react";
import { patientTranslations } from "../translations/patientTranslations";
import { caregiverTranslations } from "../translations/caregiverTranslations";

export type Language = "en" | "ta";

const STORAGE_KEY = "medicare_language";

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const lower = stored.toLowerCase();
      if (lower === "ta" || lower === "tamil" || lower.startsWith("ta")) return "ta";
    }
  } catch {}
  return "en";
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language | string) => void;
  /** Translate a key; falls back to English string, never undefined/null. */
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: (key, fallback) => fallback ?? key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage);

  const setLanguage = useCallback((lang: Language | string) => {
    const lower = (lang || "").toLowerCase();
    const normalized: Language = (lower === "ta" || lower === "tamil" || lower.startsWith("ta")) ? "ta" : "en";
    setLanguageState(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('medicare_language_changed', { detail: { language: normalized } }));
      }
    } catch {}
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      // 1. Check patientTranslations for active language
      const pDict = (patientTranslations[language] as Record<string, string>) || {};
      if (pDict[key] !== undefined) return pDict[key];

      // 2. Check caregiverTranslations for active language
      const cDict = (caregiverTranslations[language] as Record<string, string>) || {};
      if (cDict[key] !== undefined) return cDict[key];

      // 3. Fallback: English in patientTranslations
      const pEnDict = (patientTranslations["en"] as Record<string, string>) || {};
      if (pEnDict[key] !== undefined) return pEnDict[key];

      // 4. Fallback: English in caregiverTranslations
      const cEnDict = (caregiverTranslations["en"] as Record<string, string>) || {};
      if (cEnDict[key] !== undefined) return cEnDict[key];

      // 5. Last resort: provided fallback or raw key
      return fallback ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => useContext(LanguageContext);
