import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import { getPlayerId } from '../utils/player';
import {
  fetchLeaderboard,
  type LeaderboardEntry,
  type LeaderboardViewer,
} from '../utils/highscoreApi';

interface LeaderboardProps {
  quizId?: string;
  limit?: number;
  quizzes?: Quiz[];
}

export function Leaderboard({ quizId, limit = 20, quizzes }: LeaderboardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const currentPlayerId = useMemo(() => getPlayerId(), []);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [viewer, setViewer] = useState<LeaderboardViewer | null>(null);
  const [loading, setLoading] = useState(true);

  const showQuizColumn = !quizId && quizzes && quizzes.length > 0;

  const quizTitleById = useMemo(() => {
    const map = new Map<string, string>();
    if (quizzes) {
      for (const q of quizzes) {
        map.set(q.id, pickLocale(q.title, lang));
      }
    }
    return map;
  }, [quizzes, lang]);

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard({ quizId, limit, playerId: currentPlayerId })
      .then((res) => {
        setEntries(res.leaderboard);
        setViewer(res.viewer ?? null);
      })
      .catch(() => {
        setEntries([]);
        setViewer(null);
      })
      .finally(() => setLoading(false));
  }, [quizId, limit, currentPlayerId]);

  if (loading) {
    return <p className="leaderboard-empty">{t('common.loading')}</p>;
  }

  if (entries.length === 0 && !viewer) {
    return <p className="leaderboard-empty">{t('leaderboard.empty')}</p>;
  }

  const viewerInList = viewer
    ? entries.some((e) => e.playerId === viewer.entry.playerId && e.quizId === viewer.entry.quizId)
    : false;

  return (
    <div className="leaderboard">
      <h3 className="leaderboard__title">{t('leaderboard.title')}</h3>
      {entries.length > 0 && (
        <table className="leaderboard__table">
          <thead>
            <tr>
              <th>{t('leaderboard.rank')}</th>
              <th>{t('leaderboard.player')}</th>
              {showQuizColumn && <th>{t('leaderboard.quiz')}</th>}
              <th>{t('leaderboard.score')}</th>
              <th>{t('leaderboard.answers')}</th>
              <th>{t('leaderboard.date')}</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const isSelf = entry.playerId === currentPlayerId;
              return (
                <tr
                  key={`${entry.quizId}-${entry.playerId}`}
                  className={isSelf ? 'leaderboard__row--self' : undefined}
                  aria-current={isSelf ? 'true' : undefined}
                >
                  <td className="leaderboard__rank">{index + 1}</td>
                  <td className="leaderboard__player">
                    {entry.displayName}
                    {isSelf && (
                      <span className="leaderboard__you-badge">{t('leaderboard.yourRow')}</span>
                    )}
                  </td>
                  {showQuizColumn && (
                    <td className="leaderboard__quiz">
                      {quizTitleById.get(entry.quizId) ?? entry.quizId}
                    </td>
                  )}
                  <td className="leaderboard__score">{entry.percentage}%</td>
                  <td className="leaderboard__answers">
                    {entry.correctCount}/{entry.totalQuestions}
                  </td>
                  <td className="leaderboard__date">
                    {new Date(entry.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {viewer && (!viewerInList || entries.length === 0) && (
        <p className="leaderboard__footer">
          {t('leaderboard.yourPositionDetail', {
            rank: viewer.rank,
            score: viewer.entry.percentage,
            displayName: viewer.entry.displayName,
          })}
        </p>
      )}
    </div>
  );
}
