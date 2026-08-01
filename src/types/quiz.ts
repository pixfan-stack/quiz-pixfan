/**
 * Quiz domain types.
 *
 * HOW TO ADD A NEW QUIZ / QUESTIONS:
 * 1. Open public/data/questions.json
 * 2. Add a new object to the top-level "quizzes" array (or append questions
 *    to an existing quiz).
 * 3. Every user-facing string must have both "fr" and "en" fields.
 * 4. For single-choice: type = "single", correctAnswers has exactly one id.
 * 5. For multiple-choice: type = "multiple", correctAnswers has one or more ids.
 * 6. Answer "id" values must be unique within a question.
 */

/** Localized string pair (extend with more locales if needed). */
export interface LocalizedString {
  en: string;
  fr: string;
}

export type QuestionType = 'single' | 'multiple';

/** Pedagogical difficulty for filtering and practice packs. */
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Answer {
  id: string;
  text: LocalizedString;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: LocalizedString;
  answers: Answer[];
  /** IDs of correct answers (one for single, one+ for multiple). */
  correctAnswers: string[];
  /** Optional explanation shown after the user submits. */
  explanation?: LocalizedString;
  /** Optional illustration (absolute or site-relative URL). */
  imageUrl?: string;
  /** Accessible description for the illustration. */
  imageAlt?: LocalizedString;
  /** Optional attribution line shown under the image (e.g. public-domain credit). */
  imageCredit?: LocalizedString;
  /** Optional per-question difficulty (defaults to quiz difficulty). */
  difficulty?: Difficulty;
}

export interface Quiz {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  questions: Question[];
  /** Overall quiz difficulty used for filters and badges. */
  difficulty?: Difficulty;
}

export interface QuizzesData {
  quizzes: Quiz[];
}

/** One answered question for post-quiz review. */
export interface AnswerReviewItem {
  question: Question;
  selectedIds: string[];
  wasCorrect: boolean;
  timedOut?: boolean;
}

/** Runtime result for one finished quiz attempt. */
export interface QuizResult {
  quizId: string;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSeconds: number;
  maxStreak: number;
  isNewHighScore: boolean;
  previousBest: number | null;
  /** Correct answers removed due to anti-cheat tab switches. */
  tabSwitchPenalty?: number;
  /** Incorrect (or timed-out) answers for the review panel. */
  mistakes: AnswerReviewItem[];
  /** Per-question correctness in play order (for share grids). */
  answerMarks?: boolean[];
}

/** Local high-score record stored in localStorage. */
export interface HighScoreRecord {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string; // ISO date
}
