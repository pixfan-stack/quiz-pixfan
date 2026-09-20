import { useTranslation } from 'react-i18next';
import type { AdminAnalyticsDashboard } from '../../utils/adminAnalyticsApi';

interface AdminAnalyticsPanelProps {
  analytics: AdminAnalyticsDashboard | null;
  loading: boolean;
  error: string;
  quizTitleById: Map<string, string>;
  onRefresh: () => void;
}

/**
 * Analytics tab: attempt summary, CTA breakdown, quiz table, recent days.
 */
export function AdminAnalyticsPanel({
  analytics,
  loading,
  error,
  quizTitleById,
  onRefresh,
}: AdminAnalyticsPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="admin__analytics" data-testid="admin-analytics">
      <p className="admin__hint">{t('admin.analyticsIntro')}</p>
      <div className="btn-row">
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={onRefresh}
          disabled={loading}
        >
          {t('admin.analyticsRefresh')}
        </button>
      </div>
      {loading && <p className="admin__hint">{t('common.loading')}</p>}
      {error && <p className="admin__error">{error}</p>}
      {analytics && !loading && (
        <>
          <div className="admin__analytics-summary">
            <div className="admin__analytics-stat">
              <span className="admin__analytics-stat__value">
                {analytics.summary.totalAttempts}
              </span>
              <span className="admin__analytics-stat__label">
                {t('admin.analyticsAttempts')}
              </span>
            </div>
            <div className="admin__analytics-stat">
              <span className="admin__analytics-stat__value">
                {analytics.summary.avgPercentage}%
              </span>
              <span className="admin__analytics-stat__label">
                {t('admin.analyticsAvgScore')}
              </span>
            </div>
            <div className="admin__analytics-stat">
              <span className="admin__analytics-stat__value">
                {analytics.summary.uniqueQuizzes}
              </span>
              <span className="admin__analytics-stat__label">
                {t('admin.analyticsQuizzes')}
              </span>
            </div>
            <div className="admin__analytics-stat">
              <span className="admin__analytics-stat__value">
                {analytics.summary.ctaClicks}
              </span>
              <span className="admin__analytics-stat__label">
                {t('admin.analyticsCta')}
              </span>
            </div>
          </div>

          {(analytics.cta.byTarget.length > 0 ||
            analytics.cta.byTopic.length > 0) && (
            <div
              className="admin__analytics-cta"
              data-testid="admin-analytics-cta"
            >
              <p className="admin__section-title">
                {t('admin.analyticsCtaBreakdown')}
              </p>
              <p className="admin__hint">{t('admin.analyticsCtaHint')}</p>
              <div className="admin__analytics-cta-grids">
                {analytics.cta.byTarget.length > 0 && (
                  <div className="admin__analytics-table-wrap">
                    <table className="admin__analytics-table">
                      <thead>
                        <tr>
                          <th>{t('admin.analyticsColCtaTarget')}</th>
                          <th>{t('admin.analyticsColClicks')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.cta.byTarget.map((row) => (
                          <tr key={row.target}>
                            <td>
                              <strong>
                                {t(`admin.analyticsCtaTarget_${row.target}`)}
                              </strong>
                              <div className="admin__report-id">
                                {row.target}
                              </div>
                            </td>
                            <td>{row.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {analytics.cta.byTopic.length > 0 && (
                  <div className="admin__analytics-table-wrap">
                    <table className="admin__analytics-table">
                      <thead>
                        <tr>
                          <th>{t('admin.analyticsColCtaTopic')}</th>
                          <th>{t('admin.analyticsColClicks')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.cta.byTopic.map((row) => (
                          <tr key={row.topic}>
                            <td>
                              <strong>{row.topic}</strong>
                            </td>
                            <td>{row.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {analytics.cta.rows.length > 0 && (
                <div className="admin__analytics-table-wrap">
                  <table className="admin__analytics-table">
                    <thead>
                      <tr>
                        <th>{t('admin.analyticsColCtaTarget')}</th>
                        <th>{t('admin.analyticsColCtaTopic')}</th>
                        <th>{t('admin.analyticsColCtaSource')}</th>
                        <th>{t('admin.analyticsColClicks')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.cta.rows.map((row) => (
                        <tr
                          key={`${row.target}:${row.topic}:${row.sourceQuizId}`}
                        >
                          <td>{row.target}</td>
                          <td>{row.topic}</td>
                          <td>
                            <span className="admin__report-id">
                              {row.sourceQuizId}
                            </span>
                          </td>
                          <td>{row.clicks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {analytics.quizzes.length === 0 ? (
            <p className="admin__hint">{t('admin.analyticsEmpty')}</p>
          ) : (
            <div className="admin__analytics-table-wrap">
              <table className="admin__analytics-table">
                <thead>
                  <tr>
                    <th>{t('admin.analyticsColQuiz')}</th>
                    <th>{t('admin.analyticsColAttempts')}</th>
                    <th>{t('admin.analyticsColAvg')}</th>
                    <th>{t('admin.analyticsColTime')}</th>
                    <th>{t('admin.analyticsColLow')}</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.quizzes.map((row) => (
                    <tr key={row.quizId}>
                      <td>
                        <strong>
                          {quizTitleById.get(row.quizId) ?? row.quizId}
                        </strong>
                        <div className="admin__report-id">{row.quizId}</div>
                      </td>
                      <td>{row.attempts}</td>
                      <td>{row.avgPercentage}%</td>
                      <td>{row.avgTimeSeconds}s</td>
                      <td
                        className={
                          row.lowScoreRate >= 40
                            ? 'admin__analytics-low'
                            : undefined
                        }
                      >
                        {row.lowScoreRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {analytics.recentDays.length > 0 && (
            <div className="admin__analytics-days">
              <p className="admin__section-title">
                {t('admin.analyticsRecent')}
              </p>
              <ul className="admin__analytics-day-list">
                {analytics.recentDays.map((day) => (
                  <li key={day.day}>
                    <span>{day.day}</span>
                    <strong>{day.attempts}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
