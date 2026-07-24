/**
 * Cloudflare Pages Function — leaderboard API
 *
 * Route: GET /api/leaderboard?limit=20&quizId=exposure-basics
 *
 * Returns top scores, optionally filtered by quizId.
 */

import { json } from './utils';

export interface Env {
  DB: D1Database;
}

interface LeaderboardEntry {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string;
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

/**
 * GET /api/leaderboard?limit=20&quizId=exposure-basics
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const quizId = url.searchParams.get('quizId');
  const limit = Math.min(
    parseInt(url.searchParams.get('limit') || '20', 10),
    100
  );

  try {
    if (context.env.DB) {
      let query = `
        SELECT quiz_id as quizId, percentage, correct_count as correctCount,
               total_questions as totalQuestions, updated_at as updatedAt
        FROM highscores
      `;
      const params: (string | number)[] = [];

      if (quizId) {
        query += ' WHERE quiz_id = ?';
        params.push(quizId);
      }

      query += ' ORDER BY percentage DESC, updated_at ASC LIMIT ?';
      params.push(limit);

      const rows = await context.env.DB.prepare(query)
        .bind(...params)
        .all<LeaderboardEntry>();

      return json({
        leaderboard: rows.results ?? [],
        total: rows.results?.length ?? 0,
      });
    }
  } catch (error) {
    console.warn('Leaderboard query failed:', error);
  }

  return json({ leaderboard: [], total: 0 });
};
