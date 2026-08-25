import { describe, it, expect, beforeEach } from 'vitest';
import type { Quiz } from '../types/quiz';
import {
  buildWeakSpotsQuiz,
  clearMistakeVault,
  getMistakeVaultCount,
  recordMistakes,
  resolveCorrectAnswers,
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

  it('clears vault entries when answered correctly (raw and compound ids)', () => {
    const q1 = sample[0]!.questions[0]!;
    const q2 = sample[0]!.questions[1]!;
    recordMistakes([
      {
        question: { ...q1, id: 'cat-a__q1' },
        selectedIds: [],
        wasCorrect: false,
      },
      {
        question: q2,
        selectedIds: [],
        wasCorrect: false,
      },
    ]);
    expect(getMistakeVaultCount()).toBe(2);

    const cleared = resolveCorrectAnswers([
      {
        question: q1, // raw id should match compound vault entry
        selectedIds: ['a'],
        wasCorrect: true,
      },
      {
        question: { ...q2, id: 'cat-a__q2' },
        selectedIds: [],
        wasCorrect: false,
      },
    ]);
    expect(cleared).toBe(1);
    expect(getMistakeVaultCount()).toBe(1);

    const cleared2 = resolveCorrectAnswers([
      {
        question: { ...q2, id: 'cat-a__q2' },
        selectedIds: ['a'],
        wasCorrect: true,
      },
    ]);
    expect(cleared2).toBe(1);
    expect(getMistakeVaultCount()).toBe(0);
  });
});
