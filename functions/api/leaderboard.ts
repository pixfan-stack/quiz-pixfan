/**
 * Cloudflare Pages Function — multi-player leaderboard API
 *
 * Route: GET /api/leaderboard?limit=20&quizId=...&playerId=...&period=all|week|month
 */

import { json } from './utils';
import {
  getMonthPeriodId,
  getWeekPeriodId,
  parseLeaderboardPeriod,
  type LeaderboardPeriod,
} from './period';

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

function periodMeta(period: LeaderboardPeriod): {
  period: LeaderboardPeriod;
  periodId: string | null;
  seasonId: string;
} {
  const seasonId = getMonthPeriodId();
  if (period === 'week') {
    return { period, periodId: getWeekPeriodId(), seasonId };
  }
  if (period === 'month') {
    return { period, periodId: seasonId, seasonId };
  }
  return { period: 'all', periodId: null, seasonId };
}

async function fetchViewerRank(
  db: D1Database,
  playerId: string,
  quizId: string | null,
  period: LeaderboardPeriod,
  periodId: string | null
): Promise<{ rank: number; entry: LeaderboardEntry } | null> {
  let entry: LeaderboardEntry | null = null;

  if (period === 'all' || !periodId) {
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
    entryQuery += ' ORDER BY percentage DESC, updated_at ASC LIMIT 1';
    entry = await db
      .prepare(entryQuery)
      .bind(...entryParams)
      .first<LeaderboardEntry>();
  } else {
    let entryQuery = `
      SELECT quiz_id as quizId, player_id as playerId, display_name as displayName,
             percentage, correct_count as correctCount,
             total_questions as totalQuestions, updated_at as updatedAt
      FROM period_highscores
      WHERE period_type = ? AND period_id = ? AND player_id = ?
    `;
    const entryParams: string[] = [period, periodId, playerId];
    if (quizId) {
      entryQuery += ' AND quiz_id = ?';
      entryParams.push(quizId);
    }
    entryQuery += ' ORDER BY percentage DESC, updated_at ASC LIMIT 1';
    entry = await db
      .prepare(entryQuery)
      .bind(...entryParams)
      .first<LeaderboardEntry>();
  }

  if (!entry) return null;

  let rankQuery: string;
  const rankParams: (string | number)[] = [
    entry.percentage,
    entry.percentage,
    entry.updatedAt,
  ];

  if (period === 'all' || !periodId) {
    rankQuery = `
      SELECT COUNT(*) + 1 as rank
      FROM player_highscores p2
      WHERE (p2.percentage > ? OR (p2.percentage = ? AND p2.updated_at < ?))
    `;
    if (quizId) {
      rankQuery += ' AND p2.quiz_id = ?';
      rankParams.push(quizId);
    }
  } else {
    rankQuery = `
      SELECT COUNT(*) + 1 as rank
      FROM period_highscores p2
      WHERE p2.period_type = ? AND p2.period_id = ?
        AND (p2.percentage > ? OR (p2.percentage = ? AND p2.updated_at < ?))
    `;
    rankParams.unshift(period, periodId);
    if (quizId) {
      rankQuery += ' AND p2.quiz_id = ?';
      rankParams.push(quizId);
    }
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
 * GET /api/leaderboard?limit=20&quizId=exposure-basics&playerId=...&period=week
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const quizId = url.searchParams.get('quizId');
  const rawPlayerId = url.searchParams.get('playerId');
  const period = parseLeaderboardPeriod(url.searchParams.get('period'));
  const meta = periodMeta(period);
  const limit = Math.min(
    parseInt(url.searchParams.get('limit') || '20', 10),
    100
  );

  const viewerPlayerId = rawPlayerId
    ? sanitizePlayerId(rawPlayerId)
    : null;

  try {
    if (context.env.DB) {
      let leaderboard: LeaderboardEntry[] = [];

      if (period === 'all') {
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
        leaderboard = rows.results ?? [];
      } else if (meta.periodId) {
        let query = `
          SELECT quiz_id as quizId, player_id as playerId, display_name as displayName,
                 percentage, correct_count as correctCount,
                 total_questions as totalQuestions, updated_at as updatedAt
          FROM period_highscores
          WHERE period_type = ? AND period_id = ?
        `;
        const params: (string | number)[] = [period, meta.periodId];
        if (quizId) {
          query += ' AND quiz_id = ?';
          params.push(quizId);
        }
        query += ' ORDER BY percentage DESC, updated_at ASC LIMIT ?';
        params.push(limit);

        try {
          const rows = await context.env.DB.prepare(query)
            .bind(...params)
            .all<LeaderboardEntry>();
          leaderboard = rows.results ?? [];
        } catch (error) {
          console.warn('Period leaderboard query failed (migration 004?):', error);
          leaderboard = [];
        }
      }

      let viewer: { rank: number; entry: LeaderboardEntry } | null = null;
      if (viewerPlayerId) {
        try {
          viewer = await fetchViewerRank(
            context.env.DB,
            viewerPlayerId,
            quizId,
            period,
            meta.periodId
          );
        } catch (error) {
          console.warn('Viewer rank query failed:', error);
        }
      }

      return json({
        leaderboard,
        total: leaderboard.length,
        viewer,
        period: meta.period,
        periodId: meta.periodId,
        seasonId: meta.seasonId,
      });
    }
  } catch (error) {
    console.warn('Leaderboard query failed:', error);
  }

  return json({
    leaderboard: [],
    total: 0,
    viewer: null,
    period: meta.period,
    periodId: meta.periodId,
    seasonId: meta.seasonId,
  });
};
