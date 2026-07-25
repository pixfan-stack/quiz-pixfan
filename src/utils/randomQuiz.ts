import type { Question, Quiz } from '../types/quiz';

export const RANDOM_QUIZ_ID = 'random-mix';

const DEFAULT_POOL_SIZE = 20;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Pick questions from all categories for a mixed quiz. */
export function buildRandomQuiz(quizzes: Quiz[], count = DEFAULT_POOL_SIZE): Quiz {
  const pool: Question[] = [];
  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      pool.push({
        ...q,
        id: `${quiz.id}__${q.id}`,
      });
    }
  }

  const picked = shuffle(pool).slice(0, Math.min(count, pool.length));

  return {
    id: RANDOM_QUIZ_ID,
    title: {
      en: 'Random mix',
      fr: 'Mix aléatoire',
    },
    description: {
      en: 'Questions drawn from every category.',
      fr: 'Questions tirées de toutes les catégories.',
    },
    questions: picked,
  };
}
