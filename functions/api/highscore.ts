/**
 * Cloudflare Pages Function — per-player high-score API with D1
 *
 * Route: /api/highscore
 */

import { json } from './utils';
import { filterDisplayName } from './profanity';
import { getMonthPeriodId, getWeekPeriodId } from './period';

export interface Env {
  DB: D1Database;
}

interface HighScoreBody {
  quizId: string;
  playerId: string;
  displayName: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
}

interface HighScoreRecord {
  quizId: string;
  playerId: string;
  displayName: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string;
}

const MAX_DISPLAY_NAME = 24;
const MAX_PLAYER_ID = 64;

function sanitizeDisplayName(raw: string): string {
  const trimmed = raw.trim().replace(/[\u0000-\u001F\u007F]/g, '');
  const collapsed = trimmed.replace(/\s+/g, ' ');
  return collapsed.slice(0, MAX_DISPLAY_NAME);
}

function sanitizePlayerId(raw: string): string | null {
  const id = raw.trim();
  if (!id || id.length > MAX_PLAYER_ID) return null;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) return null;
  return id;
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

/**
 * GET /api/highscore?quizId=...&playerId=...
 * Returns { score: HighScoreRecord | null } for this player on this quiz.
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const quizId = url.searchParams.get('quizId');
  const playerId = url.searchParams.get('playerId');

  if (!quizId || !playerId) {
    return json({ error: 'Missing quizId or playerId query parameter' }, 400);
  }

  const safePlayerId = sanitizePlayerId(playerId);
  if (!safePlayerId) {
    return json({ error: 'Invalid playerId' }, 400);
  }

  try {
    if (context.env.DB) {
      const row = await context.env.DB.prepare(
        `SELECT quiz_id as quizId, player_id as playerId, display_name as displayName,
                percentage, correct_count as correctCount,
                total_questions as totalQuestions, updated_at as updatedAt
         FROM player_highscores
         WHERE quiz_id = ? AND player_id = ?`
      )
        .bind(quizId, safePlayerId)
        .first<HighScoreRecord>();

      return json({ score: row ?? null });
    }
  } catch (error) {
    console.warn('D1 query failed, returning null:', error);
  }

  return json({ score: null });
};

/**
 * POST /api/highscore
 * Body: { quizId, playerId, displayName, percentage, correctCount, totalQuestions }
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: HighScoreBody;
  try {
    body = (await context.request.json()) as HighScoreBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const {
    quizId,
    playerId: rawPlayerId,
    displayName: rawDisplayName,
    percentage,
    correctCount,
    totalQuestions,
  } = body;

  const playerId = sanitizePlayerId(rawPlayerId ?? '');
  const displayName = filterDisplayName(sanitizeDisplayName(rawDisplayName ?? ''));

  if (
    !quizId ||
    !playerId ||
    !displayName ||
    typeof percentage !== 'number' ||
    typeof correctCount !== 'number' ||
    typeof totalQuestions !== 'number'
  ) {
    return json({ error: 'Invalid payload' }, 400);
  }

  if (percentage < 0 || percentage > 100) {
    return json({ error: 'percentage must be 0–100' }, 400);
  }

  const updatedAt = new Date().toISOString();

  try {
    if (context.env.DB) {
      const rateRow = await context.env.DB.prepare(
        `SELECT updated_at as updatedAt FROM player_highscores
         WHERE player_id = ?
         ORDER BY updated_at DESC
         LIMIT 1`
      )
        .bind(playerId)
        .first<{ updatedAt: string }>();

      if (rateRow?.updatedAt) {
        const lastMs = Date.parse(rateRow.updatedAt);
        if (!Number.isNaN(lastMs) && Date.now() - lastMs < 3000) {
          return json({ error: 'Rate limit: wait before submitting again' }, 429);
        }
      }

      const existing = await context.env.DB.prepare(
        `SELECT quiz_id as quizId, player_id as playerId, display_name as displayName,
                percentage, correct_count as correctCount,
                total_questions as totalQuestions, updated_at as updatedAt
         FROM player_highscores
         WHERE quiz_id = ? AND player_id = ?`
      )
        .bind(quizId, playerId)
        .first<HighScoreRecord>();

      const isNewAllTime = !existing || percentage > existing.percentage;

      if (isNewAllTime) {
        await context.env.DB.prepare(
          `INSERT INTO player_highscores
             (quiz_id, player_id, display_name, percentage, correct_count, total_questions, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(quiz_id, player_id) DO UPDATE SET
             display_name = excluded.display_name,
             percentage = excluded.percentage,
             correct_count = excluded.correct_count,
             total_questions = excluded.total_questions,
             updated_at = excluded.updated_at`
        )
          .bind(
            quizId,
            playerId,
            displayName,
            percentage,
            correctCount,
            totalQuestions,
            updatedAt
          )
          .run();
      } else if (existing) {
        // Keep all-time score, but refresh display name
        await context.env.DB.prepare(
          `UPDATE player_highscores SET display_name = ? WHERE quiz_id = ? AND player_id = ?`
        )
          .bind(displayName, quizId, playerId)
          .run();
      }

      // Best-of-period boards (weekly + monthly season) — independent of all-time
      await upsertPeriodHighScore(context.env.DB, {
        periodType: 'week',
        periodId: getWeekPeriodId(),
        quizId,
        playerId,
        displayName,
        percentage,
        correctCount,
        totalQuestions,
        updatedAt,
      });
      await upsertPeriodHighScore(context.env.DB, {
        periodType: 'month',
        periodId: getMonthPeriodId(),
        quizId,
        playerId,
        displayName,
        percentage,
        correctCount,
        totalQuestions,
        updatedAt,
      });

      const saved = await context.env.DB.prepare(
        `SELECT quiz_id as quizId, player_id as playerId, display_name as displayName,
                percentage, correct_count as correctCount,
                total_questions as totalQuestions, updated_at as updatedAt
         FROM player_highscores
         WHERE quiz_id = ? AND player_id = ?`
      )
        .bind(quizId, playerId)
        .first<HighScoreRecord>();

      return json({
        score: saved ?? {
          quizId,
          playerId,
          displayName,
          percentage,
          correctCount,
          totalQuestions,
          updatedAt,
        },
        isNewHighScore: isNewAllTime,
      });
    }
  } catch (error) {
    console.warn('D1 operation failed:', error);
  }

  return json({
    score: {
      quizId,
      playerId,
      displayName,
      percentage,
      correctCount,
      totalQuestions,
      updatedAt,
    },
    isNewHighScore: true,
  });
};

async function upsertPeriodHighScore(
  db: D1Database,
  input: {
    periodType: 'week' | 'month';
    periodId: string;
    quizId: string;
    playerId: string;
    displayName: string;
    percentage: number;
    correctCount: number;
    totalQuestions: number;
    updatedAt: string;
  }
): Promise<void> {
  try {
    const existing = await db
      .prepare(
        `SELECT percentage FROM period_highscores
         WHERE period_type = ? AND period_id = ? AND quiz_id = ? AND player_id = ?`
      )
      .bind(input.periodType, input.periodId, input.quizId, input.playerId)
      .first<{ percentage: number }>();

    if (existing && existing.percentage >= input.percentage) {
      // Still refresh display name if they play again
      await db
        .prepare(
          `UPDATE period_highscores SET display_name = ?
           WHERE period_type = ? AND period_id = ? AND quiz_id = ? AND player_id = ?`
        )
        .bind(
          input.displayName,
          input.periodType,
          input.periodId,
          input.quizId,
          input.playerId
        )
        .run();
      return;
    }

    await db
      .prepare(
        `INSERT INTO period_highscores
           (period_type, period_id, quiz_id, player_id, display_name,
            percentage, correct_count, total_questions, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(period_type, period_id, quiz_id, player_id) DO UPDATE SET
           display_name = excluded.display_name,
           percentage = excluded.percentage,
           correct_count = excluded.correct_count,
           total_questions = excluded.total_questions,
           updated_at = excluded.updated_at`
      )
      .bind(
        input.periodType,
        input.periodId,
        input.quizId,
        input.playerId,
        input.displayName,
        input.percentage,
        input.correctCount,
        input.totalQuestions,
        input.updatedAt
      )
      .run();
  } catch (error) {
    // Table may not exist until migration 004 is applied
    console.warn('Period highscore upsert skipped:', error);
  }
}
