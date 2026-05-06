import { useState, useCallback, useEffect } from "react";
import { LanguageContext } from "./languageContext.js";
import en from "./en.js";
import fr from "./fr.js";

const translations = { en, fr };

/**
 * Detects the preferred language from:
 * 1. localStorage (persisted choice)
 * 2. Browser / system language
 * Falls back to "en".
 */
function detectLanguage() {
  const saved = localStorage.getItem("lang");
  if (saved === "fr" || saved === "en") return saved;
  const browserLang = (
    navigator.language ||
    navigator.userLanguage ||
    "en"
  ).split("-")[0];
  return browserLang === "fr" ? "fr" : "en";
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(detectLanguage);

  const setLang = useCallback((next) => {
    setLangState(next);
    localStorage.setItem("lang", next);
    document.documentElement.lang = next;
  }, []);

  // Set the HTML lang attribute on mount
  useEffect(() => {
    document.documentElement.lang = lang;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Translate a dot-notated key.  e.g. t("nav.work") → "Work"
   * Returns the key itself when the path doesn't resolve.
   */
  const t = useCallback(
    (key) => {
      const dict = translations[lang] ?? translations.en;
      const parts = key.split(".");
      let val = dict;
      for (const p of parts) {
        val = val?.[p];
        if (val === undefined) return key;
      }
      return val;
    },
    [lang],
  );

  /**
   * Localize a data-object field.
   * l(item, "subtitle") returns item.subtitle_fr when lang === "fr"
   * and falls back to item.subtitle.
   */
  const l = useCallback(
    (obj, field) => {
      if (lang !== "en") {
        const localized = obj[`${field}_${lang}`];
        if (localized !== undefined) return localized;
      }
      return obj[field];
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, l }}>
      {children}
    </LanguageContext.Provider>
  );
};
