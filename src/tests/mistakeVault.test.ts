import { describe, it, expect, beforeEach } from 'vitest';
import type { Quiz } from '../types/quiz';
import {
  buildWeakSpotsQuiz,
  clearMistakeVault,
  getDueMistakeCount,
  getMistakeVault,
  getMistakeVaultCount,
  isMistakeDue,
  mergeMistakeVaultEntries,
  mergeRemoteMistakeVault,
  mistakeReviewScore,
  recordMistakes,
  resolveCorrectAnswers,
  reviewIntervalDays,
  shouldShowWeakSpotsDueChip,
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

  it('merges vaults by questionId with max missCount / newer lastMissedAt', () => {
    const merged = mergeMistakeVaultEntries(
      [
        {
          questionId: 'cat-a__q1',
          sourceQuizId: 'cat-a',
          missCount: 2,
          lastMissedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      [
        {
          questionId: 'cat-a__q1',
          sourceQuizId: 'cat-a',
          missCount: 5,
          lastMissedAt: '2026-02-01T00:00:00.000Z',
        },
        {
          questionId: 'cat-a__q2',
          sourceQuizId: 'cat-a',
          missCount: 1,
          lastMissedAt: '2026-02-01T00:00:00.000Z',
        },
      ]
    );
    expect(merged).toHaveLength(2);
    expect(merged[0]?.questionId).toBe('cat-a__q1');
    expect(merged[0]?.missCount).toBe(5);
    expect(merged[0]?.lastMissedAt).toBe('2026-02-01T00:00:00.000Z');
    expect(merged[1]?.questionId).toBe('cat-a__q2');
  });

  it('mergeRemoteMistakeVault unions into localStorage', () => {
    recordMistakes([
      {
        question: { ...sample[0]!.questions[0]!, id: 'cat-a__q1' },
        selectedIds: [],
        wasCorrect: false,
      },
    ]);
    mergeRemoteMistakeVault([
      {
        questionId: 'cat-a__q2',
        sourceQuizId: 'cat-a',
        missCount: 3,
        lastMissedAt: '2026-03-01T00:00:00.000Z',
      },
    ]);
    expect(getMistakeVaultCount()).toBe(2);
    expect(getMistakeVault().some((e) => e.questionId === 'cat-a__q2')).toBe(
      true
    );
  });

  it('uses light SRS intervals 1d / 3d / 7d from missCount', () => {
    expect(reviewIntervalDays({ missCount: 1 })).toBe(7);
    expect(reviewIntervalDays({ missCount: 2 })).toBe(3);
    expect(reviewIntervalDays({ missCount: 3 })).toBe(1);
    expect(reviewIntervalDays({ missCount: 9 })).toBe(1);
  });

  it('marks entries due by lastMissedAt + interval', () => {
    const now = Date.parse('2026-09-23T12:00:00.000Z');
    const fresh = {
      questionId: 'a',
      sourceQuizId: 'cat-a',
      missCount: 1,
      lastMissedAt: '2026-09-23T11:00:00.000Z',
    };
    const due = {
      questionId: 'b',
      sourceQuizId: 'cat-a',
      missCount: 1,
      lastMissedAt: '2026-09-01T12:00:00.000Z',
    };
    expect(isMistakeDue(fresh, now)).toBe(false);
    expect(isMistakeDue(due, now)).toBe(true);
    expect(mistakeReviewScore(due, now)).toBeGreaterThan(
      mistakeReviewScore(fresh, now)
    );
  });

  it('prioritizes due vault entries in weak-spots pack', () => {
    const now = Date.parse('2026-09-23T12:00:00.000Z');
    // Seed storage directly with timed entries
    localStorage.setItem(
      'quiz-pixfan-mistake-vault',
      JSON.stringify([
        {
          questionId: 'cat-a__q1',
          sourceQuizId: 'cat-a',
          missCount: 1,
          lastMissedAt: '2026-09-23T11:00:00.000Z', // not due (7d)
        },
        {
          questionId: 'cat-a__q2',
          sourceQuizId: 'cat-a',
          missCount: 1,
          lastMissedAt: '2026-09-01T12:00:00.000Z', // due
        },
      ])
    );
    expect(getDueMistakeCount(now)).toBe(1);
    const pack = buildWeakSpotsQuiz(sample, 10, now);
    expect(pack?.questions[0]?.id).toBe('cat-a__q2');
  });

  it('shows home due chip at ≥3 dues', () => {
    const now = Date.parse('2026-09-23T12:00:00.000Z');
    const old = '2026-09-01T12:00:00.000Z';
    localStorage.setItem(
      'quiz-pixfan-mistake-vault',
      JSON.stringify([
        {
          questionId: 'a',
          sourceQuizId: 'x',
          missCount: 1,
          lastMissedAt: old,
        },
        {
          questionId: 'b',
          sourceQuizId: 'x',
          missCount: 1,
          lastMissedAt: old,
        },
      ])
    );
    expect(shouldShowWeakSpotsDueChip(now)).toBe(false);
    localStorage.setItem(
      'quiz-pixfan-mistake-vault',
      JSON.stringify([
        {
          questionId: 'a',
          sourceQuizId: 'x',
          missCount: 1,
          lastMissedAt: old,
        },
        {
          questionId: 'b',
          sourceQuizId: 'x',
          missCount: 1,
          lastMissedAt: old,
        },
        {
          questionId: 'c',
          sourceQuizId: 'x',
          missCount: 1,
          lastMissedAt: old,
        },
      ])
    );
    expect(shouldShowWeakSpotsDueChip(now)).toBe(true);
  });
});
