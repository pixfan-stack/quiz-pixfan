import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import { getPlayerId } from '../utils/player';
import {
  fetchLeaderboard,
  reportDisplayName,
  type LeaderboardEntry,
  type LeaderboardViewer,
} from '../utils/highscoreApi';
import type { LeaderboardPeriod } from '../utils/leaderboardPeriod';
import { getMonthPeriodId } from '../utils/leaderboardPeriod';
import {
  hasReportedPlayer,
  markPlayerReported,
} from '../utils/nameReports';

interface LeaderboardProps {
  quizId?: string;
  limit?: number;
  quizzes?: Quiz[];
  /** Bump to refetch after a new score is submitted. */
  refreshToken?: number;
}

const PERIODS: LeaderboardPeriod[] = ['all', 'week', 'month'];

export function Leaderboard({ quizId, limit = 20, quizzes, refreshToken = 0 }: LeaderboardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const currentPlayerId = useMemo(() => getPlayerId(), []);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [viewer, setViewer] = useState<LeaderboardViewer | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<LeaderboardPeriod>('month');
  const [seasonId, setSeasonId] = useState(getMonthPeriodId());
  const [reportedIds, setReportedIds] = useState<Set<string>>(() => new Set());
  const [reportBusyId, setReportBusyId] = useState<string | null>(null);

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
    fetchLeaderboard({ quizId, limit, playerId: currentPlayerId, period })
      .then((res) => {
        setEntries(res.leaderboard);
        setViewer(res.viewer ?? null);
        if (res.seasonId) setSeasonId(res.seasonId);
      })
      .catch(() => {
        setEntries([]);
        setViewer(null);
      })
      .finally(() => setLoading(false));
  }, [quizId, limit, currentPlayerId, refreshToken, period]);

  const handleReport = async (entry: LeaderboardEntry) => {
    if (
      entry.playerId === currentPlayerId ||
      hasReportedPlayer(entry.playerId) ||
      reportedIds.has(entry.playerId)
    ) {
      return;
    }
    setReportBusyId(entry.playerId);
    const result = await reportDisplayName({
      reportedPlayerId: entry.playerId,
      reportedDisplayName: entry.displayName,
      reporterPlayerId: currentPlayerId,
    });
    setReportBusyId(null);
    if (!result.ok) return;

    markPlayerReported(entry.playerId);
    setReportedIds((prev) => new Set(prev).add(entry.playerId));

    if (result.masked) {
      setEntries((prev) =>
        prev.map((e) =>
          e.playerId === entry.playerId
            ? { ...e, displayName: t('leaderboard.maskedName') }
            : e
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="leaderboard">
        <PeriodTabs period={period} onChange={setPeriod} seasonId={seasonId} />
        <p className="leaderboard-empty">{t('common.loading')}</p>
      </div>
    );
  }

  if (entries.length === 0 && !viewer) {
    return (
      <div className="leaderboard">
        <PeriodTabs period={period} onChange={setPeriod} seasonId={seasonId} />
        <p className="leaderboard-empty">{t('leaderboard.emptyPeriod')}</p>
      </div>
    );
  }

  const viewerInList = viewer
    ? entries.some((e) => e.playerId === viewer.entry.playerId && e.quizId === viewer.entry.quizId)
    : false;

  return (
    <div className="leaderboard">
      <PeriodTabs period={period} onChange={setPeriod} seasonId={seasonId} />
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
              <th className="leaderboard__report-col">
                <span className="visually-hidden">{t('leaderboard.report')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const isSelf = entry.playerId === currentPlayerId;
              const alreadyReported =
                hasReportedPlayer(entry.playerId) || reportedIds.has(entry.playerId);
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
                  <td className="leaderboard__report-cell">
                    {!isSelf && (
                      <button
                        type="button"
                        className="leaderboard__report-btn"
                        disabled={alreadyReported || reportBusyId === entry.playerId}
                        onClick={() => void handleReport(entry)}
                        title={t('leaderboard.reportHint')}
                        aria-label={t('leaderboard.reportAria', {
                          name: entry.displayName,
                        })}
                      >
                        {alreadyReported
                          ? t('leaderboard.reported')
                          : t('leaderboard.report')}
                      </button>
                    )}
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

function PeriodTabs({
  period,
  onChange,
  seasonId,
}: {
  period: LeaderboardPeriod;
  onChange: (p: LeaderboardPeriod) => void;
  seasonId: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="leaderboard__header">
      <h3 className="leaderboard__title">{t('leaderboard.title')}</h3>
      <p className="leaderboard__season">
        {t('leaderboard.seasonLabel', { season: seasonId })}
      </p>
      <div
        className="leaderboard__periods"
        role="group"
        aria-label={t('leaderboard.periodFilter')}
      >
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            className={`leaderboard__period-chip${period === p ? ' is-active' : ''}`}
            aria-pressed={period === p}
            onClick={() => onChange(p)}
          >
            {t(`leaderboard.period_${p}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
