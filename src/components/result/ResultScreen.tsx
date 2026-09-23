import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { pickLocale } from '../../utils/locale';
import {
  getPerformanceMessageKey,
  getResultBadgeKey,
} from '../../utils/scoring';
import {
  dismissResultReengage,
  shouldShowResultReengage,
} from '../../utils/reengage';
import { resolveDisplayNameForSubmit } from '../../utils/player';
import { isDuelQuizId } from '../../utils/duel';
import { compareDuelScores } from '../../utils/duelOutcome';
import { isDailyQuizId } from '../../utils/dailyChallenge';
import {
  masteryLabelKey,
  masteryTierFromPercent,
  nextMasteryTarget,
} from '../../utils/mastery';
import { Leaderboard } from '../Leaderboard';
import { MistakesReview } from '../MistakesReview';
import { AchievementsPanel } from '../AchievementsPanel';
import { PixfanCta } from '../PixfanCta';
import { ResultHero } from './ResultHero';
import { ResultShareSection } from './ResultShareSection';
import type { ResultScreenProps } from './types';
import { useResultScreenEffects } from './useResultScreenEffects';
import { useResultShareActions } from './useResultShareActions';
import {
  getMistakeVaultCount,
  isWeakSpotsQuizId,
} from '../../utils/mistakeVault';
import { trackHabitEvent } from '../../utils/analyticsApi';

/**
 * Post-quiz results: score, message, high-score banner, confetti, social share, export.
 */
