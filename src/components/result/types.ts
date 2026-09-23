import type { Quiz, QuizResult } from '../../types/quiz';

export type LangCode = 'en' | 'fr';

export interface ResultScreenProps {
  quiz: Quiz;
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
  /** Start today’s daily challenge (re-engage CTA). */
  onPlayDaily?: () => void;
  /** Jump into weak-spots practice from post-score CTA. */
  onPlayWeakSpots?: () => void;
  onScoreSubmitted?: () => void;
  /** Category quiz ids for explorer / expert-trio achievements. */
  categoryQuizIds?: string[];
  /** Full quiz catalog — needed to create a friend duel from results. */
  quizzes?: Quiz[];
  /** Challenger score to beat (shared duel). */
  targetScore?: number | null;
}
