import type { Difficulty, Quiz } from '../types/quiz';
import { deriveQuizDifficulty } from './difficulty';
import { quizHasScolairesTag } from './scolaires';

/** Home pack list filter — difficulty levels + scolaires curation. */
export type PackFilter = Difficulty | 'all' | 'scolaires';

export function filterQuizzesByPackFilter(
  quizzes: Quiz[],
  filter: PackFilter
): Quiz[] {
  if (filter === 'all') return quizzes;
  if (filter === 'scolaires') {
    return quizzes.filter(quizHasScolairesTag);
  }
  return quizzes.filter((quiz) => deriveQuizDifficulty(quiz) === filter);
}
