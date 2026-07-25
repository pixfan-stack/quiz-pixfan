import { describe, it, expect } from 'vitest';
import { buildRandomQuiz, RANDOM_QUIZ_ID } from '../utils/randomQuiz';
import type { Quiz } from '../types/quiz';

const miniQuizzes: Quiz[] = [
  {
    id: 'a',
    title: { en: 'A', fr: 'A' },
    description: { en: '', fr: '' },
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: { en: 'Q', fr: 'Q' },
        answers: [{ id: 'x', text: { en: 'X', fr: 'X' } }],
        correctAnswers: ['x'],
      },
    ],
  },
  {
    id: 'b',
    title: { en: 'B', fr: 'B' },
    description: { en: '', fr: '' },
    questions: [
      {
        id: 'q2',
        type: 'single',
        text: { en: 'Q2', fr: 'Q2' },
        answers: [{ id: 'y', text: { en: 'Y', fr: 'Y' } }],
        correctAnswers: ['y'],
      },
    ],
  },
];

describe('buildRandomQuiz', () => {
  it('uses random-mix id and requested question count', () => {
    const quiz = buildRandomQuiz(miniQuizzes, 2);
    expect(quiz.id).toBe(RANDOM_QUIZ_ID);
    expect(quiz.questions).toHaveLength(2);
  });

  it('prefixes question ids with source quiz id', () => {
    const quiz = buildRandomQuiz(miniQuizzes, 2);
    for (const q of quiz.questions) {
      expect(q.id).toMatch(/^(a|b)__/);
    }
  });
});
