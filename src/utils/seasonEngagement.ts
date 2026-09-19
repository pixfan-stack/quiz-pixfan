/**
 * Season (calendar month) banners + cosmetic participant badges.
 * Kept separate from ACHIEVEMENT_IDS so account sync stays on a fixed whitelist.
 */

import { getMonthPeriodId, getSeasonDaysRemaining } from './leaderboardPeriod';

const LAST_SEEN_KEY = 'quiz-pixfan-last-season-seen';
const ENDING_DISMISS_KEY = 'quiz-pixfan-season-ending-dismissed';
const BADGES_KEY = 'quiz-pixfan-season-cosmetics';

/** Show “ending soon” when this many UTC days (or fewer) remain. */
export const SEASON_ENDING_SOON_DAYS = 3;

export type SeasonBannerKind = 'started' | 'ending';

export type SeasonCosmetic = 'participant';

type SeasonBadgeMap = Record<string, SeasonCosmetic>;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function getSeasonBadges(): SeasonBadgeMap {
  const raw = readJson<Record<string, unknown>>(BADGES_KEY, {});
  const out: SeasonBadgeMap = {};
  for (const [id, value] of Object.entries(raw)) {
    if (value === 'participant' && /^\d{4}-\d{2}$/.test(id)) {
      out[id] = 'participant';
    }
  }
  return out;
}

export function getSeasonBadge(seasonId = getMonthPeriodId()): SeasonCosmetic | null {
  return getSeasonBadges()[seasonId] ?? null;
}

/** Unlock the cosmetic participant badge for a season (idempotent). */
export function unlockSeasonParticipant(
  seasonId = getMonthPeriodId()
): boolean {
  const badges = getSeasonBadges();
  if (badges[seasonId] === 'participant') return false;
  badges[seasonId] = 'participant';
  writeJson(BADGES_KEY, badges);
  return true;
}

export function listSeasonBadges(): { seasonId: string; cosmetic: SeasonCosmetic }[] {
  return Object.entries(getSeasonBadges())
    .map(([seasonId, cosmetic]) => ({ seasonId, cosmetic }))
    .sort((a, b) => b.seasonId.localeCompare(a.seasonId));
}

/**
 * Which home/leaderboard season banner to show (if any).
 * “started” wins over “ending” when the player has not seen this season yet.
 */
export function getSeasonBannerKind(
  date = new Date()
): SeasonBannerKind | null {
  const seasonId = getMonthPeriodId(date);
  let lastSeen: string | null = null;
  try {
    lastSeen = localStorage.getItem(LAST_SEEN_KEY);
  } catch {
    lastSeen = null;
  }

  if (lastSeen !== seasonId) {
    return 'started';
  }

  const daysLeft = getSeasonDaysRemaining(date);
  if (daysLeft > SEASON_ENDING_SOON_DAYS) return null;

  let endingDismissed: string | null = null;
  try {
    endingDismissed = localStorage.getItem(ENDING_DISMISS_KEY);
  } catch {
    endingDismissed = null;
  }
  if (endingDismissed === seasonId) return null;
  return 'ending';
}

export function dismissSeasonBanner(
  kind: SeasonBannerKind,
  date = new Date()
): void {
  const seasonId = getMonthPeriodId(date);
  try {
    if (kind === 'started') {
      localStorage.setItem(LAST_SEEN_KEY, seasonId);
      return;
    }
    localStorage.setItem(ENDING_DISMISS_KEY, seasonId);
    // Ensure “started” is also marked so it does not reappear after ending dismiss.
    if (localStorage.getItem(LAST_SEEN_KEY) !== seasonId) {
      localStorage.setItem(LAST_SEEN_KEY, seasonId);
    }
  } catch {
    // ignore
  }
}

/** Mark the current season as seen without requiring a banner dismiss. */
export function markSeasonSeen(date = new Date()): void {
  try {
    localStorage.setItem(LAST_SEEN_KEY, getMonthPeriodId(date));
  } catch {
    // ignore
  }
}
