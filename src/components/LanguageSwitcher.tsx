import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../i18n';

/**
 * FR | EN language switcher.
 * Choice is persisted by i18next LanguageDetector (localStorage: i18nextLng).
 */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2);

  const setLang = (lang: SupportedLanguage) => {
    void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={t('nav.language')}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          className={`lang-switcher__btn${current === lang ? ' is-active' : ''}`}
          onClick={() => setLang(lang)}
          aria-pressed={current === lang}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
