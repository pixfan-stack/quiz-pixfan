/**
 * i18n initialization (react-i18next)
 *
 * HOW TO EXTEND UI STRINGS:
 * 1. Add a new key under the same path in ALL locale files:
 *    - public/locales/en/translation.json
 *    - public/locales/fr/translation.json
 *    - public/locales/es/translation.json  (real Spanish UI — vague 1.41)
 *    - public/locales/de/translation.json  (STUB = EN copy until 1.42)
 * 2. Use it in components via: t('section.key') or t('section.key', { var: value })
 *
 * DE remains an EN scaffold (see public/locales/STUBS.md). ES is real UI Spanish.
 *
 * Language preference is detected and persisted via i18next-browser-languagedetector
 * (localStorage key: "i18nextLng").
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
import { SUPPORTED_LANGUAGES } from './utils/lang';

void i18n
  .use(LanguageDetector)
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
      // `?lang=fr|en|es|de` supports hreflang / share links before localStorage.
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
