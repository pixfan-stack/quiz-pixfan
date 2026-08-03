import type { Question, Quiz } from '../types/quiz';

export const PHOTO_READING_ID = 'photo-reading';
export const PHOTO_READING_COUNT = 10;

export function isPhotoReadingQuizId(quizId: string): boolean {
  return quizId === PHOTO_READING_ID;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Collect every illustrated question across the catalog. */
export function collectIllustratedQuestions(quizzes: Quiz[]): Question[] {
  const pool: Question[] = [];
  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      if (!q.imageUrl) continue;
      pool.push({
        ...q,
        id: `${quiz.id}__${q.id}`,
      });
    }
  }
  return pool;
}

/**
 * Image-first practice pack: only questions that show a real photo.
 * Fresh shuffle each start (like the random mix).
 */
export function buildPhotoReadingQuiz(
  quizzes: Quiz[],
  count = PHOTO_READING_COUNT
): Quiz | null {
  const pool = collectIllustratedQuestions(quizzes);
  if (pool.length === 0) return null;

  const picked = shuffle(pool).slice(0, Math.min(count, pool.length));

  return {
    id: PHOTO_READING_ID,
    title: {
      en: 'Photos to analyze',
      fr: 'Photos à analyser',
    },
    description: {
      en: '10 illustrated questions — learn by looking.',
      fr: '10 questions illustrées — apprendre en regardant.',
    },
    questions: picked,
  };
}

/** First illustrated question for the home-card teaser. */
export function getPhotoReadingTeaser(quizzes: Quiz[]): Question | null {
  const pool = collectIllustratedQuestions(quizzes);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)] ?? null;
}
