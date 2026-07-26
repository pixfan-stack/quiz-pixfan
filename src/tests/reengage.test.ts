import { describe, it, expect, beforeEach } from 'vitest';
import {
  dismissHomeDailyNudge,
  dismissResultReengage,
  isStandalonePwa,
  markQuizPlayed,
  shouldShowHomeDailyNudge,
  shouldShowResultReengage,
} from '../utils/reengage';

describe('reengage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows result reengage for non-daily quizzes', () => {
    expect(shouldShowResultReengage('composition')).toBe(true);
    expect(shouldShowResultReengage('daily-2026-07-26')).toBe(false);
  });

  it('hides result reengage after dismiss for the day', () => {
    dismissResultReengage(new Date('2026-07-26T12:00:00Z'));
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
});
