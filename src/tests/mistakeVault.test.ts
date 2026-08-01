import { describe, it, expect, beforeEach } from 'vitest';
import type { Quiz } from '../types/quiz';
import {
  buildWeakSpotsQuiz,
  clearMistakeVault,
  getMistakeVaultCount,
  recordMistakes,
  WEAK_SPOTS_QUIZ_ID,
} from '../utils/mistakeVault';

const sample: Quiz[] = [
  {
    id: 'cat-a',
    title: { en: 'A', fr: 'A' },
    description: { en: '', fr: '' },
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: { en: 'Q1', fr: 'Q1' },
        answers: [{ id: 'a', text: { en: 'A', fr: 'A' } }],
        correctAnswers: ['a'],
      },
      {
        id: 'q2',
        type: 'single',
        text: { en: 'Q2', fr: 'Q2' },
        answers: [{ id: 'a', text: { en: 'A', fr: 'A' } }],
        correctAnswers: ['a'],
      },
    ],
  },
];

describe('mistakeVault', () => {
  beforeEach(() => {
    clearMistakeVault();
  });

  it('records mistakes and builds a weak-spots pack', () => {
    const q = sample[0]!.questions[0]!;
    const n = recordMistakes([
      {
        question: { ...q, id: 'cat-a__q1' },
        selectedIds: [],
        wasCorrect: false,
      },
    ]);
    expect(n).toBe(1);
    expect(getMistakeVaultCount()).toBe(1);

    const pack = buildWeakSpotsQuiz(sample, 10);
    expect(pack?.id).toBe(WEAK_SPOTS_QUIZ_ID);
    expect(pack?.questions).toHaveLength(1);
    expect(pack?.questions[0]?.id).toBe('cat-a__q1');
  });

  it('returns null when vault is empty', () => {
    expect(buildWeakSpotsQuiz(sample)).toBeNull();
  });
});
