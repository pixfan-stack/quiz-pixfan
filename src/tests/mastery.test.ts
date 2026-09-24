import { describe, it, expect } from 'vitest';
import {
  getParcoursMastery,
  isMasteryEligible,
  isParcoursQuizId,
  masteryLabelKey,
  masteryTierFromPercent,
  nextMasteryTarget,
  PARCOURS_QUIZ_IDS,
} from '../utils/mastery';
import { PHOTO_READING_ID } from '../utils/photoReading';
import { WEAK_SPOTS_QUIZ_ID } from '../utils/mistakeVault';

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

  it('treats photo-reading and weak-spots as mastery-eligible', () => {
    expect(isMasteryEligible(PHOTO_READING_ID, ['composition'])).toBe(true);
    expect(isMasteryEligible(WEAK_SPOTS_QUIZ_ID, ['composition'])).toBe(true);
    expect(isMasteryEligible('composition', ['composition'])).toBe(true);
    expect(isMasteryEligible('duel-abcd2345', ['composition'])).toBe(false);
    expect(isMasteryEligible('daily-2026-09-24', ['composition'])).toBe(false);
  });

  it('aggregates parcours mastery across light + portrait + exposure', () => {
    expect(PARCOURS_QUIZ_IDS).toHaveLength(3);
    expect(isParcoursQuizId('light-color')).toBe(true);
    expect(isParcoursQuizId('composition')).toBe(false);

    const empty = getParcoursMastery({});
    expect(empty.played).toBe(0);
    expect(empty.tier).toBe('none');

    const partial = getParcoursMastery({
      'light-color': { percentage: 80 },
      'portrait-light': { percentage: 60 },
    });
    expect(partial.played).toBe(2);
    expect(partial.average).toBe(70);
    expect(partial.tier).toBe('silver');
    expect(partial.next?.nextTier).toBe('gold');
  });
});
