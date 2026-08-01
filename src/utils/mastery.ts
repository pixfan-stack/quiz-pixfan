/**
 * Category mastery tiers from local high scores.
 */

export type MasteryTier = 'none' | 'bronze' | 'silver' | 'gold' | 'master';

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
