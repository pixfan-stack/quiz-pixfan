import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import {
  fetchLeaderboard,
  type LeaderboardEntry,
} from '../utils/highscoreApi';

interface WeeklyLeadersProps {
  quizzes?: Quiz[];
  refreshToken?: number;
  onSeeAll?: () => void;
}

/**
 * Compact weekly leaderboard strip for home social proof.
 */
export function WeeklyLeaders({
  quizzes = [],
  refreshToken = 0,
  onSeeAll,
}: WeeklyLeadersProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard({ period: 'week', limit: 5 })
      .then((res) => setEntries(res.leaderboard))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [refreshToken]);

  const titleFor = (quizId: string) => {
    const q = quizzes.find((x) => x.id === quizId);
    return q ? pickLocale(q.title, lang) : quizId;
  };

  return (
    <section
      className="weekly-leaders"
      aria-labelledby="weekly-leaders-title"
    >
      <div className="weekly-leaders__header">
        <h3 id="weekly-leaders-title" className="weekly-leaders__title">
          {t('home.weeklyLeaders')}
        </h3>
        {onSeeAll && (
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={onSeeAll}
          >
            {t('home.weeklyLeadersSeeAll')}
          </button>
        )}
      </div>

      {loading && (
        <p className="weekly-leaders__empty">{t('common.loading')}</p>
      )}

      {!loading && entries.length === 0 && (
        <p className="weekly-leaders__empty">{t('home.weeklyLeadersEmpty')}</p>
      )}

      {!loading && entries.length > 0 && (
        <ol className="weekly-leaders__list">
          {entries.map((entry, index) => (
            <li key={`${entry.quizId}-${entry.playerId}`} className="weekly-leaders__row">
              <span className="weekly-leaders__rank" aria-hidden="true">
                {index + 1}
              </span>
              <span className="weekly-leaders__name">{entry.displayName}</span>
              <span className="weekly-leaders__quiz">{titleFor(entry.quizId)}</span>
              <span className="weekly-leaders__score">{entry.percentage}%</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
