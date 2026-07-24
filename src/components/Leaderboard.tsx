import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchLeaderboard, type LeaderboardEntry } from '../utils/highscoreApi';

interface LeaderboardProps {
  quizId?: string;
  limit?: number;
}

export function Leaderboard({ quizId, limit = 20 }: LeaderboardProps) {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard({ quizId, limit })
      .then((res) => setEntries(res.leaderboard))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [quizId, limit]);

  if (loading) {
    return <p className="leaderboard-empty">{t('common.loading')}</p>;
  }

  if (entries.length === 0) {
    return <p className="leaderboard-empty">{t('leaderboard.empty')}</p>;
  }

  return (
    <div className="leaderboard">
      <h3 className="leaderboard__title">{t('leaderboard.title')}</h3>
      <table className="leaderboard__table">
        <thead>
          <tr>
            <th>{t('leaderboard.rank')}</th>
            <th>{t('leaderboard.score')}</th>
            <th>{t('leaderboard.answers')}</th>
            <th>{t('leaderboard.date')}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={`${entry.quizId}-${index}`}>
              <td className="leaderboard__rank">{index + 1}</td>
              <td className="leaderboard__score">{entry.percentage}%</td>
              <td className="leaderboard__answers">
                {entry.correctCount}/{entry.totalQuestions}
              </td>
              <td className="leaderboard__date">
                {new Date(entry.updatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
