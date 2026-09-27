import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMonthPeriodId, getSeasonDaysRemaining } from '../utils/leaderboardPeriod';
import {
  dismissSeasonBanner,
  getSeasonBannerKind,
  getSeasonWrapSummary,
  seasonCosmeticIcon,
  seasonCosmeticLabelKey,
  type SeasonBannerKind,
} from '../utils/seasonEngagement';

/**
 * Soft home banner for season start / ending soon / previous-season wrap.
 */
export function SeasonBanner() {
  const { t } = useTranslation();
  const seasonId = useMemo(() => getMonthPeriodId(), []);
  const daysLeft = useMemo(() => getSeasonDaysRemaining(), []);
  const wrap = useMemo(() => getSeasonWrapSummary(), []);
  const [kind, setKind] = useState<SeasonBannerKind | null>(() =>
    getSeasonBannerKind()
  );

  if (!kind) return null;

  const dismiss = () => {
    dismissSeasonBanner(kind);
    setKind(null);
  };

  const daysForCopy = daysLeft <= 0 ? 1 : daysLeft;
  let title: string;
  let desc: string;
  if (kind === 'wrap' && wrap) {
    title = t('season.wrapTitle', { season: wrap.seasonId });
    desc = t('season.wrapDesc', {
      badge: t(seasonCosmeticLabelKey(wrap.cosmetic), {
        season: wrap.seasonId,
      }),
      icon: seasonCosmeticIcon(wrap.cosmetic),
    });
  } else if (kind === 'started') {
    title = t('season.startedTitle', { season: seasonId });
    desc = t('season.startedDesc');
  } else {
    title = t('season.endingTitle', { season: seasonId });
    desc = t('season.endingDesc', { days: daysLeft, count: daysForCopy });
  }

  return (
    <div
      className="install-prompt season-banner"
      role="region"
      aria-label={title}
      aria-live="polite"
      data-testid="season-banner"
      data-kind={kind}
    >
      <div className="install-prompt__body">
        <p className="install-prompt__title">{title}</p>
        <p className="install-prompt__desc">{desc}</p>
      </div>
      <div className="install-prompt__actions">
        <button
          type="button"
          className="btn btn--primary btn--small"
          onClick={() => {
            dismiss();
            document.getElementById('leaderboard')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
        >
          {t('season.seeLeaderboard')}
        </button>
        <button type="button" className="btn btn--ghost btn--small" onClick={dismiss}>
          {t('season.dismiss')}
        </button>
      </div>
    </div>
  );
}
