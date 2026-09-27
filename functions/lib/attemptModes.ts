/**
 * Admin analytics play-mode buckets for quiz_attempts.quiz_id.
 * Keep in sync with `src/utils/habitAnalytics.classifyAttemptMode`.
 */

export const ATTEMPT_MODES = [
  'photo-reading',
  'daily',
  'duel',
  'weak-spots',
  'mix',
  'random',
  'packs',
] as const;

export type AttemptMode = (typeof ATTEMPT_MODES)[number];

const DIFFICULTY_MIX_RE = /^mix-(easy|medium|hard)$/;
const RANDOM_QUIZ_ID = 'random-mix';

/** Classify a real quiz_id (not cta:/evt:) into an admin mode bucket. */
export function classifyAttemptMode(quizId: string): AttemptMode {
  if (quizId === 'photo-reading') return 'photo-reading';
  if (quizId === 'weak-spots') return 'weak-spots';
  if (quizId.startsWith('daily-')) return 'daily';
  if (quizId.startsWith('duel-')) return 'duel';
  if (DIFFICULTY_MIX_RE.test(quizId)) return 'mix';
  if (quizId === RANDOM_QUIZ_ID) return 'random';
  return 'packs';
}

/** Roll up per-quiz attempt rows into mode buckets. */
export function buildModeCounts(
  rawRows: Array<{ quizId: string; attempts: number }>
): Array<{ mode: AttemptMode; attempts: number }> {
  const map = new Map<AttemptMode, number>();
  for (const raw of rawRows) {
    const attempts = Number(raw.attempts) || 0;
    if (attempts <= 0) continue;
    if (raw.quizId.startsWith('cta:') || raw.quizId.startsWith('evt:')) continue;
    const mode = classifyAttemptMode(raw.quizId);
    map.set(mode, (map.get(mode) ?? 0) + attempts);
  }
  return ATTEMPT_MODES.filter((m) => (map.get(m) ?? 0) > 0).map((mode) => ({
    mode,
    attempts: map.get(mode) ?? 0,
  }));
}
