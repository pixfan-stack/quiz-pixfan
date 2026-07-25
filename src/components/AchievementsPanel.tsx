import { useTranslation } from 'react-i18next';
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  type AchievementId,
} from '../utils/achievements';

interface AchievementsPanelProps {
  /** Highlight these ids (e.g. just unlocked). */
  highlightIds?: AchievementId[];
  /** When true with highlightIds, only show those achievements. */
  compact?: boolean;
}

/**
 * Local achievements grid — unlocked vs locked.
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
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
