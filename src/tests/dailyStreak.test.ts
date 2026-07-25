import { beforeEach, describe, expect, it } from 'vitest';
import {
  getDailyStreak,
  getDisplayDailyStreak,
  previousDailyQuizId,
  recordDailyCompletion,
} from '../utils/dailyStreak';
import { getDailyQuizId } from '../utils/dailyChallenge';

describe('dailyStreak', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('computes previous daily id', () => {
    expect(previousDailyQuizId('daily-2026-07-25')).toBe('daily-2026-07-24');
    expect(previousDailyQuizId('daily-2026-03-01')).toBe('daily-2026-02-28');
  });

  it('starts a streak at 1 on first completion', () => {
    const day = new Date(Date.UTC(2026, 6, 25));
    const state = recordDailyCompletion(getDailyQuizId(day), day);
    expect(state.currentStreak).toBe(1);
    expect(state.bestStreak).toBe(1);
    expect(getDisplayDailyStreak(day)).toBe(1);
  });

  it('increments on consecutive days and is idempotent same day', () => {
    const d1 = new Date(Date.UTC(2026, 6, 25));
    const d2 = new Date(Date.UTC(2026, 6, 26));
    recordDailyCompletion(getDailyQuizId(d1), d1);
    const again = recordDailyCompletion(getDailyQuizId(d1), d1);
    expect(again.currentStreak).toBe(1);

    const next = recordDailyCompletion(getDailyQuizId(d2), d2);
    expect(next.currentStreak).toBe(2);
    expect(next.bestStreak).toBe(2);
  });

  it('resets after a missed day', () => {
    const d1 = new Date(Date.UTC(2026, 6, 25));
    const d3 = new Date(Date.UTC(2026, 6, 27));
    recordDailyCompletion(getDailyQuizId(d1), d1);
    const state = recordDailyCompletion(getDailyQuizId(d3), d3);
    expect(state.currentStreak).toBe(1);
    expect(state.bestStreak).toBe(1);
    expect(getDailyStreak().bestStreak).toBe(1);
  });
});
