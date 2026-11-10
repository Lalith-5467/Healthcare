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
import { doctorTranslations } from "../translations/doctorTranslations";
import { insuranceTranslations } from "../translations/insuranceTranslations";

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

  React.useEffect(() => {
    const handleStorage = () => {
      setLanguageState(readStoredLanguage());
    };
    const handleCustom = (e: any) => {
      if (e.detail?.language) {
        const l = e.detail.language;
        setLanguageState(l === 'ta' || l === 'tamil' ? 'ta' : 'en');
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('medicare_language_changed', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('medicare_language_changed', handleCustom);
    };
  }, []);

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

  // Pre-index English value -> Target Language translation for fast, universal reverse lookup
  const enValueToTargetMap = React.useMemo(() => {
    if (language === 'en') return new Map<string, string>();
    const map = new Map<string, string>();

    const pairs: [Record<string, string>, Record<string, string>][] = [
      [insuranceTranslations['en'] || {}, insuranceTranslations[language] || {}],
      [doctorTranslations['en'] || {}, doctorTranslations[language] || {}],
      [patientTranslations['en'] || {}, patientTranslations[language] || {}],
      [caregiverTranslations['en'] || {}, caregiverTranslations[language] || {}],
    ];

    for (const [enDict, targetDict] of pairs) {
      for (const [k, targetVal] of Object.entries(targetDict)) {
        if (!targetVal || typeof targetVal !== 'string') continue;
        const normTarget = targetVal.trim();
        
        // Register key directly (both lowercase and exact)
        map.set(k.trim().toLowerCase(), normTarget);
        map.set(k.trim(), normTarget);

        // Register English string value that maps to this key
        const enVal = enDict[k];
        if (enVal && typeof enVal === 'string') {
          const normEn = enVal.trim();
          map.set(normEn.toLowerCase(), normTarget);
          map.set(normEn, normTarget);

          if (normEn.endsWith(':')) {
            const noColonEn = normEn.slice(0, -1).trim();
            const noColonTarget = normTarget.replace(/:$/, '').trim();
            map.set(noColonEn.toLowerCase(), noColonTarget);
            map.set(noColonEn, noColonTarget);
          }
        }
      }
    }
    return map;
  }, [language]);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (!key && !fallback) return "";
      const queryKey = key || fallback || "";

      // If active language is Tamil (or non-English)
      if (language !== "en") {
        const iDict = (insuranceTranslations[language] as Record<string, string>) || {};
        const dDict = (doctorTranslations[language] as Record<string, string>) || {};
        const pDict = (patientTranslations[language] as Record<string, string>) || {};
        const cDict = (caregiverTranslations[language] as Record<string, string>) || {};

        const directLookup = (k: string): string | undefined => {
          if (!k) return undefined;
          if (iDict[k] !== undefined) return iDict[k];
          if (dDict[k] !== undefined) return dDict[k];
          if (pDict[k] !== undefined) return pDict[k];
          if (cDict[k] !== undefined) return cDict[k];

          const trimmed = k.trim();
          if (iDict[trimmed] !== undefined) return iDict[trimmed];
          if (dDict[trimmed] !== undefined) return dDict[trimmed];
          if (pDict[trimmed] !== undefined) return pDict[trimmed];
          if (cDict[trimmed] !== undefined) return cDict[trimmed];

          // Check reverse map by exact or lowercase
          const fromMap = enValueToTargetMap.get(trimmed) || enValueToTargetMap.get(trimmed.toLowerCase());
          if (fromMap !== undefined) return fromMap;

          // Strip trailing colon
          if (trimmed.endsWith(':')) {
            const noColon = trimmed.slice(0, -1).trim();
            if (iDict[noColon] !== undefined) return `${iDict[noColon]}:`;
            if (dDict[noColon] !== undefined) return `${dDict[noColon]}:`;
            if (pDict[noColon] !== undefined) return `${pDict[noColon]}:`;
            if (cDict[noColon] !== undefined) return `${cDict[noColon]}:`;
            const fromMapNoColon = enValueToTargetMap.get(noColon) || enValueToTargetMap.get(noColon.toLowerCase());
            if (fromMapNoColon !== undefined) return `${fromMapNoColon}:`;
          }

          return undefined;
        };

        // 1. Check exact key or English phrase
        const matchKey = directLookup(queryKey);
        if (matchKey !== undefined) return matchKey;

        // 2. Check fallback if provided
        if (fallback) {
          const matchFallback = directLookup(fallback);
          if (matchFallback !== undefined) return matchFallback;
        }
      }

      // If language is English OR not found in target language:
      const iEnDict = (insuranceTranslations["en"] as Record<string, string>) || {};
      const dEnDict = (doctorTranslations["en"] as Record<string, string>) || {};
      const pEnDict = (patientTranslations["en"] as Record<string, string>) || {};
      const cEnDict = (caregiverTranslations["en"] as Record<string, string>) || {};

      if (iEnDict[queryKey] !== undefined) return iEnDict[queryKey];
      if (dEnDict[queryKey] !== undefined) return dEnDict[queryKey];
      if (pEnDict[queryKey] !== undefined) return pEnDict[queryKey];
      if (cEnDict[queryKey] !== undefined) return cEnDict[queryKey];

      return fallback ?? queryKey;
    },
    [language, enValueToTargetMap]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => useContext(LanguageContext);
