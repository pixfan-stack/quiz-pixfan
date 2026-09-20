/**
 * Cloudflare Pages Function — admin analytics from quiz_attempts
 *
 * GET /api/admin/analytics — aggregated attempt stats (PIN-gated)
 *
 * Auth: header X-Admin-Pin must match runtime ADMIN_PIN (preferred) or VITE_ADMIN_PIN.
 */

import { json } from '../utils';
import { authorizeAdmin, type AdminPinEnv } from './auth';

export interface Env extends AdminPinEnv {
  DB: D1Database;
}

export interface QuizAttemptStats {
  quizId: string;
  attempts: number;
  avgPercentage: number;
  avgTimeSeconds: number;
  lowScoreRate: number;
}

export interface AnalyticsDashboard {
  summary: {
    totalAttempts: number;
    avgPercentage: number;
    uniqueQuizzes: number;
    ctaClicks: number;
  };
  quizzes: QuizAttemptStats[];
  recentDays: Array<{ day: string; attempts: number }>;
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = authorizeAdmin(context.request, context.env);
  if (!auth.ok) {
    return json({ error: auth.error }, auth.status);
  }

  const empty: AnalyticsDashboard = {
    summary: {
      totalAttempts: 0,
      avgPercentage: 0,
      uniqueQuizzes: 0,
      ctaClicks: 0,
    },
    quizzes: [],
    recentDays: [],
  };

  if (!context.env.DB) {
    return json(empty);
  }

  try {
    const db = context.env.DB;

    const summaryRow = await db
      .prepare(
        `SELECT
           COUNT(*) as totalAttempts,
           ROUND(AVG(percentage), 1) as avgPercentage,
           COUNT(DISTINCT quiz_id) as uniqueQuizzes
         FROM quiz_attempts
         WHERE quiz_id NOT LIKE 'cta:%'`
      )
      .first<{
        totalAttempts: number;
        avgPercentage: number | null;
        uniqueQuizzes: number;
      }>();

    const ctaRow = await db
      .prepare(
        `SELECT COUNT(*) as ctaClicks
         FROM quiz_attempts
         WHERE quiz_id LIKE 'cta:%'`
      )
      .first<{ ctaClicks: number }>();

    const quizRows = await db
      .prepare(
        `SELECT quiz_id as quizId,
                COUNT(*) as attempts,
                ROUND(AVG(percentage), 1) as avgPercentage,
                ROUND(AVG(time_taken_seconds), 0) as avgTimeSeconds,
                ROUND(
                  100.0 * SUM(CASE WHEN percentage < 50 THEN 1 ELSE 0 END) / COUNT(*),
                  1
                ) as lowScoreRate
         FROM quiz_attempts
         WHERE quiz_id NOT LIKE 'cta:%'
         GROUP BY quiz_id
         ORDER BY attempts DESC
         LIMIT 50`
      )
      .all<QuizAttemptStats>();

    const dayRows = await db
      .prepare(
        `SELECT substr(created_at, 1, 10) as day,
                COUNT(*) as attempts
         FROM quiz_attempts
         WHERE quiz_id NOT LIKE 'cta:%'
           AND created_at >= strftime('%Y-%m-%dT%H:%M:%SZ', 'now', '-14 days')
         GROUP BY day
         ORDER BY day DESC
         LIMIT 14`
      )
      .all<{ day: string; attempts: number }>();

    const dashboard: AnalyticsDashboard = {
      summary: {
        totalAttempts: Number(summaryRow?.totalAttempts) || 0,
        avgPercentage: Number(summaryRow?.avgPercentage) || 0,
        uniqueQuizzes: Number(summaryRow?.uniqueQuizzes) || 0,
        ctaClicks: Number(ctaRow?.ctaClicks) || 0,
      },
      quizzes: (quizRows.results ?? []).map((row) => ({
        quizId: row.quizId,
        attempts: Number(row.attempts) || 0,
        avgPercentage: Number(row.avgPercentage) || 0,
        avgTimeSeconds: Number(row.avgTimeSeconds) || 0,
        lowScoreRate: Number(row.lowScoreRate) || 0,
      })),
      recentDays: (dayRows.results ?? []).map((row) => ({
        day: row.day,
        attempts: Number(row.attempts) || 0,
      })),
    };

    return json(dashboard);
  } catch (error) {
    console.warn('Admin analytics failed:', error);
    return json({ error: 'Analytics unavailable' }, 503);
  }
};
