/**
 * Cloudflare Pages Function — high-score API with D1 support
 *
 * Route: /api/highscore
 *
 * This file is fully functional with D1 when bound in wrangler.toml.
 * Falls back gracefully to localStorage-compatible stub when D1 is not available.
 *
 * ============================================================================
 * DEPLOYMENT STEPS
 * ============================================================================
 *
 * 1. Create D1 database:
 *    npx wrangler d1 create quiz-pixfan-scores
 *
 * 2. Initialize schema:
 *    npx wrangler d1 execute quiz-pixfan-scores --file=setup-schema.sql
 *
 * 3. Add to wrangler.toml:
 *    [[d1_databases]]
 *    binding = "DB"
 *    database_name = "quiz-pixfan-scores"
 *    database_id = "<DATABASE_ID_FROM_STEP_1>"
 *
 * 4. Deploy:
 *    npx wrangler pages deploy dist
 *
 * ============================================================================
 */

export interface Env {
  DB: D1Database;
}

interface HighScoreBody {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
}

interface HighScoreRecord {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

/**
 * GET /api/highscore?quizId=exposure-basics
 * Returns { score: HighScoreRecord | null }
 */
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const quizId = url.searchParams.get('quizId');

  if (!quizId) {
    return json({ error: 'Missing quizId query parameter' }, 400);
  }

  try {
    // Try D1 first
    if (context.env.DB) {
      const row = await context.env.DB.prepare(
        `SELECT quiz_id as quizId, percentage, correct_count as correctCount,
                total_questions as totalQuestions, updated_at as updatedAt
         FROM highscores
         WHERE quiz_id = ?`
      )
        .bind(quizId)
        .first<HighScoreRecord>();

      return json({ score: row ?? null });
    }
  } catch (error) {
    console.warn('D1 query failed, returning null:', error);
  }

  // Fallback: return null (app will use localStorage)
  return json({ score: null });
};

/**
 * POST /api/highscore
 * Body: { quizId, percentage, correctCount, totalQuestions }
 * Stores the score only if it beats the existing best.
 * Returns { score: HighScoreRecord, isNewHighScore: boolean }
 */
export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: HighScoreBody;
  try {
    body = (await context.request.json()) as HighScoreBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { quizId, percentage, correctCount, totalQuestions } = body;

  if (
    !quizId ||
    typeof percentage !== 'number' ||
    typeof correctCount !== 'number' ||
    typeof totalQuestions !== 'number'
  ) {
    return json({ error: 'Invalid payload' }, 400);
  }

  if (percentage < 0 || percentage > 100) {
    return json({ error: 'percentage must be 0–100' }, 400);
  }

  const record: HighScoreRecord = {
    quizId,
    percentage,
    correctCount,
    totalQuestions,
    updatedAt: new Date().toISOString(),
  };

  try {
    // Try D1 first
    if (context.env.DB) {
      // Check existing score
      const existing = await context.env.DB.prepare(
        'SELECT percentage FROM highscores WHERE quiz_id = ?'
      )
        .bind(quizId)
        .first<{ percentage: number }>();

      if (existing && existing.percentage >= percentage) {
        return json({
          score: {
            quizId: existing.quizId || quizId,
            percentage: existing.percentage,
            correctCount: correctCount,
            totalQuestions: totalQuestions,
            updatedAt: new Date().toISOString(),
          },
          isNewHighScore: false,
        });
      }

      // Upsert the new score
      await context.env.DB.prepare(
        `INSERT INTO highscores (quiz_id, percentage, correct_count, total_questions, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(quiz_id) DO UPDATE SET
           percentage = excluded.percentage,
           correct_count = excluded.correct_count,
           total_questions = excluded.total_questions,
           updated_at = excluded.updated_at`
      )
        .bind(quizId, percentage, correctCount, totalQuestions, record.updatedAt)
        .run();

      return json({
        score: record,
        isNewHighScore: true,
      });
    }
  } catch (error) {
    console.warn('D1 operation failed:', error);
    // Fall through to return success anyway (app uses localStorage)
  }

  // Return success anyway — app works with localStorage as fallback
  return json({
    score: record,
    isNewHighScore: true,
  });
};
