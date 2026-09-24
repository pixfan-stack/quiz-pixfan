import { useTranslation } from 'react-i18next';
import {
  ACHIEVEMENTS,
  getAchievementProgress,
  getUnlockedAchievements,
  type AchievementId,
} from '../utils/achievements';
import { getMonthPeriodId } from '../utils/leaderboardPeriod';
import {
  getSeasonBadge,
  listSeasonBadges,
  seasonCosmeticIcon,
  seasonCosmeticLabelKey,
} from '../utils/seasonEngagement';

interface AchievementsPanelProps {
  /** Highlight these ids (e.g. just unlocked). */
  highlightIds?: AchievementId[];
  /** When true with highlightIds, only show those achievements. */
  compact?: boolean;
}

/**
 * Local achievements grid — unlocked vs locked — plus season cosmetics.
 */
export function AchievementsPanel({
  highlightIds = [],
  compact = false,
}: AchievementsPanelProps) {
  const { t } = useTranslation();
  const unlocked = getUnlockedAchievements();
  const highlight = new Set(highlightIds);
  const list =
    compact && highlightIds.length > 0
      ? ACHIEVEMENTS.filter((a) => highlight.has(a.id))
      : ACHIEVEMENTS;
  const currentSeasonId = getMonthPeriodId();
  const seasonBadges = compact ? [] : listSeasonBadges();
  const currentSeasonBadge = getSeasonBadge(currentSeasonId);

  return (
    <section
      className={`achievements${compact ? ' achievements--compact' : ''}`}
      aria-labelledby="achievements-title"
    >
      {!compact && (
        <>
          <h3 id="achievements-title" className="achievements__title">
            {t('achievements.title')}
          </h3>
          <p className="achievements__subtitle">
            {t('achievements.progress', {
              unlocked: unlocked.size,
              total: ACHIEVEMENTS.length,
            })}
          </p>
        </>
      )}
      <ul className="achievements__grid">
        {list.map((a) => {
          const isUnlocked = unlocked.has(a.id);
          const isNew = highlight.has(a.id);
          const progress = getAchievementProgress(a.id);
          const showProgress = progress != null && !isUnlocked;
          const pct =
            progress != null && progress.threshold > 0
              ? Math.min(100, (progress.current / progress.threshold) * 100)
              : 0;
          return (
            <li
              key={a.id}
              className={`achievement-card${isUnlocked ? ' is-unlocked' : ' is-locked'}${
                isNew ? ' is-new' : ''
              }`}
            >
              <span className="achievement-card__icon" aria-hidden="true">
                {isUnlocked ? a.icon : '🔒'}
              </span>
              <div className="achievement-card__body">
                <span className="achievement-card__title">
                  {t(a.titleKey)}
                  {isNew && (
                    <span className="achievement-card__new">
                      {t('achievements.new')}
                    </span>
                  )}
                </span>
                <span className="achievement-card__desc">{t(a.descKey)}</span>
                {showProgress && progress && (
                  <div
                    className="achievement-card__progress"
                    data-testid={`achievement-progress-${a.id}`}
                  >
                    <span className="achievement-card__counter">
                      {t('achievements.counter', {
                        current: progress.current,
                        threshold: progress.threshold,
                      })}
                    </span>
                    <span
                      className="achievement-card__bar"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={progress.threshold}
                      aria-valuenow={progress.current}
                      aria-label={t('achievements.counter', {
                        current: progress.current,
                        threshold: progress.threshold,
                      })}
                    >
                      <span
                        className="achievement-card__bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {!compact && (
        <div className="season-badges" data-testid="season-badges">
          <h4 className="season-badges__title">{t('season.badgesTitle')}</h4>
          {seasonBadges.length === 0 ? (
            <p className="season-badges__empty">{t('season.badgesEmpty')}</p>
          ) : (
            <ul className="season-badges__list">
              {seasonBadges.map(({ seasonId, cosmetic }) => (
                <li
                  key={seasonId}
                  className={`season-badge season-badge--${cosmetic}${
                    seasonId === currentSeasonId && currentSeasonBadge
                      ? ' is-current'
                      : ''
                  }`}
                >
                  <span className="season-badge__icon" aria-hidden="true">
                    {seasonCosmeticIcon(cosmetic)}
                  </span>
                  <span className="season-badge__label">
                    {t(seasonCosmeticLabelKey(cosmetic), { season: seasonId })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
