import { useLanguage } from './i18n/LanguageContext';
export default function LanguageSwitcher({ onSelect }) {
  const { language, setLanguage, t } = useLanguage();
  return <div className="language-switcher" role="group" aria-label={t.language.select}>
    {['de', 'en'].map(value => <button key={value} type="button" lang={value}
      aria-pressed={language === value} onClick={() => { setLanguage(value); onSelect?.(); }}>
      {t.language[value]}
    </button>)}
  </div>;
}
