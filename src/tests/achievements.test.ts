import { beforeEach, describe, expect, it } from 'vitest';
import {
  getUnlockedAchievements,
  unlockAchievements,
} from '../utils/achievements';
import { RANDOM_QUIZ_ID } from '../utils/randomQuiz';

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
      streak: { lastDailyId: null, currentStreak: 0, bestStreak: 0 },
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
      streak: { lastDailyId: null, currentStreak: 0, bestStreak: 0 },
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
      streak: { lastDailyId: null, currentStreak: 0, bestStreak: 0 },
    });
    expect(getUnlockedAchievements().has('expert-trio')).toBe(true);
  });

  it('does not re-unlock already earned achievements', () => {
    unlockAchievements({
      quizId: 'x',
      percentage: 50,
      categoryQuizIds: [],
      highscores: {},
      streak: { lastDailyId: null, currentStreak: 0, bestStreak: 0 },
    });
    const second = unlockAchievements({
      quizId: 'y',
      percentage: 50,
      categoryQuizIds: [],
      highscores: {},
      streak: { lastDailyId: null, currentStreak: 0, bestStreak: 0 },
    });
    expect(second).toEqual([]);
  });
});
