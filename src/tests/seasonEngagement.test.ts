import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getSeasonDaysRemaining,
  getSeasonEndDay,
  getSeasonStart,
} from '../utils/leaderboardPeriod';
import {
  dismissSeasonBanner,
  getSeasonBadge,
  getSeasonBannerKind,
  listSeasonBadges,
  SEASON_ENDING_SOON_DAYS,
  unlockSeasonParticipant,
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
});
