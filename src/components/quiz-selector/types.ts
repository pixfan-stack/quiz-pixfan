import type { Quiz } from '../../types/quiz';
import type { getHighScore } from '../../utils/highscore';
import type { fetchRemoteHighScore } from '../../utils/highscoreApi';

export interface QuizSelectorProps {
  quizzes: Quiz[];
  onSelect: (quiz: Quiz) => void;
  onSettingsChange: (settings: { timePerQuestion: number; antiCheat: boolean }) => void;
  onPrefetchQuiz?: () => void;
  leaderboardRefreshToken?: number;
  recoveryCode?: string | null;
  onRecovered?: () => void;
  /** Hide public leaderboard / duel / season chrome. */
  classeMode?: boolean;
}

/** Neutral catalogue mark — avoids a 15-emoji wall in MorePacks. */
export const QUIZ_ICON_MARK = '✦';

export interface QuizWithScore {
  quiz: Quiz;
  localScore: ReturnType<typeof getHighScore>;
  remoteScore: Awaited<ReturnType<typeof fetchRemoteHighScore>>;
}
