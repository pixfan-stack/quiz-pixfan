export type LeaderboardPeriod = 'all' | 'week' | 'month';

/** ISO week id, e.g. 2026-W30 (UTC, Monday-based). */
export function getWeekPeriodId(date = new Date()): string {
  const utc = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  // Thursday in current week decides the year
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const year = utc.getUTCFullYear();
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/** Calendar month id, e.g. 2026-07 (UTC) — also the “season”. */
export function getMonthPeriodId(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function parseLeaderboardPeriod(
  raw: string | null | undefined
): LeaderboardPeriod {
  if (raw === 'week' || raw === 'month') return raw;
  return 'all';
}

export function getPeriodIds(date = new Date()): {
  week: string;
  month: string;
} {
  return {
    week: getWeekPeriodId(date),
    month: getMonthPeriodId(date),
  };
}

/** First UTC instant of a season (`YYYY-MM`). */
export function getSeasonStart(seasonId = getMonthPeriodId()): Date {
  const [y, m] = seasonId.split('-').map(Number);
  return new Date(Date.UTC(y!, (m ?? 1) - 1, 1));
}

/** Last UTC day of a season (`YYYY-MM`), at 00:00. */
export function getSeasonEndDay(seasonId = getMonthPeriodId()): Date {
  const [y, m] = seasonId.split('-').map(Number);
  return new Date(Date.UTC(y!, m ?? 1, 0));
}

/** Whole UTC days remaining in the current season (0 on the last day). */
export function getSeasonDaysRemaining(date = new Date()): number {
  const end = getSeasonEndDay(getMonthPeriodId(date));
  const today = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  return Math.max(0, Math.round((end.getTime() - today.getTime()) / 86400000));
}
