import { beforeEach, describe, expect, it } from 'vitest';
import {
  getDailyStreak,
  getDisplayDailyStreak,
  getStreakFreezesAvailable,
  previousDailyQuizId,
  recordDailyCompletion,
  utcIsoWeekKey,
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

  it('resets after a missed day without freeze', () => {
    // Same ISO week (Wed → Fri) so weekly refill does not restore the freeze.
    const d1 = new Date(Date.UTC(2026, 6, 22));
    const d3 = new Date(Date.UTC(2026, 6, 24));
    recordDailyCompletion(getDailyQuizId(d1), d1);
    const spent = getDailyStreak(d1);
    localStorage.setItem(
      'quiz-pixfan-daily-streak',
      JSON.stringify({
        ...spent,
        freezesAvailable: 0,
        freezeWeekKey: utcIsoWeekKey(d3),
      })
    );
    const state = recordDailyCompletion(getDailyQuizId(d3), d3);
    expect(state.currentStreak).toBe(1);
    expect(state.bestStreak).toBe(1);
    expect(state.freezeConsumed).toBe(false);
  });

  it('consumes a freeze to bridge exactly one missed day', () => {
    // Same ISO week so refill does not interfere.
    const d1 = new Date(Date.UTC(2026, 6, 22));
    const d3 = new Date(Date.UTC(2026, 6, 24));
    recordDailyCompletion(getDailyQuizId(d1), d1);
    expect(getStreakFreezesAvailable(d1)).toBe(1);

    const bridged = recordDailyCompletion(getDailyQuizId(d3), d3);
    expect(bridged.freezeConsumed).toBe(true);
    expect(bridged.currentStreak).toBe(2);
    expect(bridged.freezesAvailable).toBe(0);
    expect(getDisplayDailyStreak(d3)).toBe(2);
  });

  it('cannot freeze a two-day gap', () => {
    const d1 = new Date(Date.UTC(2026, 6, 22));
    const d4 = new Date(Date.UTC(2026, 6, 25));
    recordDailyCompletion(getDailyQuizId(d1), d1);
    const state = recordDailyCompletion(getDailyQuizId(d4), d4);
    expect(state.freezeConsumed).toBe(false);
    expect(state.currentStreak).toBe(1);
  });

  it('refills freeze on a new UTC ISO week', () => {
    const weekA = new Date(Date.UTC(2026, 6, 20)); // Monday
    const weekB = new Date(Date.UTC(2026, 6, 27)); // next Monday
    expect(utcIsoWeekKey(weekA)).not.toBe(utcIsoWeekKey(weekB));

    recordDailyCompletion(getDailyQuizId(weekA), weekA);
    const afterPlay = recordDailyCompletion(
      getDailyQuizId(new Date(Date.UTC(2026, 6, 22))),
      new Date(Date.UTC(2026, 6, 22))
    );
    // consume freeze bridging 21st miss from 20th→22nd
    expect(afterPlay.freezeConsumed).toBe(true);
    expect(getStreakFreezesAvailable(new Date(Date.UTC(2026, 6, 22)))).toBe(0);

    expect(getStreakFreezesAvailable(weekB)).toBe(1);
  });
});
