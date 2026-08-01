import { describe, it, expect } from 'vitest';
import type { Quiz } from '../types/quiz';
import {
  buildPhotoReadingQuiz,
  collectIllustratedQuestions,
  isPhotoReadingQuizId,
  PHOTO_READING_COUNT,
  PHOTO_READING_ID,
} from '../utils/photoReading';

const quizzes: Quiz[] = [
  {
    id: 'a',
    title: { en: 'A', fr: 'A' },
    description: { en: '', fr: '' },
    questions: [
      {
        id: '1',
        type: 'single',
        text: { en: 'Q1', fr: 'Q1' },
        answers: [{ id: 'x', text: { en: 'X', fr: 'X' } }],
        correctAnswers: ['x'],
        imageUrl: '/a1.jpg',
      },
      {
        id: '2',
        type: 'single',
        text: { en: 'Q2', fr: 'Q2' },
        answers: [{ id: 'x', text: { en: 'X', fr: 'X' } }],
        correctAnswers: ['x'],
      },
    ],
  },
  {
    id: 'b',
    title: { en: 'B', fr: 'B' },
    description: { en: '', fr: '' },
    questions: Array.from({ length: 12 }, (_, i) => ({
      id: `b${i}`,
      type: 'single' as const,
      text: { en: `B${i}`, fr: `B${i}` },
      answers: [{ id: 'y', text: { en: 'Y', fr: 'Y' } }],
      correctAnswers: ['y'],
      imageUrl: `/b${i}.jpg`,
    })),
  },
];

describe('photoReading', () => {
  it('recognizes the pack id', () => {
    expect(isPhotoReadingQuizId(PHOTO_READING_ID)).toBe(true);
    expect(isPhotoReadingQuizId('random-mix')).toBe(false);
  });

  it('collects only illustrated questions', () => {
    expect(collectIllustratedQuestions(quizzes)).toHaveLength(13);
  });

  it('builds a 10-question image-only pack', () => {
    const pack = buildPhotoReadingQuiz(quizzes);
    expect(pack).not.toBeNull();
    expect(pack!.id).toBe(PHOTO_READING_ID);
    expect(pack!.questions).toHaveLength(PHOTO_READING_COUNT);
    expect(pack!.questions.every((q) => q.imageUrl)).toBe(true);
  });
});
