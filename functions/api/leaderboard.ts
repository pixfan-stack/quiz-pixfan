/**
 * Cloudflare Pages Function — multi-player leaderboard API
 *
 * Route: GET /api/leaderboard?limit=20&quizId=...&playerId=...
 */

import { json } from './utils';

export interface Env {
  DB: D1Database;
}

interface LeaderboardEntry {
  quizId: string;
  playerId: string;
  displayName: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string;
}

const MAX_PLAYER_ID = 64;

function sanitizePlayerId(raw: string): string | null {
  const id = raw.trim();
  if (!id || id.length > MAX_PLAYER_ID) return null;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) return null;
  return id;
}

async function fetchViewerRank(
  db: D1Database,
  playerId: string,
  quizId: string | null
): Promise<{ rank: number; entry: LeaderboardEntry } | null> {
  let entryQuery = `
    SELECT quiz_id as quizId, player_id as playerId, display_name as displayName,
           percentage, correct_count as correctCount,
           total_questions as totalQuestions, updated_at as updatedAt
    FROM player_highscores
    WHERE player_id = ?
  `;
  const entryParams: string[] = [playerId];

  if (quizId) {
    entryQuery += ' AND quiz_id = ?';
    entryParams.push(quizId);
  }

  entryQuery += `
    ORDER BY percentage DESC, updated_at ASC
    LIMIT 1
  `;

  const entry = await db
    .prepare(entryQuery)
    .bind(...entryParams)
    .first<LeaderboardEntry>();

  if (!entry) return null;

  let rankQuery = `
    SELECT COUNT(*) + 1 as rank
    FROM player_highscores p2
    WHERE (p2.percentage > ? OR (p2.percentage = ? AND p2.updated_at < ?))
  `;
  const rankParams: (string | number)[] = [
    entry.percentage,
    entry.percentage,
    entry.updatedAt,
  ];

  if (quizId) {
    rankQuery += ' AND p2.quiz_id = ?';
    rankParams.push(quizId);
  }

  const rankRow = await db
    .prepare(rankQuery)
    .bind(...rankParams)
    .first<{ rank: number }>();

  return {
    rank: rankRow?.rank ?? 1,
    entry,
  };
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

/**
 * GET /api/leaderboard?limit=20&quizId=exposure-basics&playerId=...
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const quizId = url.searchParams.get('quizId');
  const rawPlayerId = url.searchParams.get('playerId');
  const limit = Math.min(
    parseInt(url.searchParams.get('limit') || '20', 10),
    100
  );

  const viewerPlayerId = rawPlayerId
    ? sanitizePlayerId(rawPlayerId)
    : null;

  try {
    if (context.env.DB) {
      let query = `
        SELECT quiz_id as quizId, player_id as playerId, display_name as displayName,
               percentage, correct_count as correctCount,
               total_questions as totalQuestions, updated_at as updatedAt
        FROM player_highscores
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

      const leaderboard = rows.results ?? [];

      let viewer: { rank: number; entry: LeaderboardEntry } | null = null;
      if (viewerPlayerId) {
        viewer = await fetchViewerRank(
          context.env.DB,
          viewerPlayerId,
          quizId
        );
      }

      return json({
        leaderboard,
        total: leaderboard.length,
        viewer,
      });
    }
  } catch (error) {
    console.warn('Leaderboard query failed:', error);
  }

  return json({ leaderboard: [], total: 0, viewer: null });
};
