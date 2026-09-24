/**
 * Season (calendar month) banners + cosmetic badges.
 * Kept separate from ACHIEVEMENT_IDS so account sync stays on a fixed whitelist.
 */

import { getMonthPeriodId, getSeasonDaysRemaining } from './leaderboardPeriod';

const LAST_SEEN_KEY = 'quiz-pixfan-last-season-seen';
const ENDING_DISMISS_KEY = 'quiz-pixfan-season-ending-dismissed';
const BADGES_KEY = 'quiz-pixfan-season-cosmetics';

/** Show “ending soon” when this many UTC days (or fewer) remain. */
export const SEASON_ENDING_SOON_DAYS = 3;

/** Daily streak required for the streak-season cosmetic. */
export const SEASON_STREAK_THRESHOLD = 7;

export type SeasonBannerKind = 'started' | 'ending';

export const SEASON_COSMETICS = [
  'participant',
  'streak-season',
  'top10',
  'podium',
] as const;

export type SeasonCosmetic = (typeof SEASON_COSMETICS)[number];

type SeasonBadgeMap = Record<string, SeasonCosmetic>;

/** Higher rank = better cosmetic (used for merge). */
const COSMETIC_RANK: Record<SeasonCosmetic, number> = {
  participant: 1,
  'streak-season': 2,
  top10: 3,
  podium: 4,
};

function isSeasonCosmetic(value: unknown): value is SeasonCosmetic {
  return (
    typeof value === 'string' &&
    (SEASON_COSMETICS as readonly string[]).includes(value)
  );
}

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

/** Keep the higher-tier cosmetic when both sides claim a season. */
export function pickHigherSeasonCosmetic(
  a: SeasonCosmetic | null | undefined,
  b: SeasonCosmetic | null | undefined
): SeasonCosmetic | null {
  if (!a) return b ?? null;
  if (!b) return a;
  return COSMETIC_RANK[a] >= COSMETIC_RANK[b] ? a : b;
}

/** Map a monthly leaderboard rank to a season cosmetic (or null if unranked / outside top 10). */
export function cosmeticFromMonthRank(
  rank: number | null | undefined
): SeasonCosmetic | null {
  if (rank == null || !Number.isFinite(rank) || rank < 1) return null;
  if (rank <= 3) return 'podium';
  if (rank <= 10) return 'top10';
  return null;
}

/** Sanitize an unknown season-badges payload (API / storage). */
export function parseSeasonBadges(raw: unknown): SeasonBadgeMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const out: SeasonBadgeMap = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (isSeasonCosmetic(value) && /^\d{4}-\d{2}$/.test(id)) {
      out[id] = value;
    }
  }
  // Cap map size to avoid unbounded growth across years
  const ids = Object.keys(out).sort().reverse().slice(0, 36);
  const capped: SeasonBadgeMap = {};
  for (const id of ids) {
    capped[id] = out[id]!;
  }
  return capped;
}

/** Union two badge maps (higher cosmetic wins per season). */
export function mergeSeasonBadgeMaps(
  a: SeasonBadgeMap,
  b: SeasonBadgeMap
): SeasonBadgeMap {
  const merged: SeasonBadgeMap = { ...a };
  for (const [id, cosmetic] of Object.entries(b)) {
    const kept = pickHigherSeasonCosmetic(merged[id], cosmetic);
    if (kept) merged[id] = kept;
  }
  return parseSeasonBadges(merged);
}

export function getSeasonBadges(): SeasonBadgeMap {
  return parseSeasonBadges(readJson<Record<string, unknown>>(BADGES_KEY, {}));
}

/** Merge remote season badges into localStorage (union, higher tier wins). */
export function mergeRemoteSeasonBadges(
  remote: SeasonBadgeMap | unknown
): SeasonBadgeMap {
  const merged = mergeSeasonBadgeMaps(getSeasonBadges(), parseSeasonBadges(remote));
  writeJson(BADGES_KEY, merged);
  return merged;
}

export function getSeasonBadge(seasonId = getMonthPeriodId()): SeasonCosmetic | null {
  return getSeasonBadges()[seasonId] ?? null;
}

function unlockSeasonCosmetic(
  cosmetic: SeasonCosmetic,
  seasonId = getMonthPeriodId()
): boolean {
  const badges = getSeasonBadges();
  const current = badges[seasonId];
  const next = pickHigherSeasonCosmetic(current, cosmetic);
  if (!next || next === current) return false;
  badges[seasonId] = next;
  writeJson(BADGES_KEY, badges);
  return true;
}

/** Unlock the cosmetic participant badge for a season (idempotent). */
export function unlockSeasonParticipant(
  seasonId = getMonthPeriodId()
): boolean {
  return unlockSeasonCosmetic('participant', seasonId);
}

/** Unlock streak-season when daily streak meets the threshold (does not downgrade top10/podium). */
export function unlockSeasonStreak(
  currentStreak: number,
  seasonId = getMonthPeriodId()
): boolean {
  if (currentStreak < SEASON_STREAK_THRESHOLD) return false;
  return unlockSeasonCosmetic('streak-season', seasonId);
}

/** Unlock top10 / podium from monthly rank (does not downgrade a higher tier). */
export function unlockSeasonFromRank(
  rank: number | null | undefined,
  seasonId = getMonthPeriodId()
): boolean {
  const cosmetic = cosmeticFromMonthRank(rank);
  if (!cosmetic) return false;
  return unlockSeasonCosmetic(cosmetic, seasonId);
}

export function listSeasonBadges(): { seasonId: string; cosmetic: SeasonCosmetic }[] {
  return Object.entries(getSeasonBadges())
    .map(([seasonId, cosmetic]) => ({ seasonId, cosmetic }))
    .sort((a, b) => b.seasonId.localeCompare(a.seasonId));
}

/** i18n key for a season cosmetic badge label. */
export function seasonCosmeticLabelKey(cosmetic: SeasonCosmetic): string {
  switch (cosmetic) {
    case 'podium':
      return 'season.podiumBadge';
    case 'top10':
      return 'season.top10Badge';
    case 'streak-season':
      return 'season.streakSeasonBadge';
    default:
      return 'season.participantBadge';
  }
}

/** Emoji icon for a season cosmetic. */
export function seasonCosmeticIcon(cosmetic: SeasonCosmetic): string {
  switch (cosmetic) {
    case 'podium':
      return '🥇';
    case 'top10':
      return '🔟';
    case 'streak-season':
      return '🔥';
    default:
      return '🏅';
  }
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
    // Keep the default null value when localStorage is unavailable.
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
    // Keep the default null value when localStorage is unavailable.
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
