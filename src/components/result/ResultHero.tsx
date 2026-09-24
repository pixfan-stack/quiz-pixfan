import type { CSSProperties } from 'react';
import type { TFunction } from 'i18next';
import type { QuizResult } from '../../types/quiz';
import {
  masteryLabelKey,
  type MasteryNextTarget,
  type ParcoursMastery,
} from '../../utils/mastery';

interface ResultHeroProps {
  result: QuizResult;
  messageKey: string;
  badgeKey: string;
  masteryKey: string | null;
  masteryNext: MasteryNextTarget | null;
  /** Aggregate light+portrait+exposure mastery when finishing a parcours pack. */
  parcoursMastery?: ParcoursMastery | null;
  displayName: string;
  t: TFunction;
}

export function ResultHero({
  result,
  messageKey,
  badgeKey,
  masteryKey,
  masteryNext,
  parcoursMastery = null,
  displayName,
  t,
}: ResultHeroProps) {
  const parcoursKey = parcoursMastery
    ? masteryLabelKey(parcoursMastery.tier)
    : null;
  const masteryRingPct = masteryNext
    ? Math.min(
        100,
        Math.round((masteryNext.current / masteryNext.threshold) * 100)
      )
    : masteryKey
      ? 100
      : null;

  return (
    <>
      <div className="result-hero">
        <h2 className="result-hero__title">{t('result.title')}</h2>

        <div
          className="result-ring"
          style={{ '--p': result.percentage } as CSSProperties}
          role="img"
          aria-label={t('result.percentage', {
            percent: result.percentage,
          })}
        >
          <div className="result-ring__value">
            {result.percentage}
            <span className="result-ring__unit">%</span>
          </div>
        </div>

        {masteryRingPct != null && (
          <div
            className="result-mastery-ring"
            style={{ '--p': masteryRingPct } as CSSProperties}
            role="img"
            aria-label={
              masteryNext
                ? t('result.masteryNext', {
                    need: masteryNext.need,
                    tier: t(`home.mastery_${masteryNext.nextTier}`),
                  })
                : masteryKey
                  ? t(masteryKey)
                  : undefined
            }
          >
            <span className="result-mastery-ring__label">
              {masteryKey ? t(masteryKey) : t('home.mastery_bronze')}
            </span>
          </div>
        )}

        <p className="result-hero__score">
          {t('result.score', {
            score: result.correctCount,
            total: result.totalQuestions,
          })}
        </p>
        <p className="result-hero__message">
          {t(`result.message_${messageKey}`)}
        </p>
        <p
          className={`result-badge result-badge--${badgeKey}`}
          role="status"
        >
          {t(`result.badge_${badgeKey}`)}
        </p>
        {masteryKey && (
          <p className="result-mastery-tier" role="status">
            {t(masteryKey)}
          </p>
        )}
        {masteryNext && (
          <p className="result-mastery-next" role="status">
            {t('result.masteryNext', {
              need: masteryNext.need,
              tier: t(`home.mastery_${masteryNext.nextTier}`),
            })}
          </p>
        )}
        {parcoursMastery && parcoursMastery.played > 0 && (
          <p className="result-parcours-mastery" role="status">
            {t('result.parcoursMastery', {
              average: parcoursMastery.average,
              played: parcoursMastery.played,
              total: 3,
              tier: parcoursKey
                ? t(parcoursKey)
                : t('result.parcoursMasteryNone'),
            })}
          </p>
        )}
        <p className="result-leaderboard-name">
          {t('result.leaderboardAs', { name: displayName })}
        </p>
      </div>

      {result.tabSwitchPenalty != null && result.tabSwitchPenalty > 0 && (
        <p className="result-anticheat-notice" role="status">
          {t('result.antiCheatPenalty', {
            count: result.tabSwitchPenalty,
          })}
        </p>
      )}

      <div
        className="result-stats"
        role="group"
        aria-label={t('result.statsLabel')}
      >
        <div className="result-stat">
          <span className="result-stat__icon" aria-hidden="true">
            ⏱
          </span>
          <span className="result-stat__label">
            {t('result.timeLabel')}
          </span>
          <span className="result-stat__value">
            {result.timeTakenSeconds}s
          </span>
        </div>
        <div className="result-stat">
          <span className="result-stat__icon" aria-hidden="true">
            🔥
          </span>
          <span className="result-stat__label">
            {t('result.streakLabel')}
          </span>
          <span className="result-stat__value">{result.maxStreak}</span>
        </div>
      </div>
    </>
  );
}
