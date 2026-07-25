/**
 * Social share URL builders.
 *
 * HOW TO CHANGE SHARE MESSAGES / URLS:
 * 1. Edit share text templates in:
 *    - public/locales/en/translation.json → "share.text"
 *    - public/locales/fr/translation.json → "share.text"
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

export type SharePlatform = 'twitter' | 'facebook' | 'linkedin' | 'whatsapp';

export interface SharePayload {
  /** Fully localized share sentence (already interpolated). */
  text: string;
  /** Quiz page or app home URL. */
  url: string;
  /** Comma-separated hashtags without # (Twitter). */
  hashtags?: string;
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
