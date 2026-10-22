import type { LocalizedString } from '../types/quiz';
import { resolveUiLang } from './lang';

/**
 * Pick the localized string for the active language.
 * Chain: exact locale → en → fr.
 * ES/DE without a dedicated field use English (interim foundation).
 */
export function pickLocale(value: LocalizedString, lang: string): string {
  const ui = resolveUiLang(lang);
  if (ui === 'fr' && value.fr) return value.fr;
  if (ui === 'es' && value.es) return value.es;
  if (ui === 'de' && value.de) return value.de;
  if (value.en) return value.en;
  return value.fr;
}
