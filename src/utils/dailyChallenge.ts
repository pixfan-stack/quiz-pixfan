import type { Question, Quiz } from '../types/quiz';
import { hashSeed, seededRandom, seededShuffle } from './seededRandom';

export const DAILY_QUESTION_COUNT = 10;

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

/** Same 10 questions for every player on a given UTC day. */
export function buildDailyQuiz(quizzes: Quiz[], date = new Date()): Quiz {
  const quizId = getDailyQuizId(date);
  const rand = seededRandom(hashSeed(quizId));
  const pool: Question[] = [];

  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      pool.push({
        ...q,
        id: `${quiz.id}__${q.id}`,
      });
    }
  }

  const picked = seededShuffle(pool, rand).slice(
    0,
    Math.min(DAILY_QUESTION_COUNT, pool.length)
  );

  return {
    id: quizId,
    title: {
      en: 'Daily challenge',
      fr: 'Défi du jour',
    },
    description: {
      en: '10 questions shared by everyone today. Beat today’s pack!',
      fr: '10 questions communes à tous aujourd’hui. Battez le pack du jour !',
    },
    questions: picked,
  };
}
