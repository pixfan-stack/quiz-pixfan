import { beforeEach, describe, expect, it } from 'vitest';
import {
  getPhotoReadingPlayCount,
  getUnlockedAchievements,
  getVaultResolvedTotal,
  PHOTO_READER_THRESHOLD,
  unlockAchievements,
  VAULT_CLEAR_THRESHOLD,
} from '../utils/achievements';
import { PHOTO_READING_ID } from '../utils/photoReading';
import { RANDOM_QUIZ_ID } from '../utils/randomQuiz';

const emptyStreak = {
  lastDailyId: null,
  currentStreak: 0,
  bestStreak: 0,
  freezesAvailable: 1,
  freezeWeekKey: null,
};

describe('achievements', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('unlocks first-finish and duelist', () => {
    const newly = unlockAchievements({
      quizId: 'duel-abcd2345',
      percentage: 70,
      categoryQuizIds: ['a', 'b'],
      highscores: {},
      streak: emptyStreak,
    });
    expect(newly).toContain('first-finish');
    expect(newly).toContain('duelist');
    expect(getUnlockedAchievements().has('duelist')).toBe(true);
  });

  it('unlocks perfect and random-perfect together', () => {
    const newly = unlockAchievements({
      quizId: RANDOM_QUIZ_ID,
      percentage: 100,
      categoryQuizIds: [],
      highscores: {},
      streak: emptyStreak,
    });
    expect(newly).toEqual(
      expect.arrayContaining(['first-finish', 'perfect', 'random-perfect'])
    );
  });

  it('unlocks expert-trio from highscores', () => {
    unlockAchievements({
      quizId: 'c',
      percentage: 85,
      categoryQuizIds: ['a', 'b', 'c'],
      highscores: {
        a: {
          quizId: 'a',
          percentage: 90,
          correctCount: 18,
          totalQuestions: 20,
          updatedAt: 'x',
        },
        b: {
          quizId: 'b',
          percentage: 80,
          correctCount: 16,
          totalQuestions: 20,
          updatedAt: 'x',
        },
        c: {
          quizId: 'c',
          percentage: 85,
          correctCount: 17,
          totalQuestions: 20,
          updatedAt: 'x',
        },
      },
      streak: emptyStreak,
    });
    expect(getUnlockedAchievements().has('expert-trio')).toBe(true);
  });

  it('does not re-unlock already earned achievements', () => {
    unlockAchievements({
      quizId: 'x',
      percentage: 50,
      categoryQuizIds: [],
      highscores: {},
      streak: emptyStreak,
    });
    const second = unlockAchievements({
      quizId: 'y',
      percentage: 50,
      categoryQuizIds: [],
      highscores: {},
      streak: emptyStreak,
    });
    expect(second).toEqual([]);
  });

  it('unlocks photo-reader after 3 photo-reading finishes', () => {
    for (let i = 0; i < PHOTO_READER_THRESHOLD - 1; i++) {
      const newly = unlockAchievements({
        quizId: PHOTO_READING_ID,
        percentage: 60,
        categoryQuizIds: [],
        highscores: {},
        streak: emptyStreak,
      });
      expect(newly).not.toContain('photo-reader');
    }
    expect(getPhotoReadingPlayCount()).toBe(PHOTO_READER_THRESHOLD - 1);
    const last = unlockAchievements({
      quizId: PHOTO_READING_ID,
      percentage: 60,
      categoryQuizIds: [],
      highscores: {},
      streak: emptyStreak,
    });
    expect(last).toContain('photo-reader');
    expect(getPhotoReadingPlayCount()).toBe(PHOTO_READER_THRESHOLD);
  });

  it('unlocks vault-clear after enough resolutions', () => {
    const first = unlockAchievements({
      quizId: 'weak-spots',
      percentage: 80,
      categoryQuizIds: [],
      highscores: {},
      streak: emptyStreak,
      vaultClearedThisRun: VAULT_CLEAR_THRESHOLD - 1,
    });
    expect(first).not.toContain('vault-clear');
    expect(getVaultResolvedTotal()).toBe(VAULT_CLEAR_THRESHOLD - 1);
    const second = unlockAchievements({
      quizId: 'weak-spots',
      percentage: 90,
      categoryQuizIds: [],
      highscores: {},
      streak: emptyStreak,
      vaultClearedThisRun: 1,
    });
    expect(second).toContain('vault-clear');
    expect(getVaultResolvedTotal()).toBe(VAULT_CLEAR_THRESHOLD);
  });

  it('unlocks streak-14 from best streak', () => {
    const newly = unlockAchievements({
      quizId: 'daily-2026-09-23',
      percentage: 70,
      categoryQuizIds: [],
      highscores: {},
      streak: {
        ...emptyStreak,
        currentStreak: 14,
        bestStreak: 14,
      },
    });
    expect(newly).toEqual(
      expect.arrayContaining(['daily-first', 'streak-3', 'streak-7', 'streak-14'])
    );
  });
});
