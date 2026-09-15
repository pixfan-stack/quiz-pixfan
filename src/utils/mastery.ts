/**
 * Category mastery tiers from local high scores.
 */

export type MasteryTier = 'none' | 'bronze' | 'silver' | 'gold' | 'master';

export type EarnedMasteryTier = Exclude<MasteryTier, 'none'>;

/** Minimum % required to unlock each tier. */
export const MASTERY_THRESHOLDS: Record<EarnedMasteryTier, number> = {
  bronze: 50,
  silver: 70,
  gold: 85,
  master: 100,
};

const TIER_ORDER: EarnedMasteryTier[] = [
  'bronze',
  'silver',
  'gold',
  'master',
];

export function masteryTierFromPercent(
  percentage: number | null | undefined
): MasteryTier {
  if (percentage == null || !Number.isFinite(percentage)) return 'none';
  if (percentage >= 100) return 'master';
  if (percentage >= 85) return 'gold';
  if (percentage >= 70) return 'silver';
  if (percentage >= 50) return 'bronze';
  return 'none';
}

/** i18n key under home.mastery_* */
export function masteryLabelKey(tier: MasteryTier): string | null {
  if (tier === 'none') return null;
  return `home.mastery_${tier}`;
}

export interface MasteryNextTarget {
  nextTier: EarnedMasteryTier;
  /** Percentage points still needed (at least 1 when not yet at threshold). */
  need: number;
  /** Threshold for the next tier. */
  threshold: number;
  current: number;
}

/**
 * Next mastery milestone for a given best score.
 * Returns null when already at Maître (100%).
 */
export function nextMasteryTarget(
  percentage: number | null | undefined
): MasteryNextTarget | null {
  const current =
    percentage == null || !Number.isFinite(percentage)
      ? 0
      : Math.max(0, Math.min(100, Math.floor(percentage)));
  if (current >= 100) return null;

  for (const tier of TIER_ORDER) {
    const threshold = MASTERY_THRESHOLDS[tier];
    if (current < threshold) {
      return {
        nextTier: tier,
        need: Math.max(1, threshold - current),
        threshold,
        current,
      };
    }
  }
  return null;
}
