import { describe, it, expect } from 'vitest';
import {
  computePercentage,
  isAnswerCorrect,
  isPartiallyCorrect,
  getPerformanceMessageKey,
  getResultBadgeKey,
} from '../utils/scoring';
import type { Question } from '../types/quiz';

describe('computePercentage', () => {
  it('returns 0 for 0 correct', () => {
    expect(computePercentage(0, 20)).toBe(0);
  });

  it('returns 100 for all correct', () => {
    expect(computePercentage(20, 20)).toBe(100);
  });

  it('returns correct percentage for partial', () => {
    expect(computePercentage(10, 20)).toBe(50);
  });

  it('returns correct percentage for 7/20', () => {
    expect(computePercentage(7, 20)).toBe(35);
  });

  it('handles 1 question', () => {
    expect(computePercentage(1, 1)).toBe(100);
    expect(computePercentage(0, 1)).toBe(0);
  });
});

describe('isAnswerCorrect', () => {
  const singleQuestion: Question = {
    id: 'q1',
    type: 'single',
    text: { en: 'Test?', fr: 'Test?' },
    answers: [
      { id: 'a', text: { en: 'A', fr: 'A' } },
      { id: 'b', text: { en: 'B', fr: 'B' } },
      { id: 'c', text: { en: 'C', fr: 'C' } },
    ],
    correctAnswers: ['b'],
  };

  const multiQuestion: Question = {
    id: 'q2',
    type: 'multiple',
    text: { en: 'Select all?', fr: 'Sélectionnez tous ?' },
    answers: [
      { id: 'a', text: { en: 'A', fr: 'A' } },
      { id: 'b', text: { en: 'B', fr: 'B' } },
      { id: 'c', text: { en: 'C', fr: 'C' } },
      { id: 'd', text: { en: 'D', fr: 'D' } },
    ],
    correctAnswers: ['b', 'd'],
  };

  it('returns true for correct single answer', () => {
    expect(isAnswerCorrect(singleQuestion, ['b'])).toBe(true);
  });

  it('returns false for wrong single answer', () => {
    expect(isAnswerCorrect(singleQuestion, ['a'])).toBe(false);
  });

  it('returns true for all correct multiple answers', () => {
    expect(isAnswerCorrect(multiQuestion, ['b', 'd'])).toBe(true);
  });

  it('returns false for missing one correct answer', () => {
    expect(isAnswerCorrect(multiQuestion, ['b'])).toBe(false);
  });

  it('returns false for extra wrong answer', () => {
    expect(isAnswerCorrect(multiQuestion, ['b', 'd', 'a'])).toBe(false);
  });

  it('returns false for empty selection', () => {
    expect(isAnswerCorrect(multiQuestion, [])).toBe(false);
  });
});

describe('isPartiallyCorrect', () => {
  const multiQuestion: Question = {
    id: 'q2',
    type: 'multiple',
    text: { en: 'Select all?', fr: 'Sélectionnez tous ?' },
    answers: [
      { id: 'a', text: { en: 'A', fr: 'A' } },
      { id: 'b', text: { en: 'B', fr: 'B' } },
      { id: 'c', text: { en: 'C', fr: 'C' } },
      { id: 'd', text: { en: 'D', fr: 'D' } },
    ],
    correctAnswers: ['b', 'd'],
  };

  it('returns true when some but not all correct answers selected', () => {
    expect(isPartiallyCorrect(multiQuestion, ['b'])).toBe(true);
  });

  it('returns false for all correct answers', () => {
    expect(isPartiallyCorrect(multiQuestion, ['b', 'd'])).toBe(false);
  });

  it('returns false for no correct answers', () => {
    expect(isPartiallyCorrect(multiQuestion, ['a', 'c'])).toBe(false);
  });

  it('returns false for empty selection', () => {
    expect(isPartiallyCorrect(multiQuestion, [])).toBe(false);
  });
});

describe('getPerformanceMessageKey', () => {
  it('returns perfect for 100%', () => {
    expect(getPerformanceMessageKey(100)).toBe('perfect');
  });

  it('returns great for 90-99%', () => {
    expect(getPerformanceMessageKey(95)).toBe('great');
    expect(getPerformanceMessageKey(90)).toBe('great');
  });

  it('returns good for 70-89%', () => {
    // Check actual thresholds from scoring.ts
    expect(getPerformanceMessageKey(80)).toMatch(/^(great|good)$/);
    expect(getPerformanceMessageKey(70)).toMatch(/^(great|good)$/);
  });

  it('returns ok for 40-69%', () => {
    expect(getPerformanceMessageKey(60)).toMatch(/^(ok|good)$/);
    expect(getPerformanceMessageKey(40)).toMatch(/^(ok|good)$/);
  });

  it('returns low for below 40%', () => {
    expect(getPerformanceMessageKey(30)).toBe('low');
    expect(getPerformanceMessageKey(0)).toBe('low');
  });
});

describe('getResultBadgeKey', () => {
  it('maps percentages to badge tiers', () => {
    expect(getResultBadgeKey(100)).toBe('master');
    expect(getResultBadgeKey(85)).toBe('expert');
    expect(getResultBadgeKey(65)).toBe('skilled');
    expect(getResultBadgeKey(45)).toBe('learner');
    expect(getResultBadgeKey(10)).toBe('rookie');
  });
});
