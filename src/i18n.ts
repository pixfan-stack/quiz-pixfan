/**
 * i18n initialization (react-i18next)
 *
 * HOW TO EXTEND UI STRINGS:
 * 1. Add a new key under the same path in ALL locale files:
 *    - public/locales/en/translation.json
 *    - public/locales/fr/translation.json
 *    - public/locales/es/translation.json  (real Spanish UI — vague 1.41)
 *    - public/locales/de/translation.json  (real German UI — vague 1.42)
 * 2. Use it in components via: t('section.key') or t('section.key', { var: value })
 *
 * ES and DE are real UI translations (see public/locales/STUBS.md).
 *
 * Language preference is detected and persisted via i18next-browser-languagedetector
 * (localStorage key: "i18nextLng"). Vague 1.99: path prefix `/en|/es|/de` wins first.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../public/locales/en/translation.json';
import fr from '../public/locales/fr/translation.json';
import es from '../public/locales/es/translation.json';
import de from '../public/locales/de/translation.json';

export {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from './utils/lang';
import { detectPathLang, SUPPORTED_LANGUAGES } from './utils/lang';

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'pathLocale',
  lookup() {
    if (typeof window === 'undefined') return undefined;
    return detectPathLang(window.location.pathname) ?? undefined;
  },
});

void i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      de: { translation: de },
    },
    fallbackLng: 'fr',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Path locales (vague 1.99) before ?lang= / localStorage / navigator.
      order: ['pathLocale', 'querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
