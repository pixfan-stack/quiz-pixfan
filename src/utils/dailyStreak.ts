import { getDailyQuizId, isDailyQuizId } from './dailyChallenge';

const STORAGE_KEY = 'quiz-pixfan-daily-streak';

export interface DailyStreakState {
  /** Last completed daily quiz id (`daily-YYYY-MM-DD`). */
  lastDailyId: string | null;
  currentStreak: number;
  bestStreak: number;
}

const EMPTY: DailyStreakState = {
  lastDailyId: null,
  currentStreak: 0,
  bestStreak: 0,
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

export function getDailyStreak(): DailyStreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as DailyStreakState;
    return {
      lastDailyId: parsed.lastDailyId ?? null,
      currentStreak: Number(parsed.currentStreak) || 0,
      bestStreak: Number(parsed.bestStreak) || 0,
    };
  } catch {
    return { ...EMPTY };
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
 * Returns the updated streak state.
 */
export function recordDailyCompletion(
  quizId: string,
  now = new Date()
): DailyStreakState {
  if (!isDailyQuizId(quizId)) {
    return getDailyStreak();
  }

  const todayId = getDailyQuizId(now);
  if (quizId !== todayId) {
    return getDailyStreak();
  }

  const prev = getDailyStreak();
  if (prev.lastDailyId === todayId) {
    return prev;
  }

  const yesterdayId = previousDailyQuizId(todayId);
  const currentStreak =
    prev.lastDailyId && yesterdayId && prev.lastDailyId === yesterdayId
      ? prev.currentStreak + 1
      : 1;

  const next: DailyStreakState = {
    lastDailyId: todayId,
    currentStreak,
    bestStreak: Math.max(prev.bestStreak, currentStreak),
  };
  writeStreak(next);
  return next;
}

/** Streak shown on home: 0 if the last completion wasn't today or yesterday. */
export function getDisplayDailyStreak(now = new Date()): number {
  const state = getDailyStreak();
  if (!state.lastDailyId || state.currentStreak <= 0) return 0;

  const todayId = getDailyQuizId(now);
  if (state.lastDailyId === todayId) return state.currentStreak;

  const yesterdayId = previousDailyQuizId(todayId);
  if (state.lastDailyId === yesterdayId) return state.currentStreak;

  return 0;
}
