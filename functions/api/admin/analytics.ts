/**
 * Cloudflare Pages Function — admin analytics from quiz_attempts
 *
 * GET /api/admin/analytics — aggregated attempt stats (PIN-gated)
 *
 * Auth: header X-Admin-Pin must match runtime ADMIN_PIN (preferred) or VITE_ADMIN_PIN.
 *
 * CTA clicks are stored as quiz_id `cta:{target}:{topic}:{sourceQuizId}`
 * and returned as a target × topic breakdown (P3 funnel).
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

type CtaTarget = 'guide' | 'newsletter' | 'pixfan';

export interface CtaClickRow {
  target: CtaTarget;
  topic: string;
  sourceQuizId: string;
  clicks: number;
}

export interface CtaAnalyticsBreakdown {
  byTarget: Array<{ target: CtaTarget; clicks: number }>;
  byTopic: Array<{ topic: string; clicks: number }>;
  rows: CtaClickRow[];
}

export interface AnalyticsDashboard {
  summary: {
    totalAttempts: number;
    avgPercentage: number;
    uniqueQuizzes: number;
    ctaClicks: number;
  };
  /** Ventilation CTA : guide / newsletter / pixfan × topic. */
  cta: CtaAnalyticsBreakdown;
  quizzes: QuizAttemptStats[];
  recentDays: Array<{ day: string; attempts: number }>;
}

const CTA_TARGETS = new Set<CtaTarget>(['guide', 'newsletter', 'pixfan']);

function parseCtaQuizId(
  quizId: string
): { target: CtaTarget; topic: string; sourceQuizId: string } | null {
  if (!quizId.startsWith('cta:')) return null;
  const parts = quizId.split(':');
  if (parts.length < 4) return null;
  const target = parts[1] as CtaTarget;
  const topic = parts[2];
  const sourceQuizId = parts.slice(3).join(':');
  if (!CTA_TARGETS.has(target) || !topic || !sourceQuizId) return null;
  return { target, topic, sourceQuizId };
}

function emptyCta(): CtaAnalyticsBreakdown {
  return { byTarget: [], byTopic: [], rows: [] };
}

function buildCtaBreakdown(
  rawRows: Array<{ quizId: string; clicks: number }>
): CtaAnalyticsBreakdown {
  const byTargetMap = new Map<CtaTarget, number>();
  const byTopicMap = new Map<string, number>();
  const rows: CtaClickRow[] = [];

  for (const raw of rawRows) {
    const clicks = Number(raw.clicks) || 0;
    if (clicks <= 0) continue;
    const parsed = parseCtaQuizId(raw.quizId);
    if (!parsed) continue;
    rows.push({ ...parsed, clicks });
    byTargetMap.set(
      parsed.target,
      (byTargetMap.get(parsed.target) ?? 0) + clicks
    );
    byTopicMap.set(parsed.topic, (byTopicMap.get(parsed.topic) ?? 0) + clicks);
  }

  rows.sort((a, b) => b.clicks - a.clicks || a.topic.localeCompare(b.topic));

  const targetOrder: CtaTarget[] = ['guide', 'newsletter', 'pixfan'];
  const byTarget = targetOrder
    .filter((t) => (byTargetMap.get(t) ?? 0) > 0)
    .map((target) => ({ target, clicks: byTargetMap.get(target) ?? 0 }));

  const byTopic = [...byTopicMap.entries()]
    .map(([topic, clicks]) => ({ topic, clicks }))
    .sort((a, b) => b.clicks - a.clicks || a.topic.localeCompare(b.topic));

  return { byTarget, byTopic, rows };
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
    cta: emptyCta(),
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

    const ctaGroupRows = await db
      .prepare(
        `SELECT quiz_id as quizId, COUNT(*) as clicks
         FROM quiz_attempts
         WHERE quiz_id LIKE 'cta:%'
         GROUP BY quiz_id
         ORDER BY clicks DESC
         LIMIT 200`
      )
      .all<{ quizId: string; clicks: number }>();

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

    const cta = buildCtaBreakdown(
      (ctaGroupRows.results ?? []).map((row) => ({
        quizId: row.quizId,
        clicks: Number(row.clicks) || 0,
      }))
    );

    const dashboard: AnalyticsDashboard = {
      summary: {
        totalAttempts: Number(summaryRow?.totalAttempts) || 0,
        avgPercentage: Number(summaryRow?.avgPercentage) || 0,
        uniqueQuizzes: Number(summaryRow?.uniqueQuizzes) || 0,
        ctaClicks: Number(ctaRow?.ctaClicks) || 0,
      },
      cta,
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
