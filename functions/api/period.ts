export type LeaderboardPeriod = 'all' | 'week' | 'month';

/** ISO week id, e.g. 2026-W30 (UTC, Monday-based). */
export function getWeekPeriodId(date = new Date()): string {
  const utc = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
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
