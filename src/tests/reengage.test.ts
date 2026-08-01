import { describe, it, expect, beforeEach } from 'vitest';
import {
  dismissHomeDailyNudge,
  dismissResultReengage,
  hasPlayedDailyToday,
  isStandalonePwa,
  markQuizPlayed,
  shouldShowHomeDailyNudge,
  shouldShowResultReengage,
} from '../utils/reengage';
import { getDailyQuizId } from '../utils/dailyChallenge';

describe('reengage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows result reengage for non-daily quizzes when daily not played', () => {
    expect(shouldShowResultReengage('composition')).toBe(true);
    expect(shouldShowResultReengage('daily-2026-07-26')).toBe(false);
  });

  it('hides result reengage once today’s daily is done', () => {
    const dailyId = getDailyQuizId();
    localStorage.setItem(
      'quiz-pixfan-highscores',
      JSON.stringify({
        [dailyId]: {
          quizId: dailyId,
          percentage: 80,
          correctCount: 8,
          totalQuestions: 10,
        },
      })
    );
    expect(hasPlayedDailyToday()).toBe(true);
    expect(shouldShowResultReengage('composition')).toBe(false);
  });


  it('hides result reengage after dismiss for the day', () => {
    dismissResultReengage();
    expect(shouldShowResultReengage('composition')).toBe(false);
  });

  it('does not show home nudge without standalone + recent play', () => {
    expect(isStandalonePwa()).toBe(false);
    markQuizPlayed();
    expect(shouldShowHomeDailyNudge()).toBe(false);
  });

  it('hides home nudge after dismiss', () => {
    dismissHomeDailyNudge(new Date('2026-07-26T12:00:00Z'));
    expect(shouldShowHomeDailyNudge()).toBe(false);
  });

  it('detects daily not played by default', () => {
    expect(hasPlayedDailyToday()).toBe(false);
    expect(getDailyQuizId()).toMatch(/^daily-\d{4}-\d{2}-\d{2}$/);
  });
});
