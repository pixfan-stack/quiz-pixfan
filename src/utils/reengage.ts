import { getDailyQuizId } from './dailyChallenge';
import { getDailyStreak } from './dailyStreak';
import { getHighScore } from './highscore';

const LAST_PLAYED_KEY = 'quiz-pixfan-last-played-at';
const RESULT_NUDGE_KEY = 'quiz-pixfan-result-nudge-day';
const HOME_NUDGE_KEY = 'quiz-pixfan-home-nudge-day';

function utcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** True when running as installed PWA (standalone / iOS home screen). */
export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia?.('(display-mode: standalone)')?.matches;
  const ios = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return Boolean(mq || ios);
}

/** Mark that the user finished a quiz (for home nudge timing). */
export function markQuizPlayed(now = new Date()): void {
  try {
    localStorage.setItem(LAST_PLAYED_KEY, now.toISOString());
  } catch {
    // ignore
  }
}

/** True if today's daily challenge was already completed in this browser. */
export function hasPlayedDailyToday(): boolean {
  const dailyId = getDailyQuizId();
  if (getHighScore(dailyId)) return true;
  const streak = getDailyStreak();
  return streak.lastDailyId === dailyId;
}

/**
 * Soft banner on results: suggest tomorrow’s daily challenge.
 * Hidden for today’s daily quiz itself, and once dismissed for the UTC day.
 */
export function shouldShowResultReengage(quizId: string): boolean {
  if (quizId.startsWith('daily-')) return false;
  try {
    if (localStorage.getItem(RESULT_NUDGE_KEY) === utcDayKey()) return false;
  } catch {
    // ignore
  }
  return true;
}

export function dismissResultReengage(now = new Date()): void {
  try {
    localStorage.setItem(RESULT_NUDGE_KEY, utcDayKey(now));
  } catch {
    // ignore
  }
}

/**
 * Home nudge for installed PWA users who played recently but not today’s daily.
 */
export function shouldShowHomeDailyNudge(): boolean {
  if (!isStandalonePwa()) return false;
  if (hasPlayedDailyToday()) return false;
  try {
    if (localStorage.getItem(HOME_NUDGE_KEY) === utcDayKey()) return false;
    const last = localStorage.getItem(LAST_PLAYED_KEY);
    if (!last) return false;
    const playedAt = Date.parse(last);
    if (!Number.isFinite(playedAt)) return false;
    // Show if they played within the last 7 days
    if (Date.now() - playedAt > 7 * 24 * 60 * 60 * 1000) return false;
  } catch {
    return false;
  }
  return true;
}

export function dismissHomeDailyNudge(now = new Date()): void {
  try {
    localStorage.setItem(HOME_NUDGE_KEY, utcDayKey(now));
  } catch {
    // ignore
  }
}