export function ResultScreen({
  quiz,
  result,
  onRetry,
  onHome,
  onPlayDaily,
  onPlayWeakSpots,
  onScoreSubmitted,
  categoryQuizIds = [],
  quizzes = [],
  targetScore = null,
}: ResultScreenProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const langCode = (lang.startsWith('fr') ? 'fr' : 'en') as 'en' | 'fr';
  const quizTitle = pickLocale(quiz.title, lang);
  const messageKey = getPerformanceMessageKey(result.percentage);
  const badgeKey = getResultBadgeKey(result.percentage);
  const isDuel = isDuelQuizId(result.quizId);
  const isDaily = isDailyQuizId(result.quizId);
  const duelOutcome =
    targetScore != null
      ? compareDuelScores(result.percentage, targetScore)
      : null;

  const displayName = resolveDisplayNameForSubmit(lang);
  const [showReengage, setShowReengage] = useState(() =>
    shouldShowResultReengage(result.quizId)
  );

  const isCategoryQuiz = categoryQuizIds.includes(result.quizId);
  const effectiveBest = Math.max(
    result.percentage,
    result.previousBest ?? 0
  );
  const masteryNext = isCategoryQuiz
    ? nextMasteryTarget(effectiveBest)
    : null;
  const masteryTier = isCategoryQuiz
    ? masteryTierFromPercent(effectiveBest)
    : 'none';
  const masteryKey = masteryLabelKey(masteryTier);

  const {
    shareGrid,
    linkCopied,
    challengeCopied,
    shareFallbackCopied,
    gridCopied,
    handleCopyDailyGrid,
    handleShare,
    handleNativeShare,
    handleCopyDuelLink,
    handleChallengeFriend,
    handleExportImage,
  } = useResultShareActions({
    result,
    quiz,
    quizTitle,
    langCode,
    quizzes,
    t,
  });

  const {
    leaderboardRefresh,
    newAchievements,
    dailyStreak,
    freezeConsumed,
    vaultSaved,
    vaultCleared,
    dailyCountdown,
    isAnimating,
    canvasRef,
  } = useResultScreenEffects({
    result,
    categoryQuizIds,
    displayName,
    onScoreSubmitted,
    isDaily,
    langCode,
  });

  const showWeakSpotsCta =
    Boolean(onPlayWeakSpots) &&
    !isWeakSpotsQuizId(result.quizId) &&
    (getMistakeVaultCount() > 0 || vaultSaved > 0);

  return (
    <>
      {isAnimating && (
        <canvas
          ref={canvasRef}
          className="confetti-canvas"
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}

      <section className="result-section">
        <div className="card result-card">
          <ResultHero
            result={result}
            messageKey={messageKey}
            badgeKey={badgeKey}
            masteryKey={masteryKey}
            masteryNext={masteryNext}
            displayName={displayName}
            t={t}
          />

          {result.isNewHighScore && (
            <div className="highscore-banner" role="status">
              ★ {t('result.newHighScore')}
              {result.previousBest !== null && (
                <div className="highscore-banner__sub">
                  {t('result.previousBest', { percent: result.previousBest })}
                </div>
              )}
            </div>
          )}

          {duelOutcome && targetScore != null && (
            <div
              className={`duel-outcome duel-outcome--${duelOutcome}`}
              role="status"
            >
              <p className="duel-outcome__title">
                {t(`result.duel_${duelOutcome}`)}
              </p>
              <p className="duel-outcome__detail">
                {t('result.duelTarget', {
                  yours: result.percentage,
                  theirs: targetScore,
                })}
              </p>
            </div>
          )}

          {isDaily && (
            <div className="daily-ceremony" role="status">
              <p className="daily-ceremony__title">
                {t('result.dailyCeremonyTitle')}
              </p>
              {dailyStreak > 0 && (
                <p className="result-daily-streak">
                  {t('result.dailyStreak', { count: dailyStreak })}
                </p>
              )}
              {freezeConsumed && (
                <p className="result-daily-freeze" role="status">
                  {t('result.streakFreezeConsumed')}
                </p>
              )}
              {shareGrid && (
                <pre className="daily-ceremony__grid" aria-label={t('result.dailyGridLabel')}>
                  {shareGrid}
                </pre>
              )}
              <p className="daily-ceremony__countdown">
                {t('result.dailyCountdown', { time: dailyCountdown })}
              </p>
              <p className="daily-ceremony__hint">
                {t('result.comeBackTomorrow')}
              </p>
            </div>
          )}

          {vaultSaved > 0 && (
            <p className="result-vault-saved" role="status">
              {t('result.vaultSaved', { count: vaultSaved })}
            </p>
          )}
          {vaultCleared > 0 && (
            <p className="result-vault-cleared" role="status">
              {t('result.vaultCleared', { count: vaultCleared })}
            </p>
          )}

          {newAchievements.length > 0 && (
            <div className="result-achievements-unlock" role="status">
              <p className="result-achievements-unlock__title">
                {t('result.newAchievements')}
              </p>
              <AchievementsPanel highlightIds={newAchievements} compact />
            </div>
          )}

          {showReengage && (
            <div className="reengage-banner" role="status">
              <div className="reengage-banner__body">
                <p className="reengage-banner__title">
                  {t('result.reengageTitle')}
                </p>
                <p className="reengage-banner__desc">
                  {t('result.reengageDesc')}
                </p>
              </div>
              <div className="reengage-banner__actions">
                <button
                  type="button"
                  className="btn btn--secondary btn--small"
                  onClick={() => {
                    dismissResultReengage();
                    setShowReengage(false);
                    if (onPlayDaily) onPlayDaily();
                    else onHome();
                  }}
                >
                  {t('result.reengageCta')}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => {
                    dismissResultReengage();
                    setShowReengage(false);
                  }}
                >
                  {t('result.reengageDismiss')}
                </button>
              </div>
            </div>
          )}

          <MistakesReview
            mistakes={result.mistakes ?? []}
            quizId={result.quizId}
          />

          <ResultShareSection
            isDaily={isDaily}
            isDuel={isDuel}
            quizzesLength={quizzes.length}
            gridCopied={gridCopied}
            challengeCopied={challengeCopied}
            linkCopied={linkCopied}
            shareFallbackCopied={shareFallbackCopied}
            onCopyDailyGrid={handleCopyDailyGrid}
            onChallengeFriend={handleChallengeFriend}
            onCopyDuelLink={handleCopyDuelLink}
            onNativeShare={handleNativeShare}
            onExportImage={handleExportImage}
            onShare={handleShare}
            t={t}
          />

          <PixfanCta
            quizId={result.quizId}
            percentage={result.percentage}
            mistakeQuestionIds={(result.mistakes ?? [])
              .filter((m) => !m.wasCorrect)
              .map((m) => m.question.id)}
          />

          {showWeakSpotsCta && (
            <div className="result-weak-spots-cta">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  void trackHabitEvent('weak_spots_cta');
                  onPlayWeakSpots?.();
                }}
              >
                {t('result.reviewWeakSpots')}
              </button>
            </div>
          )}

          <Leaderboard
            quizId={result.quizId}
            limit={10}
            quizzes={[quiz]}
            refreshToken={leaderboardRefresh}
          />

          <div className="btn-row">
            <button type="button" className="btn btn--primary" onClick={onRetry}>
              {isDuel || targetScore != null
                ? t('result.rematch')
                : t('result.retry')}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onHome}
            >
              {t('result.backHome')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
