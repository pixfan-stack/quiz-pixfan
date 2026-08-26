import { getDailyQuizId, isDailyQuizId } from './dailyChallenge';

const STORAGE_KEY = 'quiz-pixfan-daily-streak';

export interface DailyStreakState {
  /** Last completed daily quiz id (`daily-YYYY-MM-DD`). */
  lastDailyId: string | null;
  currentStreak: number;
  bestStreak: number;
  /** 0 or 1 — refreshed each UTC ISO week. */
  freezesAvailable: number;
  /** UTC ISO week key, e.g. `2026-W34`. */
  freezeWeekKey: string | null;
}

export interface DailyCompletionResult extends DailyStreakState {
  /** True when a freeze was used to bridge a one-day gap. */
  freezeConsumed: boolean;
}

const EMPTY: DailyStreakState = {
  lastDailyId: null,
  currentStreak: 0,
  bestStreak: 0,
  freezesAvailable: 1,
  freezeWeekKey: null,
};

/** Previous UTC calendar day id relative to `daily-YYYY-MM-DD`. */
export function previousDailyQuizId(dailyId: string): string | null {
  const match = dailyId.match(/^daily-(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  );
  date.setUTCDate(date.getUTCDate() - 1);
  return getDailyQuizId(date);
}

/** UTC ISO week key for freeze refill (`YYYY-Www`). */
export function utcIsoWeekKey(now = new Date()): string {
  const d = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  // Thursday in current week decides the year.
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function withWeeklyFreeze(state: DailyStreakState, now: Date): DailyStreakState {
  const week = utcIsoWeekKey(now);
  if (state.freezeWeekKey === week) return state;
  return {
    ...state,
    freezesAvailable: 1,
    freezeWeekKey: week,
  };
}

export function getDailyStreak(now = new Date()): DailyStreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return withWeeklyFreeze({ ...EMPTY }, now);
    const parsed = JSON.parse(raw) as Partial<DailyStreakState>;
    const state: DailyStreakState = {
      lastDailyId: parsed.lastDailyId ?? null,
      currentStreak: Number(parsed.currentStreak) || 0,
      bestStreak: Number(parsed.bestStreak) || 0,
      freezesAvailable:
        parsed.freezesAvailable == null
          ? 1
          : Math.max(0, Math.min(1, Number(parsed.freezesAvailable) || 0)),
      freezeWeekKey: parsed.freezeWeekKey ?? null,
    };
    return withWeeklyFreeze(state, now);
  } catch {
    return withWeeklyFreeze({ ...EMPTY }, now);
  }
}

function writeStreak(state: DailyStreakState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

/**
 * Record a daily-challenge completion. Idempotent for the same day.
 * A single freeze can bridge exactly one missed UTC day per week.
 */
export function recordDailyCompletion(
  quizId: string,
  now = new Date()
): DailyCompletionResult {
  if (!isDailyQuizId(quizId)) {
    const s = getDailyStreak(now);
    return { ...s, freezeConsumed: false };
  }

  const todayId = getDailyQuizId(now);
  if (quizId !== todayId) {
    const s = getDailyStreak(now);
    return { ...s, freezeConsumed: false };
  }

  const prev = getDailyStreak(now);
  if (prev.lastDailyId === todayId) {
    return { ...prev, freezeConsumed: false };
  }

  const yesterdayId = previousDailyQuizId(todayId);
  const dayBeforeYesterday = yesterdayId
    ? previousDailyQuizId(yesterdayId)
    : null;

  let freezeConsumed = false;
  let baseStreak = 0;

  if (prev.lastDailyId && yesterdayId && prev.lastDailyId === yesterdayId) {
    baseStreak = prev.currentStreak;
  } else if (
    prev.lastDailyId &&
    dayBeforeYesterday &&
    prev.lastDailyId === dayBeforeYesterday &&
    prev.freezesAvailable > 0
  ) {
    baseStreak = prev.currentStreak;
    freezeConsumed = true;
  }

  const currentStreak = baseStreak + 1;
  const next: DailyStreakState = {
    lastDailyId: todayId,
    currentStreak,
    bestStreak: Math.max(prev.bestStreak, currentStreak),
    freezesAvailable: freezeConsumed
      ? Math.max(0, prev.freezesAvailable - 1)
      : prev.freezesAvailable,
    freezeWeekKey: prev.freezeWeekKey,
  };
  writeStreak(next);
  return { ...next, freezeConsumed };
}

/** Streak shown on home (honours a pending one-day freeze window). */
export function getDisplayDailyStreak(now = new Date()): number {
  const state = getDailyStreak(now);
  if (!state.lastDailyId || state.currentStreak <= 0) return 0;

  const todayId = getDailyQuizId(now);
  if (state.lastDailyId === todayId) return state.currentStreak;

  const yesterdayId = previousDailyQuizId(todayId);
  if (state.lastDailyId === yesterdayId) return state.currentStreak;

  const dayBeforeYesterday = yesterdayId
    ? previousDailyQuizId(yesterdayId)
    : null;
  if (
    dayBeforeYesterday &&
    state.lastDailyId === dayBeforeYesterday &&
    state.freezesAvailable > 0
  ) {
    return state.currentStreak;
  }

  return 0;
}

/** Freeze charge available this UTC week (after refill). */
export function getStreakFreezesAvailable(now = new Date()): number {
  return getDailyStreak(now).freezesAvailable;
}
