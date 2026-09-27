/**
 * Editorial daily-theme helpers for admin analytics.
 * Keep theme order in sync with `src/utils/dailyChallenge.DAILY_THEME_ROTATION`.
 */

export const DAILY_THEME_IDS = [
  'lightroom',
  'smartphone',
  'light',
  'composition',
  'gear',
  'genres',
  'rights',
  'history',
  'mixed',
] as const;

export type DailyThemeId = (typeof DAILY_THEME_IDS)[number];

export interface DailyThemeDayCount {
  day: string;
  theme: DailyThemeId;
  attempts: number;
}

/** ISO week number (UTC), 1–53 — mirrored from dailyChallenge. */
export function getUtcIsoWeek(date: Date): number {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function parseDailyQuizDate(quizId: string): Date | null {
  const m = /^daily-(\d{4})-(\d{2})-(\d{2})$/.exec(quizId);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return new Date(Date.UTC(y, mo - 1, d));
}

export function getDailyThemeId(date: Date): DailyThemeId {
  const week = getUtcIsoWeek(date);
  const idx = (week - 1) % DAILY_THEME_IDS.length;
  return DAILY_THEME_IDS[idx]!;
}

function utcDayString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Build a descending day × theme table for the last `dayCount` UTC days.
 * Counts come from `daily-*` quiz_id rows.
 */
export function buildDailyThemeDayCounts(
  rawRows: Array<{ quizId: string; attempts: number }>,
  now = new Date(),
  dayCount = 14
): DailyThemeDayCount[] {
  const byDay = new Map<string, number>();
  for (const raw of rawRows) {
    const attempts = Number(raw.attempts) || 0;
    if (attempts <= 0) continue;
    const date = parseDailyQuizDate(raw.quizId);
    if (!date) continue;
    const day = utcDayString(date);
    byDay.set(day, (byDay.get(day) ?? 0) + attempts);
  }

  const out: DailyThemeDayCount[] = [];
  for (let i = 0; i < dayCount; i++) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)
    );
    const day = utcDayString(d);
    out.push({
      day,
      theme: getDailyThemeId(d),
      attempts: byDay.get(day) ?? 0,
    });
  }
  return out;
}
