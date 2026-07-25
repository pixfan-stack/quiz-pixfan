import type { Difficulty, LocalizedString, Question, Quiz } from '../types/quiz';

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];

/** Derive a quiz-level difficulty from its questions (majority vote, default medium). */
export function deriveQuizDifficulty(quiz: Quiz): Difficulty {
  if (quiz.difficulty) return quiz.difficulty;

  const counts: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
  for (const q of quiz.questions) {
    counts[q.difficulty ?? 'medium'] += 1;
  }

  let best: Difficulty = 'medium';
  let bestCount = -1;
  for (const level of DIFFICULTY_ORDER) {
    if (counts[level] > bestCount) {
      best = level;
      bestCount = counts[level];
    }
  }
  return best;
}

export function filterQuizzesByDifficulty(
  quizzes: Quiz[],
  filter: Difficulty | 'all'
): Quiz[] {
  if (filter === 'all') return quizzes;
  return quizzes.filter((quiz) => deriveQuizDifficulty(quiz) === filter);
}

/** Build a practice pack from one difficulty across categories. */
export function buildDifficultyMix(
  quizzes: Quiz[],
  difficulty: Difficulty,
  count = 20
): Quiz {
  const pool: Question[] = [];
  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      const level = q.difficulty ?? deriveQuizDifficulty(quiz);
      if (level !== difficulty) continue;
      pool.push({
        ...q,
        id: `${quiz.id}__${q.id}`,
      });
    }
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const titles: Record<Difficulty, LocalizedString> = {
    easy: { en: 'Easy mix', fr: 'Mix facile' },
    medium: { en: 'Medium mix', fr: 'Mix intermédiaire' },
    hard: { en: 'Hard mix', fr: 'Mix difficile' },
  };
  const descriptions: Record<Difficulty, LocalizedString> = {
    easy: {
      en: 'A lighter pack to build confidence.',
      fr: 'Un pack plus accessible pour prendre confiance.',
    },
    medium: {
      en: 'A balanced pack across categories.',
      fr: 'Un pack équilibré entre les catégories.',
    },
    hard: {
      en: 'A tougher pack for experienced photographers.',
      fr: 'Un pack plus exigeant pour photographes expérimentés.',
    },
  };

  return {
    id: `mix-${difficulty}`,
    title: titles[difficulty],
    description: descriptions[difficulty],
    difficulty,
    questions: shuffled.slice(0, Math.min(count, shuffled.length)),
  };
}

export function isDifficultyMixId(quizId: string): boolean {
  return /^mix-(easy|medium|hard)$/.test(quizId);
}

export function parseDifficultyMixId(quizId: string): Difficulty | null {
  const match = quizId.match(/^mix-(easy|medium|hard)$/);
  return match ? (match[1] as Difficulty) : null;
}
