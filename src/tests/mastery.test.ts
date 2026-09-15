import { describe, it, expect } from 'vitest';
import {
  masteryLabelKey,
  masteryTierFromPercent,
  nextMasteryTarget,
} from '../utils/mastery';

describe('mastery', () => {
  it('maps percentages to tiers', () => {
    expect(masteryTierFromPercent(null)).toBe('none');
    expect(masteryTierFromPercent(40)).toBe('none');
    expect(masteryTierFromPercent(50)).toBe('bronze');
    expect(masteryTierFromPercent(70)).toBe('silver');
    expect(masteryTierFromPercent(85)).toBe('gold');
    expect(masteryTierFromPercent(100)).toBe('master');
  });

  it('returns i18n keys only for earned tiers', () => {
    expect(masteryLabelKey('none')).toBeNull();
    expect(masteryLabelKey('gold')).toBe('home.mastery_gold');
  });

  it('computes next mastery target', () => {
    expect(nextMasteryTarget(null)).toEqual({
      nextTier: 'bronze',
      need: 50,
      threshold: 50,
      current: 0,
    });
    expect(nextMasteryTarget(49)).toEqual({
      nextTier: 'bronze',
      need: 1,
      threshold: 50,
      current: 49,
    });
    expect(nextMasteryTarget(50)).toEqual({
      nextTier: 'silver',
      need: 20,
      threshold: 70,
      current: 50,
    });
    expect(nextMasteryTarget(84)).toEqual({
      nextTier: 'gold',
      need: 1,
      threshold: 85,
      current: 84,
    });
    expect(nextMasteryTarget(99)).toEqual({
      nextTier: 'master',
      need: 1,
      threshold: 100,
      current: 99,
    });
    expect(nextMasteryTarget(100)).toBeNull();
  });
});
