/**
 * Local high-score storage.
 *
 * The app works fully offline using localStorage.
 * For a Cloudflare-backed store, see functions/api/highscore.ts
 * and the optional helpers in src/utils/highscoreApi.ts.
 */
import type { HighScoreRecord } from '../types/quiz';

const STORAGE_KEY = 'quiz-pixfan-highscores';

function readAll(): Record<string, HighScoreRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, HighScoreRecord>;
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, HighScoreRecord>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Quota / private mode — ignore silently
  }
}

export function getHighScore(quizId: string): HighScoreRecord | null {
  return readAll()[quizId] ?? null;
}

/** All local high scores keyed by quiz id. */
export function getAllHighScores(): Record<string, HighScoreRecord> {
  return readAll();
}

export interface LocalHighScoreInput {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt?: string;
}

/**
 * Merge remote high scores into localStorage (keep best % per quiz).
 */
export function mergeRemoteHighScores(remote: LocalHighScoreInput[]): void {
  if (!remote.length) return;
  const all = readAll();
  let changed = false;

  for (const row of remote) {
    if (!row?.quizId || typeof row.percentage !== 'number') continue;
    if (row.percentage < 0 || row.percentage > 100) continue;
    const existing = all[row.quizId];
    if (existing && existing.percentage >= row.percentage) continue;
    all[row.quizId] = {
      quizId: row.quizId,
      percentage: row.percentage,
      correctCount: Number(row.correctCount) || 0,
      totalQuestions: Math.max(1, Number(row.totalQuestions) || 1),
      updatedAt: row.updatedAt || new Date().toISOString(),
    };
    changed = true;
  }

  if (changed) writeAll(all);
}

/**
 * Save a score only if it beats the previous best (by percentage).
 * Returns whether a new high score was set, plus the previous best %.
 */
export function saveHighScoreIfBetter(input: {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
}): { isNewHighScore: boolean; previousBest: number | null } {
  const all = readAll();
  const existing = all[input.quizId] ?? null;
  const previousBest = existing?.percentage ?? null;

  if (previousBest !== null && input.percentage <= previousBest) {
    return { isNewHighScore: false, previousBest };
  }

  all[input.quizId] = {
    quizId: input.quizId,
    percentage: input.percentage,
    correctCount: input.correctCount,
    totalQuestions: input.totalQuestions,
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);

  return { isNewHighScore: true, previousBest };
}
