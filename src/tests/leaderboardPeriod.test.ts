import { describe, expect, it } from 'vitest';
import {
  getMonthPeriodId,
  getWeekPeriodId,
  parseLeaderboardPeriod,
} from '../utils/leaderboardPeriod';

describe('leaderboardPeriod', () => {
  it('formats month season ids in UTC', () => {
    expect(getMonthPeriodId(new Date(Date.UTC(2026, 6, 25)))).toBe('2026-07');
    expect(getMonthPeriodId(new Date(Date.UTC(2026, 0, 1)))).toBe('2026-01');
  });

  it('formats ISO week ids in UTC', () => {
    // 2026-07-25 is a Saturday → ISO week 30 of 2026
    expect(getWeekPeriodId(new Date(Date.UTC(2026, 6, 25)))).toBe('2026-W30');
  });

  it('parses period query values', () => {
    expect(parseLeaderboardPeriod('week')).toBe('week');
    expect(parseLeaderboardPeriod('month')).toBe('month');
    expect(parseLeaderboardPeriod('all')).toBe('all');
    expect(parseLeaderboardPeriod('nope')).toBe('all');
    expect(parseLeaderboardPeriod(null)).toBe('all');
  });
});
