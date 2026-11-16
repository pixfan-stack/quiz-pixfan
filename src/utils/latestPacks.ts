import type { Quiz } from '../types/quiz';

/**
 * Ordered home « Nouveautés » pin list (option B).
 * Edit this array to promote packs — independent of catalog array order.
 */
export const NEWEST_PACK_IDS = [
  'nikon-histoire',
  'tamron-histoire',
] as const;

/** How many pinned packs to surface (prefix of NEWEST_PACK_IDS). */
export const LATEST_PACK_COUNT = 2;

/**
 * Resolve pinned newest packs from the catalog, preserving pin order.
 * Missing IDs are skipped (safe if a pack is removed).
 */
export function getLatestPacks(
  quizzes: Quiz[],
  count: number = LATEST_PACK_COUNT
): Quiz[] {
  if (count <= 0 || quizzes.length === 0) return [];
  const byId = new Map(quizzes.map((q) => [q.id, q]));
  const out: Quiz[] = [];
  for (const id of NEWEST_PACK_IDS) {
    if (out.length >= count) break;
    const quiz = byId.get(id);
    if (quiz) out.push(quiz);
  }
  return out;
}

export function latestPackIdSet(
  quizzes: Quiz[],
  count: number = LATEST_PACK_COUNT
): Set<string> {
  return new Set(getLatestPacks(quizzes, count).map((q) => q.id));
}
