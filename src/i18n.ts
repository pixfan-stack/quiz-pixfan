/**
 * i18n initialization (react-i18next)
 *
 * HOW TO EXTEND UI STRINGS:
 * 1. Add a new key under the same path in BOTH:
 *    - public/locales/en/translation.json
 *    - public/locales/fr/translation.json
 * 2. Use it in components via: t('section.key') or t('section.key', { var: value })
 *
 * Language preference is detected and persisted via i18next-browser-languagedetector
 * (localStorage key: "i18nextLng").
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../public/locales/en/translation.json';
import fr from '../public/locales/fr/translation.json';

export const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;