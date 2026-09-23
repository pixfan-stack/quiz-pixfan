/**
 * Cloudflare Pages Function — admin analytics from quiz_attempts
 *
 * GET /api/admin/analytics — aggregated attempt stats (PIN-gated)
 *
 * Auth: header X-Admin-Pin must match runtime ADMIN_PIN (preferred) or VITE_ADMIN_PIN.
 *
 * CTA clicks are stored as quiz_id `cta:{target}:{topic}:{sourceQuizId}`
 * and returned as a target × topic breakdown (P3 funnel).
 *
 * Habit events use quiz_id `evt:{name}` (reminder / ics / pwa / account).
 * Attempts are also ventilated by mode (photo-reading / daily / duel / weak-spots / packs).
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

type AttemptMode =
  | 'photo-reading'
  | 'daily'
  | 'duel'
  | 'weak-spots'
  | 'packs';

type HabitEventName =
  | 'reminder_on'
  | 'reminder_off'
  | 'ics_download'
  | 'pwa_install'
  | 'account_create'
  | 'account_redeem'
  | 'weak_spots_cta';

const ATTEMPT_MODES: AttemptMode[] = [
  'photo-reading',
  'daily',
  'duel',
  'weak-spots',
  'packs',
];

const HABIT_EVENTS = new Set<HabitEventName>([
  'reminder_on',
  'reminder_off',
  'ics_download',
  'pwa_install',
  'account_create',
  'account_redeem',
  'weak_spots_cta',
]);

/** Exclude CTA + habit markers from real quiz attempt aggregates. */
const REAL_ATTEMPT_WHERE =
  `quiz_id NOT LIKE 'cta:%' AND quiz_id NOT LIKE 'evt:%'`;

export interface AnalyticsDashboard {
  summary: {
    totalAttempts: number;
    avgPercentage: number;
    uniqueQuizzes: number;
    ctaClicks: number;
    /** CTA clicks / quiz attempts as percentage (0–100). */
    ctaConversionPct: number;
  };
  /** Ventilation CTA : guide / newsletter / pixfan × topic. */
  cta: CtaAnalyticsBreakdown;
  /** Attempts by play mode (excludes cta:/evt: markers). */
  modes: Array<{ mode: AttemptMode; attempts: number }>;
  /** Habit funnel evt:* counters. */
  events: Array<{ event: HabitEventName; count: number }>;
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

function classifyAttemptMode(quizId: string): AttemptMode {
  if (quizId === 'photo-reading') return 'photo-reading';
  if (quizId === 'weak-spots') return 'weak-spots';
  if (quizId.startsWith('daily-')) return 'daily';
  if (quizId.startsWith('duel-')) return 'duel';
  return 'packs';
}

function buildModeCounts(
  rawRows: Array<{ quizId: string; attempts: number }>
): Array<{ mode: AttemptMode; attempts: number }> {
  const map = new Map<AttemptMode, number>();
  for (const raw of rawRows) {
    const attempts = Number(raw.attempts) || 0;
    if (attempts <= 0) continue;
    const mode = classifyAttemptMode(raw.quizId);
    map.set(mode, (map.get(mode) ?? 0) + attempts);
  }
  return ATTEMPT_MODES.filter((m) => (map.get(m) ?? 0) > 0).map((mode) => ({
    mode,
    attempts: map.get(mode) ?? 0,
  }));
}

function parseHabitEvent(quizId: string): HabitEventName | null {
  if (!quizId.startsWith('evt:')) return null;
  const name = quizId.slice(4) as HabitEventName;
  return HABIT_EVENTS.has(name) ? name : null;
}

function buildHabitEvents(
  rawRows: Array<{ quizId: string; count: number }>
): Array<{ event: HabitEventName; count: number }> {
  const map = new Map<HabitEventName, number>();
  for (const raw of rawRows) {
    const count = Number(raw.count) || 0;
    if (count <= 0) continue;
    const event = parseHabitEvent(raw.quizId);
    if (!event) continue;
    map.set(event, (map.get(event) ?? 0) + count);
  }
  const order: HabitEventName[] = [
    'reminder_on',
    'reminder_off',
    'ics_download',
    'pwa_install',
    'account_create',
    'account_redeem',
    'weak_spots_cta',
  ];
  return order
    .filter((e) => (map.get(e) ?? 0) > 0)
    .map((event) => ({ event, count: map.get(event) ?? 0 }));
}

function ctaConversionPct(ctaClicks: number, totalAttempts: number): number {
  if (totalAttempts <= 0) return 0;
  return Math.round((1000 * ctaClicks) / totalAttempts) / 10;
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
      ctaConversionPct: 0,
    },
    cta: emptyCta(),
    modes: [],
    events: [],
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
         WHERE ${REAL_ATTEMPT_WHERE}`
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

    const modeGroupRows = await db
      .prepare(
        `SELECT quiz_id as quizId, COUNT(*) as attempts
         FROM quiz_attempts
         WHERE ${REAL_ATTEMPT_WHERE}
         GROUP BY quiz_id`
      )
      .all<{ quizId: string; attempts: number }>();

    const eventGroupRows = await db
      .prepare(
        `SELECT quiz_id as quizId, COUNT(*) as count
         FROM quiz_attempts
         WHERE quiz_id LIKE 'evt:%'
         GROUP BY quiz_id
         ORDER BY count DESC
         LIMIT 50`
      )
      .all<{ quizId: string; count: number }>();

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
         WHERE ${REAL_ATTEMPT_WHERE}
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
         WHERE ${REAL_ATTEMPT_WHERE}
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

    const totalAttempts = Number(summaryRow?.totalAttempts) || 0;
    const ctaClicks = Number(ctaRow?.ctaClicks) || 0;

    const dashboard: AnalyticsDashboard = {
      summary: {
        totalAttempts,
        avgPercentage: Number(summaryRow?.avgPercentage) || 0,
        uniqueQuizzes: Number(summaryRow?.uniqueQuizzes) || 0,
        ctaClicks,
        ctaConversionPct: ctaConversionPct(ctaClicks, totalAttempts),
      },
      cta,
      modes: buildModeCounts(
        (modeGroupRows.results ?? []).map((row) => ({
          quizId: row.quizId,
          attempts: Number(row.attempts) || 0,
        }))
      ),
      events: buildHabitEvents(
        (eventGroupRows.results ?? []).map((row) => ({
          quizId: row.quizId,
          count: Number(row.count) || 0,
        }))
      ),
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
