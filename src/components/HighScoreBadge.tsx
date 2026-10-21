import { useTranslation } from 'react-i18next';
import type { HighScoreRecord } from '../types/quiz';

interface HighScoreBadgeProps {
  /** Pre-computed best score (local + remote). */
  bestScore?: HighScoreRecord | null;
}

/**
 * Displays the local best score percentage for a quiz.
 * Accepts an optional pre-computed best score from remote/local merge.
 * Empty scores stay quiet (no "no score yet" chip on the landing).
 */
export function HighScoreBadge({ bestScore }: HighScoreBadgeProps) {
  const { t } = useTranslation();

  // Use the pre-computed best score if provided
  const record = bestScore;

  if (!record) {
    return null;
  }

  return (
    <span className="highscore-badge" title={record.updatedAt}>
      <span aria-hidden="true">★</span>
      {t('highscore.label')}: {record.percentage}%
    </span>
  );
}
