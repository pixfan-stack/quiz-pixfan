import type { Difficulty, Quiz } from '../../types/quiz';
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
}

export const QUIZ_ICONS: Record<string, string> = {
  'exposure-basics': '📷',
  composition: '📐',
  'light-color': '🌅',
  'gear-lenses': '🔭',
  'history-icons': '🎞️',
  'public-domain': '🏛️',
  genres: '🖼️',
  smartphone: '📱',
  'photo-rights': '⚖️',
  retouching: '✨',
  'lightroom-workflow': '🖥️',
  'portrait-light': '💡',
  'marques-photo': '🏷️',
};

export interface QuizWithScore {
  quiz: Quiz;
  localScore: ReturnType<typeof getHighScore>;
  remoteScore: Awaited<ReturnType<typeof fetchRemoteHighScore>>;
}

export type DifficultyFilter = Difficulty | 'all';
