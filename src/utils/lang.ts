/**
 * UI language helpers (vague 1.40 — ES/DE foundation; vague 1.99 — path locales).
 *
 * Path product: `/` = FR (x-default); `/en/` `/es/` `/de/` for other UI locales.
 * `?lang=` remains a soft dual on guides and a 301 source on home.
 */

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es', 'de'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Non-default locales that use a path prefix. */
export const PATH_LOCALES = ['en', 'es', 'de'] as const;
export type PathLocale = (typeof PATH_LOCALES)[number];

/** Locales with full quiz / static-article copy today. */
export type ContentLanguage = 'en' | 'fr';

const SUPPORTED_SET = new Set<string>(SUPPORTED_LANGUAGES);
const PATH_SET = new Set<string>(PATH_LOCALES);

export function isSupportedLanguage(raw: string | null | undefined): raw is SupportedLanguage {
  if (!raw) return false;
  return SUPPORTED_SET.has(raw.toLowerCase().slice(0, 2));
}

export function isPathLocale(raw: string | null | undefined): raw is PathLocale {
  if (!raw) return false;
  return PATH_SET.has(raw.toLowerCase().slice(0, 2));
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

/** Detect `/en` `/es` `/de` path prefix (with or without trailing slash / subpath). */
export function detectPathLang(
  pathname: string | null | undefined
): PathLocale | null {
  const m = (pathname ?? '').match(/^\/(en|es|de)(?=\/|$)/i);
  if (!m) return null;
  return m[1]!.toLowerCase() as PathLocale;
}

/**
 * i18n path-locale lookup (vague 1.99 FR hotfix).
 *
 * - `/en|/es|/de` → that locale
 * - bare path with `?lang=` → `undefined` so the querystring detector runs (dual soft)
 * - bare path without `?lang=` → `'fr'` (x-default), ignoring stale localStorage/navigator
 *
 * Without the bare-FR default, visiting `/` after `/en/` kept EN from i18nextLng
 * and French home looked broken.
 */
export function lookupPathLocalePreference(
  pathname: string | null | undefined,
  search: string | null | undefined
): SupportedLanguage | undefined {
  const pathLang = detectPathLang(pathname);
  if (pathLang) return pathLang;
  const raw = search ?? '';
  const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
  const q = params.get('lang');
  if (q && isSupportedLanguage(q.toLowerCase().slice(0, 2))) {
    return undefined;
  }
  return 'fr';
}

/** Strip leading `/en|/es|/de` prefix; empty → `/`. */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(en|es|de)(?=\/|$)/i, '');
  if (!stripped || stripped === '') return '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
}

/** Path prefix for a UI lang (`''` for FR, `'/es'` for ES, …). */
export function pathPrefixForLang(lang: string | null | undefined): string {
  const ui = resolveUiLang(lang);
  if (ui === 'fr') return '';
  return `/${ui}`;
}

/**
 * Rebuild pathname under the target locale prefix.
 * FR → bare path; EN/ES/DE → `/xx` + bare (home becomes `/xx/`).
 */
export function withLocalePath(
  pathname: string,
  lang: string | null | undefined
): string {
  const bare = stripLocalePrefix(pathname);
  const prefix = pathPrefixForLang(lang);
  if (!prefix) return bare;
  if (bare === '/') return `${prefix}/`;
  return `${prefix}${bare}`;
}

/**
 * Query suffix for static guide / hub links (legacy).
 * Prefer `withGuideLang` / path locales (vague 1.99).
 */
export function guideLangQuery(lang: string | null | undefined): string {
  const ui = resolveUiLang(lang);
  if (ui === 'fr') return '';
  return `?lang=${ui}`;
}

/**
 * Locale-aware guide / hub href (vague 1.99 path product).
 * FR stays bare; EN/ES/DE get `/xx` prefix. Preserves hash; drops `?lang=`.
 */
export function withGuideLang(
  path: string,
  lang: string | null | undefined
): string {
  const hashIdx = path.indexOf('#');
  const beforeHash = hashIdx === -1 ? path : path.slice(0, hashIdx);
  const hash = hashIdx === -1 ? '' : path.slice(hashIdx);
  const qIdx = beforeHash.indexOf('?');
  const pathname = qIdx === -1 ? beforeHash : beforeHash.slice(0, qIdx);
  return withLocalePath(pathname || '/', lang) + hash;
}

/**
 * Pure URL builder: set `?lang=` on the search string while preserving
 * pathname, other query params, and hash (vague 1.50 SPA SEO foundation).
 * Kept for dual soft / tests; path product prefers `navigateToLang`.
 */
export function buildUrlWithLangParam(
  pathname: string,
  search: string,
  hash: string,
  lang: string | null | undefined
): string {
  const ui = resolveUiLang(lang);
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search
  );
  params.set('lang', ui);
  const q = params.toString();
  return pathname + (q ? `?${q}` : '') + hash;
}

/**
 * Sync SPA location search `?lang=fr|en|es|de` via replaceState.
 * Prefer `navigateToLang` for path locales (vague 1.99).
 */
export function syncLangSearchParam(lang: string | null | undefined): void {
  if (typeof window === 'undefined') return;
  const next = buildUrlWithLangParam(
    window.location.pathname,
    window.location.search,
    window.location.hash,
    lang
  );
  const current =
    window.location.pathname + window.location.search + window.location.hash;
  if (next === current) return;
  window.history.replaceState(null, '', next);
}

/**
 * Navigate to the path-locale URL for `lang` (vague 1.99).
 * Full assign so home locale shells re-bake meta; preserves hash; drops `?lang=`.
 * Persists i18nextLng synchronously before assign so FR (bare `/`) cannot lose
 * a race against unload when leaving `/en|/es|/de`.
 */
export function navigateToLang(lang: string | null | undefined): void {
  if (typeof window === 'undefined') return;
  const ui = resolveUiLang(lang);
  try {
    window.localStorage.setItem('i18nextLng', ui);
  } catch {
    /* private mode / quota — detection still has path / bare-FR default */
  }
  const nextPath = withLocalePath(window.location.pathname, ui);
  const next = nextPath + window.location.hash;
  const current =
    window.location.pathname + window.location.search + window.location.hash;
  if (next === current) return;
  // Same path already (e.g. FR on `/`) — still drop stale ?lang=
  if (
    nextPath === window.location.pathname &&
    window.location.search.includes('lang=')
  ) {
    window.history.replaceState(null, '', nextPath + window.location.hash);
    return;
  }
  window.location.assign(next);
}
