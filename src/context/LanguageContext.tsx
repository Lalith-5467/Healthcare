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

export type Language = "en" | "ta";

const STORAGE_KEY = "medicare_language";

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ta") return "ta";
  } catch {}
  return "en";
}

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
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

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = patientTranslations[language] as Record<string, string>;
      if (dict && dict[key] !== undefined) return dict[key];
      // Fallback: English
      const enDict = patientTranslations["en"] as Record<string, string>;
      if (enDict && enDict[key] !== undefined) return enDict[key];
      // Last resort
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
