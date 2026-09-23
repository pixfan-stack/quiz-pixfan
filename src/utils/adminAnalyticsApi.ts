/**
 * Admin client for quiz_attempts analytics dashboard (PIN-gated).
 */

import { getAdminSessionPin } from './adminAuth';
import type { CtaAnalyticsBreakdown } from './pixfanCta';
import type {
  AttemptModeCount,
  HabitEventCount,
} from './habitAnalytics';

export interface AdminQuizAttemptStats {
  quizId: string;
  attempts: number;
  avgPercentage: number;
  avgTimeSeconds: number;
  lowScoreRate: number;
}

export interface AdminAnalyticsDashboard {
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
  modes: AttemptModeCount[];
  /** Habit funnel evt:* counters. */
  events: HabitEventCount[];
  quizzes: AdminQuizAttemptStats[];
  recentDays: Array<{ day: string; attempts: number }>;
}

function emptyCta(): CtaAnalyticsBreakdown {
  return { byTarget: [], byTopic: [], rows: [] };
}

function adminHeaders(): HeadersInit {
  const pin = getAdminSessionPin();
  return {
    'Content-Type': 'application/json',
    'X-Admin-Pin': pin,
  };
}

export async function fetchAdminAnalytics(): Promise<{
  ok: boolean;
  data: AdminAnalyticsDashboard | null;
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/analytics', {
      headers: adminHeaders(),
    });
    if (res.status === 401) {
      return { ok: false, data: null, error: 'unauthorized' };
    }
    if (res.status === 503) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (body?.error?.includes('not configured')) {
        return { ok: false, data: null, error: 'pin_unconfigured' };
      }
      return { ok: false, data: null, error: 'unavailable' };
    }
    if (!res.ok) {
      return { ok: false, data: null, error: 'unavailable' };
    }
    const data = (await res.json()) as AdminAnalyticsDashboard;
    // Older deployments may omit newer fields — keep UI resilient.
    if (!data.cta) {
      data.cta = emptyCta();
    }
    if (typeof data.summary?.ctaConversionPct !== 'number') {
      const attempts = data.summary?.totalAttempts ?? 0;
      const clicks = data.summary?.ctaClicks ?? 0;
      data.summary = {
        ...data.summary,
        ctaConversionPct:
          attempts > 0 ? Math.round((1000 * clicks) / attempts) / 10 : 0,
      };
    }
    if (!Array.isArray(data.modes)) {
      data.modes = [];
    }
    if (!Array.isArray(data.events)) {
      data.events = [];
    }
    return { ok: true, data };
  } catch {
    return { ok: false, data: null, error: 'unavailable' };
  }
}
