import { describe, it, expect, beforeEach } from 'vitest';
import {
  isRecoverHash,
  normalizeRecoveryCode,
  parseRecoveryCodeFromHash,
  recoveryMagicHash,
} from '../utils/recoveryCode';
import { mergeRemoteHighScores, getAllHighScores } from '../utils/highscore';
import {
  mergeUnlockedAchievements,
  getUnlockedAchievements,
} from '../utils/achievements';
import { mergeDailyStreak, getDailyStreak } from '../utils/dailyStreak';
import { setPlayerId, getPlayerId } from '../utils/player';

describe('normalizeRecoveryCode', () => {
  it('accepts dashed uppercase codes', () => {
    expect(normalizeRecoveryCode('ABCD-EFGH-JKMN')).toBe('ABCD-EFGH-JKMN');
  });

  it('normalizes lowercase and spaces', () => {
    expect(normalizeRecoveryCode('abcd efgh jkmn')).toBe('ABCD-EFGH-JKMN');
  });

  it('rejects wrong length or ambiguous alphabet', () => {
    expect(normalizeRecoveryCode('ABC')).toBeNull();
    expect(normalizeRecoveryCode('ABCD-EFGH-IJKL')).toBeNull(); // I not in alphabet
  });
});

describe('recovery magic hash', () => {
  it('builds and parses recover links', () => {
    const hash = recoveryMagicHash('ABCD-EFGH-JKMN');
    expect(hash).toBe('#/recover?c=ABCD-EFGH-JKMN');
    expect(parseRecoveryCodeFromHash(hash)).toBe('ABCD-EFGH-JKMN');
    expect(parseRecoveryCodeFromHash('#/recover/ABCD-EFGH-JKMN')).toBe(
      'ABCD-EFGH-JKMN'
    );
    expect(isRecoverHash('#/recover?c=ABCD-EFGH-JKMN')).toBe(true);
    expect(isRecoverHash('#/quiz/foo')).toBe(false);
  });
});

describe('progress merge helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('merges high scores by best percentage', () => {
    mergeRemoteHighScores([
      {
        quizId: 'exposure-basics',
        percentage: 70,
        correctCount: 7,
        totalQuestions: 10,
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);
    mergeRemoteHighScores([
      {
        quizId: 'exposure-basics',
        percentage: 60,
        correctCount: 6,
        totalQuestions: 10,
        updatedAt: '2026-02-01T00:00:00.000Z',
      },
      {
        quizId: 'composition',
        percentage: 90,
        correctCount: 9,
        totalQuestions: 10,
        updatedAt: '2026-02-01T00:00:00.000Z',
      },
    ]);
    const all = getAllHighScores();
    expect(all['exposure-basics']?.percentage).toBe(70);
    expect(all['composition']?.percentage).toBe(90);
  });

  it('unions achievements', () => {
    mergeUnlockedAchievements(['first-finish']);
    mergeUnlockedAchievements(['perfect', 'first-finish']);
    expect([...getUnlockedAchievements()].sort()).toEqual([
      'first-finish',
      'perfect',
    ]);
  });

  it('merges streak preferring newer lastDailyId and max best', () => {
    mergeDailyStreak(
      {
        lastDailyId: 'daily-2026-09-10',
        currentStreak: 2,
        bestStreak: 5,
        freezesAvailable: 1,
        freezeWeekKey: '2026-W37',
      },
      new Date('2026-09-18T12:00:00Z')
    );
    mergeDailyStreak(
      {
        lastDailyId: 'daily-2026-09-17',
        currentStreak: 3,
        bestStreak: 4,
        freezesAvailable: 0,
        freezeWeekKey: '2026-W38',
      },
      new Date('2026-09-18T12:00:00Z')
    );
    const state = getDailyStreak(new Date('2026-09-18T12:00:00Z'));
    expect(state.lastDailyId).toBe('daily-2026-09-17');
    expect(state.currentStreak).toBe(3);
    expect(state.bestStreak).toBe(5);
  });

  it('setPlayerId validates and persists', () => {
    expect(setPlayerId('not valid!')).toBe(false);
    expect(setPlayerId('abc-123')).toBe(true);
    expect(getPlayerId()).toBe('abc-123');
  });
});
