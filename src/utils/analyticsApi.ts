import { isRemoteScoresEnabled } from './remoteScores';
import {
  ctaAnalyticsQuizId,
  type PixfanCtaTarget,
  type PixfanTopic,
} from './pixfanCta';
import {
  habitEventQuizId,
  type HabitEventName,
} from './habitAnalytics';

export interface QuizStats {
  quizId: string;
  attempts: number;
  avgPercentage: number;
  avgTimeSeconds: number;
}

/** Fire-and-forget anonymous attempt recording. */
export async function trackQuizAttempt(payload: {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  timeTakenSeconds: number;
}): Promise<void> {
  if (!isRemoteScoresEnabled()) return;
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort
  }
}

/**
 * Record a result-screen CTA click in `quiz_attempts` via the same endpoint.
 * Encoded as quiz_id `cta:{target}:{topic}:{sourceQuizId}` with zeroed metrics.
 */
export async function trackCtaClick(payload: {
  sourceQuizId: string;
  target: PixfanCtaTarget;
  topic: PixfanTopic;
}): Promise<void> {
  await trackQuizAttempt({
    quizId: ctaAnalyticsQuizId(
      payload.target,
      payload.topic,
      payload.sourceQuizId
    ),
    percentage: 0,
    correctCount: 0,
    totalQuestions: 1,
    timeTakenSeconds: 0,
  });
}

/**
 * Record a habit-funnel event in `quiz_attempts`.
 * Encoded as quiz_id `evt:{name}` with zeroed metrics (same pattern as CTA).
 */
export async function trackHabitEvent(event: HabitEventName): Promise<void> {
  await trackQuizAttempt({
    quizId: habitEventQuizId(event),
    percentage: 0,
    correctCount: 0,
    totalQuestions: 1,
    timeTakenSeconds: 0,
  });
}

export async function fetchQuizStats(
  quizId?: string
): Promise<QuizStats | QuizStats[] | null> {
  if (!isRemoteScoresEnabled()) return quizId ? null : [];
  try {
    const url = new URL('/api/analytics', window.location.origin);
    if (quizId) url.searchParams.set('quizId', quizId);
    const res = await fetch(url.toString());
    if (!res.ok) return quizId ? null : [];
    const data = (await res.json()) as { stats: QuizStats | QuizStats[] | null };
    return data.stats ?? (quizId ? null : []);
  } catch {
    return quizId ? null : [];
  }
}
