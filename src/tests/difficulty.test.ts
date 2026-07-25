import { describe, it, expect } from 'vitest';
import type { Quiz } from '../types/quiz';
import {
  buildDifficultyMix,
  deriveQuizDifficulty,
  filterQuizzesByDifficulty,
  isDifficultyMixId,
  parseDifficultyMixId,
} from '../utils/difficulty';

function makeQuiz(
  id: string,
  difficulty: 'easy' | 'medium' | 'hard',
  questionDiffs: Array<'easy' | 'medium' | 'hard'>
): Quiz {
  return {
    id,
    title: { en: id, fr: id },
    description: { en: '', fr: '' },
    difficulty,
    questions: questionDiffs.map((level, index) => ({
      id: `${id}-q${index}`,
      type: 'single' as const,
      text: { en: 'Q', fr: 'Q' },
      answers: [{ id: 'a', text: { en: 'A', fr: 'A' } }],
      correctAnswers: ['a'],
      difficulty: level,
    })),
  };
}

const sample: Quiz[] = [
  makeQuiz('easy-a', 'easy', ['easy', 'easy']),
  makeQuiz('med-a', 'medium', ['medium', 'medium']),
  makeQuiz('hard-a', 'hard', ['hard', 'hard']),
];

describe('difficulty utils', () => {
  it('uses quiz.difficulty when present', () => {
    expect(deriveQuizDifficulty(sample[0])).toBe('easy');
  });

  it('filters quizzes by difficulty', () => {
    expect(filterQuizzesByDifficulty(sample, 'all')).toHaveLength(3);
    expect(filterQuizzesByDifficulty(sample, 'medium').map((q) => q.id)).toEqual(['med-a']);
  });

  it('builds a difficulty mix with namespaced ids', () => {
    const mix = buildDifficultyMix(sample, 'easy', 10);
    expect(mix.id).toBe('mix-easy');
    expect(mix.difficulty).toBe('easy');
    expect(mix.questions.length).toBe(2);
    expect(mix.questions.every((q) => q.id.startsWith('easy-a__'))).toBe(true);
  });

  it('parses mix ids', () => {
    expect(isDifficultyMixId('mix-hard')).toBe(true);
    expect(isDifficultyMixId('random')).toBe(false);
    expect(parseDifficultyMixId('mix-medium')).toBe('medium');
    expect(parseDifficultyMixId('exposure-basics')).toBeNull();
  });
});
