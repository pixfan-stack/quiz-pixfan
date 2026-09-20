import type { CSSProperties } from 'react';
import type { TFunction } from 'i18next';
import type { QuizResult } from '../../types/quiz';
import type { MasteryNextTarget } from '../../utils/mastery';

interface ResultHeroProps {
  result: QuizResult;
  messageKey: string;
  badgeKey: string;
  masteryKey: string | null;
  masteryNext: MasteryNextTarget | null;
  displayName: string;
  t: TFunction;
}

export function ResultHero({
  result,
  messageKey,
  badgeKey,
  masteryKey,
  masteryNext,
  displayName,
  t,
}: ResultHeroProps) {
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
