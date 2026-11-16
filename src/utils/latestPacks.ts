import type { Quiz } from '../types/quiz';

/** How many catalog-tail packs to surface in the home « Nouveautés » encart. */
export const LATEST_PACK_COUNT = 2;

/**
 * Last N packs in catalog array order (questions.json).
 * No featured/newest metadata — append a pack to promote it here.
 */
export function getLatestPacks(
  quizzes: Quiz[],
  count: number = LATEST_PACK_COUNT
): Quiz[] {
  if (count <= 0 || quizzes.length === 0) return [];
  return quizzes.slice(-Math.min(count, quizzes.length));
}

export function latestPackIdSet(
  quizzes: Quiz[],
  count: number = LATEST_PACK_COUNT
): Set<string> {
  return new Set(getLatestPacks(quizzes, count).map((q) => q.id));
}
