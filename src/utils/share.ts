/**
 * Social share URL builders.
 *
 * HOW TO CHANGE SHARE MESSAGES / URLS:
 * 1. Edit share text templates in:
 *    - public/locales/en/translation.json → "share.*"
 *    - public/locales/fr/translation.json → "share.*"
 *    Placeholders: {{score}}, {{total}}, {{percent}}, {{quizTitle}}
 * 2. Change APP_SHARE_URL below (or set VITE_APP_URL in a .env file).
 * 3. Hashtags live under "share.hashtags" in the same translation files.
 */

/** Public URL used in share links. Replace for production. */
export const APP_SHARE_URL =
  import.meta.env.VITE_APP_URL ?? 'https://quiz.pixfan.fr';

/** Deep-link URL for a specific quiz (hash routing). */
export function quizShareUrl(quizId: string): string {
  const base = APP_SHARE_URL.replace(/\/$/, '');
  return `${base}/#/quiz/${encodeURIComponent(quizId)}`;
}

export interface SocialShareOptions {
  /** Percent score 0–100 for OG preview. */
  score?: number;
  lang?: 'en' | 'fr';
}

/**
 * Crawlable share URL (`/s/:id`) with dynamic Open Graph tags.
 * Prefer this for social platforms; use `quizShareUrl` for in-app deep links.
 */
export function socialShareUrl(
  quizId: string,
  opts: SocialShareOptions = {}
): string {
  const base = APP_SHARE_URL.replace(/\/$/, '');
  const u = new URL(`${base}/s/${encodeURIComponent(quizId)}`);
  if (opts.score != null && Number.isFinite(opts.score)) {
    u.searchParams.set(
      'score',
      String(Math.round(Math.min(100, Math.max(0, opts.score))))
    );
  }
  if (opts.lang) u.searchParams.set('lang', opts.lang);
  return u.toString();
}

/** Absolute OG image URL for a quiz/score. */
export function ogImageUrl(
  quizId: string,
  opts: SocialShareOptions = {}
): string {
  const base = APP_SHARE_URL.replace(/\/$/, '');
  const u = new URL(`${base}/api/og`);
  u.searchParams.set('quiz', quizId);
  if (opts.score != null && Number.isFinite(opts.score)) {
    u.searchParams.set(
      'score',
      String(Math.round(Math.min(100, Math.max(0, opts.score))))
    );
  }
  if (opts.lang) u.searchParams.set('lang', opts.lang);
  return u.toString();
}

export type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'whatsapp';

export type ShareKind = 'default' | 'duel' | 'daily' | 'challenge';

export interface SharePayload {
  /** Fully localized share sentence (already interpolated). */
  text: string;
  /** Quiz page or app home URL. */
  url: string;
  /** Comma-separated hashtags without # (Twitter). */
  hashtags?: string;
}

/** Pick share copy key from quiz id / context. */
export function resolveShareKind(
  quizId: string,
  opts?: { challengeInvite?: boolean }
): ShareKind {
  if (opts?.challengeInvite) return 'challenge';
  if (/^duel-[a-z0-9]{6,16}$/.test(quizId)) return 'duel';
  if (quizId.startsWith('daily-')) return 'daily';
  return 'default';
}

/** i18n key for the share sentence. */
export function shareTextKey(kind: ShareKind): string {
  switch (kind) {
    case 'duel':
      return 'share.textDuel';
    case 'daily':
      return 'share.textDaily';
    case 'challenge':
      return 'share.textChallenge';
    default:
      return 'share.text';
  }
}

export function buildShareUrl(
  platform: SharePlatform,
  payload: SharePayload
): string {
  const { text, url, hashtags = '' } = payload;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  switch (platform) {
    case 'twitter':
      // https://developer.x.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}${
        hashtags ? `&hashtags=${encodeURIComponent(hashtags)}` : ''
      }`;
    case 'facebook':
      // Facebook quote param is limited; url is the main content
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
    default:
      return url;
  }
}

/** Open a share URL in a new tab/window. */
export function openShare(platform: SharePlatform, payload: SharePayload): void {
  const href = buildShareUrl(platform, payload);
  window.open(href, '_blank', 'noopener,noreferrer');
}

/** Whether the Web Share API is available for text/url. */
export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export type NativeShareResult = 'shared' | 'aborted' | 'unavailable';

/**
 * Primary share path: Web Share API when available.
 * Callers should fall back to clipboard / platform buttons.
 */
export async function nativeShareScore(
  payload: SharePayload,
  title = 'Quiz PixFan'
): Promise<NativeShareResult> {
  if (!canNativeShare()) return 'unavailable';
  try {
    await navigator.share({
      title,
      text: payload.text,
      url: payload.url,
    });
    return 'shared';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return 'aborted';
    }
    return 'unavailable';
  }
}

/** Copy "text + url" for paste into any messenger. */
export async function copySharePayload(payload: SharePayload): Promise<boolean> {
  const line = `${payload.text} ${payload.url}`.trim();
  try {
    await navigator.clipboard.writeText(line);
    return true;
  } catch {
    return false;
  }
}
