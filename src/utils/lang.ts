/**
 * UI language helpers (vague 1.40 — ES/DE foundation).
 *
 * Full content (quiz LocalizedString, dual-article guides) remains FR/EN.
 * ES/DE are UI locales; content falls back to English until translated.
 */

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Locales with full quiz / static-article copy today. */
export type ContentLanguage = 'en' | 'fr';

const SUPPORTED_SET = new Set<string>(SUPPORTED_LANGUAGES);

export function isSupportedLanguage(raw: string | null | undefined): raw is SupportedLanguage {
  if (!raw) return false;
  return SUPPORTED_SET.has(raw.toLowerCase().slice(0, 2));
}

/** Resolve a BCP-47 / query / i18n language to a supported UI lang. Default: en. */
export function resolveUiLang(raw: string | null | undefined): SupportedLanguage {
  const s = (raw ?? '').toLowerCase();
  if (s.startsWith('fr')) return 'fr';
  if (s.startsWith('es')) return 'es';
  if (s.startsWith('de')) return 'de';
  if (s.startsWith('en')) return 'en';
  return 'en';
}

/** Map UI lang → content lang (es/de → en interim). */
export function toContentLang(lang: string | null | undefined): ContentLanguage {
  return resolveUiLang(lang) === 'fr' ? 'fr' : 'en';
}

/**
 * Query suffix for static guide / hub links.
 * FR stays bare (default); EN/ES/DE get `?lang=xx`.
 */
export function guideLangQuery(lang: string | null | undefined): string {
  const ui = resolveUiLang(lang);
  if (ui === 'fr') return '';
  return `?lang=${ui}`;
}

/** Append `?lang=` / `&lang=` before an optional hash. */
export function withGuideLang(
  path: string,
  lang: string | null | undefined
): string {
  const q = guideLangQuery(lang);
  if (!q) return path;
  const hashIdx = path.indexOf('#');
  if (hashIdx === -1) {
    return path.includes('?') ? `${path}&${q.slice(1)}` : `${path}${q}`;
  }
  const base = path.slice(0, hashIdx);
  const hash = path.slice(hashIdx);
  return base.includes('?')
    ? `${base}&${q.slice(1)}${hash}`
    : `${base}${q}${hash}`;
}
