import { useTranslation } from 'react-i18next';
import type { HighScoreRecord } from '../types/quiz';

interface HighScoreBadgeProps {
  quizId: string;
  /** When true, show a muted "no score" label if empty. */
  showEmpty?: boolean;
  /** Pre-computed best score (local + remote). */
  bestScore?: HighScoreRecord | null;
}

/**
 * Displays the local best score percentage for a quiz.
 * Accepts an optional pre-computed best score from remote/local merge.
 */
export function HighScoreBadge({
  quizId: _quizId,
  showEmpty = false,
  bestScore,
}: HighScoreBadgeProps) {
  const { t } = useTranslation();

  // Use the pre-computed best score if provided
  const record = bestScore;

  if (!record) {
    if (!showEmpty) return null;
    return (
      <span className="highscore-badge highscore-badge--empty">
        {t('highscore.none')}
      </span>
    );
  }

  return (
    <span className="highscore-badge" title={record.updatedAt}>
      <span aria-hidden="true">★</span>
      {t('highscore.label')}: {record.percentage}%
    </span>
  );
}
