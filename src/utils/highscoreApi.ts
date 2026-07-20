/**
 * Backend-enabled high-score client for Cloudflare Pages Functions + D1.
 *
 * When deployed with D1 bound, this provides cross-device high scores.
 * Falls back gracefully to localStorage when backend is unavailable.
 *
 * ============================================================================
 * USAGE
 * ============================================================================
 *
 * 1. Import in your components:
 *    import { fetchRemoteHighScore, submitRemoteHighScore } from '../utils/highscoreApi';
 *
 * 2. Fetch best score:
 *    const score = await fetchRemoteHighScore('exposure-basics');
 *
 * 3. Submit new score:
 *    await submitRemoteHighScore({
 *      quizId: 'exposure-basics',
 *      percentage: 85,
 *      correctCount: 17,
 *      totalQuestions: 20,
 *    });
 *
 * 4. Get leaderboard:
 *    const leaderboard = await fetchLeaderboard({ limit: 10, quizId: 'exposure-basics' });
 *
 * ============================================================================
 * CONFIGURATION
 * ============================================================================
 *
 * Set VITE_ENABLE_REMOTE_SCORES=true in your .env to enable remote scores.
 * When false (default), the app uses only localStorage.
 */

export interface RemoteHighScore {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string;
}

export interface LeaderboardEntry {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
}

interface FetchLeaderboardParams {
  limit?: number;
  quizId?: string;
}

/** Check if remote scores are enabled */
const REMOTE_SCORES_ENABLED = import.meta.env.VITE_ENABLE_REMOTE_SCORES === 'true';

/**
 * Fetch best score for a quiz from the serverless function.
 * Falls back to localStorage if backend is unavailable.
 */
export async function fetchRemoteHighScore(
  quizId: string
): Promise<RemoteHighScore | null> {
  if (!REMOTE_SCORES_ENABLED) {
    return null;
  }

  try {
    const res = await fetch(
      `/api/highscore?quizId=${encodeURIComponent(quizId)}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { score: RemoteHighScore | null };
    return data.score;
  } catch {
    return null;
  }
}

/**
 * Submit a score to the serverless function (best-effort).
 * Returns true if submission was successful.
 */
export async function submitRemoteHighScore(payload: {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
}): Promise<boolean> {
  if (!REMOTE_SCORES_ENABLED) {
    return false;
  }

  try {
    const res = await fetch('/api/highscore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch leaderboard entries.
 * Optional: filter by quizId and/or limit.
 */
export async function fetchLeaderboard(
  params: FetchLeaderboardParams = {}
): Promise<LeaderboardResponse> {
  if (!REMOTE_SCORES_ENABLED) {
    return { leaderboard: [], total: 0 };
  }

  try {
    const { limit = 10, quizId } = params;
    const url = new URL('/api/leaderboard', window.location.origin);
    url.searchParams.set('limit', String(limit));
    if (quizId) {
      url.searchParams.set('quizId', quizId);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      return { leaderboard: [], total: 0 };
    }

    return (await res.json()) as LeaderboardResponse;
  } catch {
    return { leaderboard: [], total: 0 };
  }
}
