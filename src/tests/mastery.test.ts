import { describe, it, expect } from 'vitest';
import { masteryLabelKey, masteryTierFromPercent } from '../utils/mastery';

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
});
