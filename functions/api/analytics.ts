/**
 * Cloudflare Pages Function — anonymous quiz attempt analytics
 *
 * POST /api/analytics  — record a completed attempt
 * GET  /api/analytics?quizId=...  — aggregated stats
 *
 * CTA clicks reuse the same table with quiz_id markers:
 *   cta:{guide|newsletter|pixfan}:{topic}:{sourceQuizId}
 * Habit funnel events:
 *   evt:{reminder_on|reminder_off|ics_download|pwa_install|account_create|account_redeem|weak_spots_cta}
 *   percentage=0, correct_count=0, total_questions=1, time_taken_seconds=0
 */

import { json } from './utils';

export interface Env {
  DB: D1Database;
}

/** Soft per-IP cooldown (Cache API) — mirrors account.ts; blocks burst spam. */
const ANALYTICS_COOLDOWN_MS = 1_000;

interface AttemptBody {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  timeTakenSeconds: number;
}

interface QuizStats {
  quizId: string;
  attempts: number;
  avgPercentage: number;
  avgTimeSeconds: number;
}

function clientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP')?.trim() ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/**
 * Cache-API cooldown keyed by IP (no schema change).
 * Fails open if cache is unavailable (e.g. some local runtimes).
 */
async function isIpRateLimited(
  request: Request,
  cooldownMs: number
): Promise<boolean> {
  const ip = clientIp(request);
  const cacheKey = new Request(
    `https://rate-limit.quiz-pixfan.internal/analytics/post/${encodeURIComponent(ip)}`
  );
  try {
    const cache = caches.default;
    const hit = await cache.match(cacheKey);
    if (hit) {
      const last = Number(await hit.text());
      if (!Number.isNaN(last) && Date.now() - last < cooldownMs) {
        return true;
      }
    }
    await cache.put(
      cacheKey,
      new Response(String(Date.now()), {
        headers: {
          'Cache-Control': `max-age=${Math.ceil(cooldownMs / 1000) + 1}`,
        },
      })
    );
    return false;
  } catch {
    return false;
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (await isIpRateLimited(context.request, ANALYTICS_COOLDOWN_MS)) {
    return json({ error: 'Rate limit: wait before posting again' }, 429);
  }

  let body: AttemptBody;
  try {
    body = (await context.request.json()) as AttemptBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { quizId, percentage, correctCount, totalQuestions, timeTakenSeconds } =
    body;

  if (
    !quizId ||
    typeof percentage !== 'number' ||
    typeof correctCount !== 'number' ||
    typeof totalQuestions !== 'number' ||
    typeof timeTakenSeconds !== 'number'
  ) {
    return json({ error: 'Invalid payload' }, 400);
  }

  if (
    percentage < 0 ||
    percentage > 100 ||
    correctCount < 0 ||
    totalQuestions < 1 ||
    timeTakenSeconds < 0
  ) {
    return json({ error: 'Out of range values' }, 400);
  }

  try {
    if (context.env.DB) {
      await context.env.DB.prepare(
        `INSERT INTO quiz_attempts
           (quiz_id, percentage, correct_count, total_questions, time_taken_seconds)
         VALUES (?, ?, ?, ?, ?)`
      )
        .bind(
          quizId,
          Math.round(percentage),
          correctCount,
          totalQuestions,
          Math.round(timeTakenSeconds)
        )
        .run();

      return json({ ok: true }, 201);
    }
  } catch (error) {
    console.warn('Analytics insert failed:', error);
  }

  return json({ ok: true }, 201);
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const quizId = url.searchParams.get('quizId');

  try {
    if (context.env.DB) {
      if (quizId) {
        const row = await context.env.DB.prepare(
          `SELECT quiz_id as quizId,
                  COUNT(*) as attempts,
                  ROUND(AVG(percentage), 1) as avgPercentage,
                  ROUND(AVG(time_taken_seconds), 0) as avgTimeSeconds
           FROM quiz_attempts
           WHERE quiz_id = ?
           GROUP BY quiz_id`
        )
          .bind(quizId)
          .first<QuizStats>();

        return json({ stats: row ?? null });
      }

      const rows = await context.env.DB.prepare(
        `SELECT quiz_id as quizId,
                COUNT(*) as attempts,
                ROUND(AVG(percentage), 1) as avgPercentage,
                ROUND(AVG(time_taken_seconds), 0) as avgTimeSeconds
         FROM quiz_attempts
         WHERE quiz_id NOT LIKE 'cta:%' AND quiz_id NOT LIKE 'evt:%'
         GROUP BY quiz_id
         ORDER BY attempts DESC`
      ).all<QuizStats>();

      return json({ stats: rows.results ?? [] });
    }
  } catch (error) {
    console.warn('Analytics query failed:', error);
  }

  return json({ stats: quizId ? null : [] });
};
