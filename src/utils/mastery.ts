/**
 * Category mastery tiers from local high scores.
 */

import { isPhotoReadingQuizId } from './photoReading';
import { isWeakSpotsQuizId } from './mistakeVault';

export type MasteryTier = 'none' | 'bronze' | 'silver' | 'gold' | 'master';

export type EarnedMasteryTier = Exclude<MasteryTier, 'none'>;

/** Minimum % required to unlock each tier. */
export const MASTERY_THRESHOLDS: Record<EarnedMasteryTier, number> = {
  bronze: 50,
  silver: 70,
  gold: 85,
  master: 100,
};

/** Light + portrait + exposure path for aggregate mastery. */
export const PARCOURS_QUIZ_IDS = [
  'light-color',
  'portrait-light',
  'exposure-basics',
] as const;

export type ParcoursQuizId = (typeof PARCOURS_QUIZ_IDS)[number];

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

/** Category packs plus photo-reading / weak-spots modes. */
export function isMasteryEligible(
  quizId: string,
  categoryQuizIds: readonly string[]
): boolean {
  if (isPhotoReadingQuizId(quizId) || isWeakSpotsQuizId(quizId)) return true;
  return categoryQuizIds.includes(quizId);
}

export function isParcoursQuizId(quizId: string): quizId is ParcoursQuizId {
  return (PARCOURS_QUIZ_IDS as readonly string[]).includes(quizId);
}

export interface ParcoursMastery {
  /** Average best % across packs that have a score (0 if none played). */
  average: number;
  /** How many of the three parcours packs have a recorded best. */
  played: number;
  tier: MasteryTier;
  next: MasteryNextTarget | null;
}

/**
 * Aggregate mastery across light + portrait + exposure packs.
 * Uses the mean of recorded bests (unplayed packs do not pull the average down).
 */
export function getParcoursMastery(
  highscores: Record<string, { percentage?: number } | undefined>
): ParcoursMastery {
  const scores: number[] = [];
  for (const id of PARCOURS_QUIZ_IDS) {
    const pct = highscores[id]?.percentage;
    if (pct != null && Number.isFinite(pct)) {
      scores.push(Math.max(0, Math.min(100, Math.floor(pct))));
    }
  }
  if (scores.length === 0) {
    return {
      average: 0,
      played: 0,
      tier: 'none',
      next: nextMasteryTarget(0),
    };
  }
  const average = Math.round(
    scores.reduce((sum, n) => sum + n, 0) / scores.length
  );
  return {
    average,
    played: scores.length,
    tier: masteryTierFromPercent(average),
    next: nextMasteryTarget(average),
  };
}
