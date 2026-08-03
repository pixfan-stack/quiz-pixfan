import type { Question, Quiz } from '../types/quiz';
import { hashSeed, seededRandom, seededShuffle } from './seededRandom';

export const DAILY_QUESTION_COUNT = 10;
/** Prefer this many illustrated questions in the daily pack when available. */
export const DAILY_IMAGE_TARGET = 4;

/** UTC calendar day id, e.g. daily-2026-07-25 */
export function getDailyQuizId(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `daily-${y}-${m}-${d}`;
}

export function isDailyQuizId(quizId: string): boolean {
  return /^daily-\d{4}-\d{2}-\d{2}$/.test(quizId);
}

/** Milliseconds until the next UTC midnight (next daily pack). */
export function msUntilNextDaily(now = new Date()): number {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
    0
  );
  return Math.max(0, next - now.getTime());
}

/** Compact countdown like `5h 12m` / `12m 05s`. */
export function formatDailyCountdown(ms: number, lang: 'en' | 'fr' = 'en'): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return lang === 'fr' ? `${h} h ${m} min` : `${h}h ${m}m`;
  }
  return lang === 'fr'
    ? `${m} min ${String(s).padStart(2, '0')} s`
    : `${m}m ${String(s).padStart(2, '0')}s`;
}

function flattenPool(quizzes: Quiz[]): Question[] {
  const pool: Question[] = [];
  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      pool.push({
        ...q,
        id: `${quiz.id}__${q.id}`,
      });
    }
  }
  return pool;
}

/**
 * Deterministic pick: fill with illustrated questions first (seeded),
 * then complete with the rest of the pool.
 */
export function pickDailyQuestions(
  pool: Question[],
  rand: () => number,
  count = DAILY_QUESTION_COUNT,
  imageTarget = DAILY_IMAGE_TARGET
): Question[] {
  const withImage = seededShuffle(
    pool.filter((q) => Boolean(q.imageUrl)),
    rand
  );
  const withoutImage = seededShuffle(
    pool.filter((q) => !q.imageUrl),
    rand
  );

  const imageTake = Math.min(imageTarget, withImage.length, count);
  const picked = withImage.slice(0, imageTake);
  const pickedIds = new Set(picked.map((q) => q.id));

  // Prefer non-illustrated fillers so the pack stays near `imageTarget` photos.
  for (const q of [...withoutImage, ...withImage.slice(imageTake)]) {
    if (picked.length >= count) break;
    if (pickedIds.has(q.id)) continue;
    picked.push(q);
    pickedIds.add(q.id);
  }

  return seededShuffle(picked, rand);
}

/** First illustrated question in today's pack — for home teaser. */
export function getDailyPhotoTeaser(
  quizzes: Quiz[],
  date = new Date()
): Question | null {
  const daily = buildDailyQuiz(quizzes, date);
  return daily.questions.find((q) => Boolean(q.imageUrl)) ?? null;
}

/** Same 10 questions for every player on a given UTC day (image-biased). */
export function buildDailyQuiz(quizzes: Quiz[], date = new Date()): Quiz {
  const quizId = getDailyQuizId(date);
  const rand = seededRandom(hashSeed(quizId));
  const pool = flattenPool(quizzes);
  const picked = pickDailyQuestions(pool, rand);

  return {
    id: quizId,
    title: {
      en: 'Daily challenge',
      fr: 'Défi du jour',
    },
    description: {
      en: '10 shared questions today, often with a photo to analyze.',
      fr: '10 questions partagées aujourd’hui, souvent avec une photo à analyser.',
    },
    questions: picked,
  };
}
