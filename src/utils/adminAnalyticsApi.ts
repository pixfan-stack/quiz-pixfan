/**
 * Admin client for quiz_attempts analytics dashboard (PIN-gated).
 */

import { getAdminSessionPin } from './adminAuth';

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
  };
  quizzes: AdminQuizAttemptStats[];
  recentDays: Array<{ day: string; attempts: number }>;
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
    if (!res.ok) {
      return { ok: false, data: null, error: 'unavailable' };
    }
    const data = (await res.json()) as AdminAnalyticsDashboard;
    return { ok: true, data };
  } catch {
    return { ok: false, data: null, error: 'unavailable' };
  }
}
