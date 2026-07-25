import { isRemoteScoresEnabled } from './remoteScores';

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
