import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getSeasonDaysRemaining,
  getSeasonEndDay,
  getSeasonStart,
} from '../utils/leaderboardPeriod';
import {
  cosmeticFromMonthRank,
  dismissSeasonBanner,
  getSeasonBadge,
  getSeasonBadges,
  getSeasonBannerKind,
  listSeasonBadges,
  mergeRemoteSeasonBadges,
  mergeSeasonBadgeMaps,
  parseSeasonBadges,
  pickHigherSeasonCosmetic,
  SEASON_ENDING_SOON_DAYS,
  unlockSeasonFromRank,
  unlockSeasonParticipant,
  unlockSeasonStreak,
} from '../utils/seasonEngagement';

describe('season period helpers', () => {
  it('computes season start/end and remaining days in UTC', () => {
    expect(getSeasonStart('2026-09').toISOString()).toBe(
      '2026-09-01T00:00:00.000Z'
    );
    expect(getSeasonEndDay('2026-09').toISOString()).toBe(
      '2026-09-30T00:00:00.000Z'
    );
    expect(
      getSeasonDaysRemaining(new Date(Date.UTC(2026, 8, 28)))
    ).toBe(2);
    expect(
      getSeasonDaysRemaining(new Date(Date.UTC(2026, 8, 30)))
    ).toBe(0);
  });
});

describe('seasonEngagement', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  it('shows started banner for an unseen season', () => {
    const mid = new Date(Date.UTC(2026, 8, 10));
    expect(getSeasonBannerKind(mid)).toBe('started');
    dismissSeasonBanner('started', mid);
    expect(getSeasonBannerKind(mid)).toBeNull();
  });

  it('shows ending banner near month end after season was seen', () => {
    const late = new Date(Date.UTC(2026, 8, 29));
    dismissSeasonBanner('started', late);
    expect(getSeasonDaysRemaining(late)).toBeLessThanOrEqual(
      SEASON_ENDING_SOON_DAYS
    );
    expect(getSeasonBannerKind(late)).toBe('ending');
    dismissSeasonBanner('ending', late);
    expect(getSeasonBannerKind(late)).toBeNull();
  });

  it('unlocks participant cosmetic badges per season', () => {
    expect(unlockSeasonParticipant('2026-09')).toBe(true);
    expect(unlockSeasonParticipant('2026-09')).toBe(false);
    expect(getSeasonBadge('2026-09')).toBe('participant');
    expect(listSeasonBadges()).toEqual([
      { seasonId: '2026-09', cosmetic: 'participant' },
    ]);
  });

  it('maps month rank to top10 / podium cosmetics', () => {
    expect(cosmeticFromMonthRank(1)).toBe('podium');
    expect(cosmeticFromMonthRank(3)).toBe('podium');
    expect(cosmeticFromMonthRank(4)).toBe('top10');
    expect(cosmeticFromMonthRank(10)).toBe('top10');
    expect(cosmeticFromMonthRank(11)).toBeNull();
    expect(cosmeticFromMonthRank(null)).toBeNull();
  });

  it('upgrades season cosmetics without downgrading', () => {
    expect(pickHigherSeasonCosmetic('participant', 'top10')).toBe('top10');
    expect(pickHigherSeasonCosmetic('podium', 'top10')).toBe('podium');
    unlockSeasonParticipant('2026-09');
    expect(unlockSeasonFromRank(8, '2026-09')).toBe(true);
    expect(getSeasonBadge('2026-09')).toBe('top10');
    expect(unlockSeasonFromRank(2, '2026-09')).toBe(true);
    expect(getSeasonBadge('2026-09')).toBe('podium');
    expect(unlockSeasonFromRank(9, '2026-09')).toBe(false);
    expect(getSeasonBadge('2026-09')).toBe('podium');
  });

  it('unlocks streak-season at threshold without beating podium', () => {
    expect(unlockSeasonStreak(6, '2026-09')).toBe(false);
    expect(unlockSeasonStreak(7, '2026-09')).toBe(true);
    expect(getSeasonBadge('2026-09')).toBe('streak-season');
    unlockSeasonFromRank(1, '2026-09');
    expect(unlockSeasonStreak(14, '2026-09')).toBe(false);
    expect(getSeasonBadge('2026-09')).toBe('podium');
  });

  it('parseSeasonBadges accepts known cosmetics and rejects junk', () => {
    expect(
      parseSeasonBadges({
        '2026-09': 'podium',
        '2026-08': 'top10',
        '2026-07': 'streak-season',
        '2026-06': 'participant',
        'bad': 'podium',
        '2026-05': 'legendary',
      })
    ).toEqual({
      '2026-09': 'podium',
      '2026-08': 'top10',
      '2026-07': 'streak-season',
      '2026-06': 'participant',
    });
  });

  it('mergeSeasonBadgeMaps keeps the higher tier per season', () => {
    expect(
      mergeSeasonBadgeMaps(
        { '2026-09': 'participant' },
        { '2026-09': 'top10', '2026-08': 'streak-season' }
      )
    ).toEqual({
      '2026-09': 'top10',
      '2026-08': 'streak-season',
    });
  });

  it('mergeRemoteSeasonBadges unions maps', () => {
    unlockSeasonParticipant('2026-08');
    mergeRemoteSeasonBadges({ '2026-09': 'participant' });
    expect(getSeasonBadges()).toEqual({
      '2026-08': 'participant',
      '2026-09': 'participant',
    });
  });
});
