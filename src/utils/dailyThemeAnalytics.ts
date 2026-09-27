/**
 * Admin daily-challenge × editorial-theme rollup (last N UTC days).
 * Joins `daily-YYYY-MM-DD` attempt rows → `DailyThemeId` via ISO-week rotation.
 */

import {
  getDailyTheme,
  parseDailyQuizDate,
  type DailyThemeId,
} from './dailyChallenge';

export interface DailyThemeDayCount {
  day: string;
  theme: DailyThemeId;
  attempts: number;
}

function utcDayString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Theme id for a UTC calendar day (`YYYY-MM-DD`). */
export function themeIdForDay(day: string): DailyThemeId | null {
  const parsed = parseDailyQuizDate(`daily-${day}`);
  if (!parsed) return null;
  return getDailyTheme(parsed).id;
}

/**
 * Build a descending day × theme table for the last `dayCount` UTC days.
 * Counts come from `daily-*` quiz_id rows (not created_at calendar day).
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
    const theme = getDailyTheme(d).id;
    out.push({
      day,
      theme,
      attempts: byDay.get(day) ?? 0,
    });
  }
  return out;
}

/** Roll up day rows into theme totals (descending attempts). */
export function rollupDailyThemeCounts(
  days: DailyThemeDayCount[]
): Array<{ theme: DailyThemeId; attempts: number }> {
  const map = new Map<DailyThemeId, number>();
  for (const row of days) {
    if (row.attempts <= 0) continue;
    map.set(row.theme, (map.get(row.theme) ?? 0) + row.attempts);
  }
  return [...map.entries()]
    .map(([theme, attempts]) => ({ theme, attempts }))
    .sort(
      (a, b) =>
        b.attempts - a.attempts || a.theme.localeCompare(b.theme)
    );
}
