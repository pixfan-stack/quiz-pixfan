/**
 * School (scolaires) parcours — shared by hub analytics IDs and in-app `#/scolaires`.
 */

import type { HabitEventName } from './habitAnalytics';

export const SCOLAIRES_TAG = 'scolaires';

export type ScolairesParcoursId =
  | 'c3-decouvrir'
  | 'c4-regard'
  | 'c4-lumiere'
  | 'c4-emi-droits';

export interface ScolairesParcours {
  id: ScolairesParcoursId;
  /** Habit analytics event name (without evt: prefix). */
  event: Extract<HabitEventName, `scolaires_parcours_${string}`>;
  /** Primary quiz to launch for the séance. */
  startQuizId: string;
  /** Approx duration label key suffix under scolaires.parcours.* */
  minutes: number;
}

/** Stable curated paths — order matches hub HTML. */
export const SCOLAIRES_PARCOURS: readonly ScolairesParcours[] = [
  {
    id: 'c3-decouvrir',
    event: 'scolaires_parcours_c3_decouvrir',
    startQuizId: 'genres',
    minutes: 15,
  },
  {
    id: 'c4-regard',
    event: 'scolaires_parcours_c4_regard',
    startQuizId: 'photo-reading',
    minutes: 20,
  },
  {
    id: 'c4-lumiere',
    event: 'scolaires_parcours_c4_lumiere',
    startQuizId: 'exposure-basics',
    minutes: 25,
  },
  {
    id: 'c4-emi-droits',
    event: 'scolaires_parcours_c4_emi_droits',
    startQuizId: 'photo-rights',
    minutes: 20,
  },
] as const;

/** True when a pack is curated for school sessions. */
export function quizHasScolairesTag(quiz: {
  tags?: string[] | null;
}): boolean {
  return Array.isArray(quiz.tags) && quiz.tags.includes(SCOLAIRES_TAG);
}

export function filterQuizzesByScolairesTag<T extends { tags?: string[] | null }>(
  quizzes: T[]
): T[] {
  return quizzes.filter(quizHasScolairesTag);
}
