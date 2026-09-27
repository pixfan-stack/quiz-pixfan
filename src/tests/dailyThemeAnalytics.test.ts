import { describe, expect, it } from 'vitest';
import {
  DAILY_THEME_IDS,
  buildDailyThemeDayCounts as buildFn,
  getDailyThemeId,
} from '../../functions/lib/dailyThemes';
import {
  buildDailyThemeDayCounts,
  themeIdForDay,
} from '../utils/dailyThemeAnalytics';
import { getDailyTheme } from '../utils/dailyChallenge';

describe('dailyThemeAnalytics', () => {
  it('maps daily quiz ids to editorial themes over 14 days', () => {
    const now = new Date(Date.UTC(2026, 8, 27));
    const rows = [
      { quizId: 'daily-2026-09-27', attempts: 4 },
      { quizId: 'daily-2026-09-26', attempts: 2 },
      { quizId: 'daily-2026-09-20', attempts: 7 },
      { quizId: 'exposure-basics', attempts: 99 },
      { quizId: 'daily-bogus', attempts: 5 },
    ];
    const days = buildDailyThemeDayCounts(rows, now, 14);
    expect(days).toHaveLength(14);
    expect(days[0]).toEqual({
      day: '2026-09-27',
      theme: getDailyTheme(now).id,
      attempts: 4,
    });
    expect(days[1]?.day).toBe('2026-09-26');
    expect(days[1]?.attempts).toBe(2);
    expect(days.find((d) => d.day === '2026-09-20')?.attempts).toBe(7);
    expect(days.find((d) => d.day === '2026-09-25')?.attempts).toBe(0);
  });

  it('themeIdForDay matches getDailyTheme', () => {
    expect(themeIdForDay('2026-09-27')).toBe(
      getDailyTheme(new Date(Date.UTC(2026, 8, 27))).id
    );
    expect(themeIdForDay('not-a-day')).toBeNull();
  });
});

describe('functions/lib/dailyThemes parity', () => {
  it('matches client theme ids for sample dates', () => {
    const samples = [
      new Date(Date.UTC(2026, 8, 27)),
      new Date(Date.UTC(2026, 0, 1)),
      new Date(Date.UTC(2026, 5, 15)),
    ];
    for (const d of samples) {
      expect(getDailyThemeId(d)).toBe(getDailyTheme(d).id);
    }
  });

  it('lists the same theme order as client rotation length', () => {
    expect(DAILY_THEME_IDS.length).toBe(9);
    expect([...DAILY_THEME_IDS]).toEqual([
      'lightroom',
      'smartphone',
      'light',
      'composition',
      'gear',
      'genres',
      'rights',
      'history',
      'mixed',
    ]);
  });

  it('buildDailyThemeDayCounts matches client helper', () => {
    const now = new Date(Date.UTC(2026, 8, 27));
    const rows = [
      { quizId: 'daily-2026-09-27', attempts: 3 },
      { quizId: 'daily-2026-09-21', attempts: 1 },
    ];
    expect(buildFn(rows, now, 14)).toEqual(
      buildDailyThemeDayCounts(rows, now, 14)
    );
  });
});
