import { describe, it, expect } from 'vitest';
import type { Quiz } from '../types/quiz';
import {
  buildDuelQuiz,
  createDuelSeed,
  duelQuizId,
  isDuelQuizId,
  parseDuelSeed,
} from '../utils/duel';

const sample: Quiz[] = [
  {
    id: 'cat-a',
    title: { en: 'A', fr: 'A' },
    description: { en: '', fr: '' },
    questions: Array.from({ length: 5 }, (_, i) => ({
      id: `q${i}`,
      type: 'single' as const,
      text: { en: `Q${i}`, fr: `Q${i}` },
      answers: [{ id: 'a', text: { en: 'A', fr: 'A' } }],
      correctAnswers: ['a'],
    })),
  },
  {
    id: 'cat-b',
    title: { en: 'B', fr: 'B' },
    description: { en: '', fr: '' },
    questions: Array.from({ length: 5 }, (_, i) => ({
      id: `q${i}`,
      type: 'single' as const,
      text: { en: `Q${i}`, fr: `Q${i}` },
      answers: [{ id: 'a', text: { en: 'A', fr: 'A' } }],
      correctAnswers: ['a'],
    })),
  },
];

describe('duel', () => {
  it('creates seeds and parses duel ids', () => {
    const seed = createDuelSeed();
    expect(seed).toHaveLength(8);
    expect(isDuelQuizId(duelQuizId(seed))).toBe(true);
    expect(parseDuelSeed(duelQuizId(seed))).toBe(seed);
    expect(isDuelQuizId('random-mix')).toBe(false);
  });

  it('builds the same question set for the same seed', () => {
    const a = buildDuelQuiz(sample, 'abcd2345');
    const b = buildDuelQuiz(sample, 'abcd2345');
    expect(a.id).toBe('duel-abcd2345');
    expect(a.questions.map((q) => q.id)).toEqual(b.questions.map((q) => q.id));
    expect(a.questions).toHaveLength(10);
  });

  it('builds a different set for a different seed', () => {
    const a = buildDuelQuiz(sample, 'abcd2345');
    const b = buildDuelQuiz(sample, 'zzzz9999');
    expect(a.questions.map((q) => q.id)).not.toEqual(b.questions.map((q) => q.id));
  });
});
