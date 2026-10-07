import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from './translations';
const LanguageContext = createContext(null);
const STORAGE_KEY = 'umweltmetrik-language';
export function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'de'; }
    catch { return 'de'; }
  });
  const t = translations[language];
  function setLanguage(value) {
    if (!Object.hasOwn(translations, value)) return;
    updateLanguage(value);
    try { localStorage.setItem(STORAGE_KEY, value); } catch { /* Storage may be blocked. */ }
  }
  useEffect(() => {
    document.documentElement.lang = language;
    // Native validity strings must be recomputed in the selected language.
    document.querySelectorAll('input, textarea').forEach(field => field.setCustomValidity(''));
  }, [language, t]);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
