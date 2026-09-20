import { useTranslation } from 'react-i18next';
import type { AdminReportRow } from '../../utils/adminReportsApi';

interface AdminReportsPanelProps {
  reports: AdminReportRow[];
  loading: boolean;
  error: string;
  busyId: string | null;
  onRefresh: () => void;
  onModerate: (action: 'mask' | 'dismiss', playerId: string) => void;
}

/**
 * Reports tab: name-report moderation list.
 */
export function AdminReportsPanel({
  reports,
  loading,
  error,
  busyId,
  onRefresh,
  onModerate,
}: AdminReportsPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="admin__reports" data-testid="admin-reports">
      <p className="admin__hint">{t('admin.reportsIntro')}</p>
      <div className="btn-row">
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={onRefresh}
          disabled={loading}
        >
          {t('admin.reportsRefresh')}
        </button>
      </div>
      {loading && <p className="admin__hint">{t('common.loading')}</p>}
      {error && <p className="admin__error">{error}</p>}
      {!loading && !error && reports.length === 0 && (
        <p className="admin__hint">{t('admin.reportsEmpty')}</p>
      )}
      {reports.length > 0 && (
        <ul className="admin__report-list">
          {reports.map((row) => (
            <li key={row.playerId} className="admin__report-row">
              <div className="admin__report-meta">
                <strong>{row.displayName}</strong>
                <span className="admin__report-id">{row.playerId}</span>
                <span>
                  {t('admin.reportsCount', { count: row.reportCount })}
                </span>
                <span className="admin__hint">
                  {new Date(row.lastReportedAt).toLocaleString()}
                </span>
                {row.reasons.length > 0 && (
                  <span className="admin__hint">
                    {row.reasons.join(' · ')}
                  </span>
                )}
              </div>
              <div className="btn-row">
                <button
                  type="button"
                  className="btn btn--primary btn--small"
                  disabled={busyId === row.playerId}
                  onClick={() => onModerate('mask', row.playerId)}
                >
                  {t('admin.reportsMask')}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  disabled={busyId === row.playerId}
                  onClick={() => onModerate('dismiss', row.playerId)}
                >
                  {t('admin.reportsDismiss')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
