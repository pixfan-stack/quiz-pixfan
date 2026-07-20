import type { LocalizedString } from '../types/quiz';

/**
 * Pick the localized string for the active language.
 * Falls back to English if the requested language is missing.
 */
export function pickLocale(value: LocalizedString, lang: string): string {
  if (lang === 'fr' && value.fr) return value.fr;
  return value.en;
}
