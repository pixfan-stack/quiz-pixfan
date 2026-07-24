/**
 * Backend-enabled high-score client for Cloudflare Pages Functions + D1.
 *
 * When deployed with D1 bound, this provides cross-device high scores.
 * Falls back gracefully to localStorage when backend is unavailable.
 */

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

/**
 * Fetch best score for a quiz from the serverless function.
 * Falls back to localStorage if backend is unavailable.
 */
export async function fetchRemoteHighScore(
  quizId: string
): Promise<{ quizId: string; percentage: number; correctCount: number; totalQuestions: number; updatedAt: string } | null> {
  try {
    const res = await fetch(
      `/api/highscore?quizId=${encodeURIComponent(quizId)}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { score: { quizId: string; percentage: number; correctCount: number; totalQuestions: number; updatedAt: string } | null };
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
