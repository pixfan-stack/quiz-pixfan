import { describe, it, expect } from 'vitest';
import {
  buildDailyQuiz,
  DAILY_IMAGE_TARGET,
  DAILY_QUESTION_COUNT,
  formatDailyCountdown,
  getDailyPhotoTeaser,
  getDailyQuizId,
  isDailyQuizId,
  msUntilNextDaily,
  pickDailyQuestions,
} from '../utils/dailyChallenge';
import type { Question, Quiz } from '../types/quiz';
import { seededRandom } from '../utils/seededRandom';

const miniQuizzes: Quiz[] = [
  {
    id: 'a',
    title: { en: 'A', fr: 'A' },
    description: { en: '', fr: '' },
    questions: Array.from({ length: 8 }, (_, i) => ({
      id: `aq${i}`,
      type: 'single' as const,
      text: { en: `Q${i}`, fr: `Q${i}` },
      answers: [{ id: 'x', text: { en: 'X', fr: 'X' } }],
      correctAnswers: ['x'],
      ...(i < 5 ? { imageUrl: `/img/a${i}.jpg` } : {}),
    })),
  },
  {
    id: 'b',
    title: { en: 'B', fr: 'B' },
    description: { en: '', fr: '' },
    questions: Array.from({ length: 8 }, (_, i) => ({
      id: `bq${i}`,
      type: 'single' as const,
      text: { en: `B${i}`, fr: `B${i}` },
      answers: [{ id: 'y', text: { en: 'Y', fr: 'Y' } }],
      correctAnswers: ['y'],
    })),
  },
];

describe('dailyChallenge', () => {
  it('builds a stable id for a UTC day', () => {
    const id = getDailyQuizId(new Date('2026-07-25T15:00:00Z'));
    expect(id).toBe('daily-2026-07-25');
    expect(isDailyQuizId(id)).toBe(true);
    expect(isDailyQuizId('random-mix')).toBe(false);
  });

  it('returns the same questions for the same day', () => {
    const date = new Date('2026-07-25T12:00:00Z');
    const a = buildDailyQuiz(miniQuizzes, date);
    const b = buildDailyQuiz(miniQuizzes, date);
    expect(a.id).toBe(b.id);
    expect(a.questions.map((q) => q.id)).toEqual(b.questions.map((q) => q.id));
    expect(a.questions).toHaveLength(DAILY_QUESTION_COUNT);
  });

  it('can differ across days', () => {
    const a = buildDailyQuiz(miniQuizzes, new Date('2026-07-25T12:00:00Z'));
    const b = buildDailyQuiz(miniQuizzes, new Date('2026-07-26T12:00:00Z'));
    expect(a.id).not.toBe(b.id);
  });

  it('counts down to next UTC day', () => {
    const now = new Date('2026-07-25T22:30:00Z');
    const ms = msUntilNextDaily(now);
    expect(ms).toBe(90 * 60 * 1000);
    expect(formatDailyCountdown(ms, 'en')).toMatch(/1h/);
    expect(formatDailyCountdown(ms, 'fr')).toMatch(/1 h/);
  });

  it('prefers illustrated questions up to the image target', () => {
    const pool: Question[] = [
      ...Array.from({ length: 6 }, (_, i) => ({
        id: `img${i}`,
        type: 'single' as const,
        text: { en: `I${i}`, fr: `I${i}` },
        answers: [{ id: 'x', text: { en: 'X', fr: 'X' } }],
        correctAnswers: ['x'],
        imageUrl: `/i${i}.jpg`,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `txt${i}`,
        type: 'single' as const,
        text: { en: `T${i}`, fr: `T${i}` },
        answers: [{ id: 'x', text: { en: 'X', fr: 'X' } }],
        correctAnswers: ['x'],
      })),
    ];
    const picked = pickDailyQuestions(pool, seededRandom(42));
    const withImage = picked.filter((q) => q.imageUrl);
    expect(withImage).toHaveLength(DAILY_IMAGE_TARGET);
    expect(picked).toHaveLength(DAILY_QUESTION_COUNT);
  });

  it('exposes a photo teaser from the daily pack', () => {
    const teaser = getDailyPhotoTeaser(
      miniQuizzes,
      new Date('2026-07-25T12:00:00Z')
    );
    expect(teaser?.imageUrl).toBeTruthy();
  });
});
