import { useCallback, useEffect, type CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz, QuizResult } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import {
  getPerformanceMessageKey,
  getResultBadgeKey,
} from '../utils/scoring';
import {
  canNativeShare,
  copySharePayload,
  nativeShareScore,
  openShare,
  socialShareUrl,
  resolveShareKind,
  shareTextKey,
  type SharePlatform,
} from '../utils/share';
import {
  dismissResultReengage,
  markQuizPlayed,
  shouldShowResultReengage,
} from '../utils/reengage';
import { submitRemoteHighScore } from '../utils/highscoreApi';
import { trackQuizAttempt } from '../utils/analyticsApi';
import { getPlayerId, resolveDisplayNameForSubmit } from '../utils/player';
import { useConfetti } from '../hooks/useConfetti';
import {
  exportResultAsImage,
  downloadResultImage,
  shareResultImage,
  type ExportImageFormat,
} from '../utils/exportResult';
import { Leaderboard } from './Leaderboard';
import { MistakesReview } from './MistakesReview';
import { AchievementsPanel } from './AchievementsPanel';
import { PixfanCta } from './PixfanCta';
import { getAllHighScores } from '../utils/highscore';
import { recordDailyCompletion } from '../utils/dailyStreak';
import {
  unlockAchievements,
  type AchievementId,
} from '../utils/achievements';
import {
  buildDuelQuiz,
  createDuelSeed,
  isDuelQuizId,
} from '../utils/duel';
import { compareDuelScores } from '../utils/duelOutcome';
import {
  formatDailyCountdown,
  isDailyQuizId,
  msUntilNextDaily,
} from '../utils/dailyChallenge';
import { recordMistakes } from '../utils/mistakeVault';
import {
  buildDailyResultShareBlock,
  formatResultShareGrid,
} from '../utils/resultShareGrid';

interface ResultScreenProps {
  quiz: Quiz;
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
  /** Start today’s daily challenge (re-engage CTA). */
  onPlayDaily?: () => void;
  onScoreSubmitted?: () => void;
  /** Category quiz ids for explorer / expert-trio achievements. */
  categoryQuizIds?: string[];
  /** Full quiz catalog — needed to create a friend duel from results. */
  quizzes?: Quiz[];
  /** Challenger score to beat (shared duel). */
  targetScore?: number | null;
}

const SHARE_PLATFORMS: {
  id: SharePlatform;
  labelKey: string;
  className: string;
  icon: string;
}[] = [
  {
    id: 'twitter',
    labelKey: 'result.share_twitter',
    className: 'share-btn--twitter',
    icon: '𝕏',
  },
  {
    id: 'facebook',
    labelKey: 'result.share_facebook',
    className: 'share-btn--facebook',
    icon: 'f',
  },
  {
    id: 'linkedin',
    labelKey: 'result.share_linkedin',
    className: 'share-btn--linkedin',
    icon: 'in',
  },
  {
    id: 'whatsapp',
    labelKey: 'result.share_whatsapp',
    className: 'share-btn--whatsapp',
    icon: '☎',
  },
];

/**
 * Post-quiz results: score, message, high-score banner, confetti, social share, export.
 */
export function ResultScreen({
  quiz,
  result,
  onRetry,
  onHome,
  onPlayDaily,
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
  const shareKind = resolveShareKind(result.quizId);
  const shareUrl = socialShareUrl(result.quizId, {
    score: result.percentage,
    lang: langCode,
  });

  const displayName = resolveDisplayNameForSubmit(lang);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [challengeCopied, setChallengeCopied] = useState(false);
  const [shareFallbackCopied, setShareFallbackCopied] = useState(false);
  const [newAchievements, setNewAchievements] = useState<AchievementId[]>([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [vaultSaved, setVaultSaved] = useState(0);
  const [dailyCountdown, setDailyCountdown] = useState(() =>
    formatDailyCountdown(msUntilNextDaily(), langCode)
  );
  const [showReengage, setShowReengage] = useState(() =>
    shouldShowResultReengage(result.quizId)
  );
  const [gridCopied, setGridCopied] = useState(false);

  const shareGrid = formatResultShareGrid(result.answerMarks ?? []);
  const shareText = t(shareTextKey(shareKind), {
    score: result.correctCount,
    total: result.totalQuestions,
    percent: result.percentage,
    quizTitle,
  });
  const shareHashtags = t('share.hashtags');

  const buildScorePayload = useCallback(
    () => ({
      text: shareGrid ? `${shareText}\n${shareGrid}` : shareText,
      url: shareUrl,
      hashtags: shareHashtags,
    }),
    [shareText, shareUrl, shareHashtags, shareGrid]
  );

  const handleCopyDailyGrid = useCallback(async () => {
    const dateLabel = result.quizId.replace(/^daily-/, '');
    const block = buildDailyResultShareBlock({
      dateLabel,
      percent: result.percentage,
      marks: result.answerMarks ?? [],
      url: shareUrl,
      lang: langCode,
    });
    try {
      await navigator.clipboard.writeText(block);
      setGridCopied(true);
      window.setTimeout(() => setGridCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [
    langCode,
    result.answerMarks,
    result.percentage,
    result.quizId,
    shareUrl,
  ]);

  const handleShare = (platform: SharePlatform) => {
    openShare(platform, buildScorePayload());
  };

  const handleNativeShare = useCallback(async () => {
    const payload = buildScorePayload();
    const outcome = await nativeShareScore(payload, t('app.title'));
    if (outcome === 'shared' || outcome === 'aborted') return;
    const ok = await copySharePayload(payload);
    if (ok) {
      setShareFallbackCopied(true);
      window.setTimeout(() => setShareFallbackCopied(false), 2000);
    }
  }, [buildScorePayload, t]);

  const handleCopyDuelLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore
    }
    // Prefer native share of the duel challenge
    if (canNativeShare()) {
      await nativeShareScore(
        {
          text: t(shareTextKey('duel'), {
            score: result.correctCount,
            total: result.totalQuestions,
            percent: result.percentage,
            quizTitle,
          }),
          url: shareUrl,
        },
        t('app.title')
      );
    }
  }, [
    shareUrl,
    t,
    result.correctCount,
    result.totalQuestions,
    result.percentage,
    quizTitle,
  ]);

  const handleChallengeFriend = useCallback(async () => {
    if (quizzes.length === 0) return;
    const seed = createDuelSeed();
    const duel = buildDuelQuiz(quizzes, seed);
    const url = socialShareUrl(duel.id, {
      score: result.percentage,
      lang: langCode,
    });
    const text = t(shareTextKey('challenge'), {
      score: result.correctCount,
      total: result.totalQuestions,
      percent: result.percentage,
      quizTitle,
    });
    const payload = { text, url, hashtags: t('share.hashtags') };

    try {
      await navigator.clipboard.writeText(url);
      setChallengeCopied(true);
      window.setTimeout(() => setChallengeCopied(false), 2500);
    } catch {
      // ignore
    }

    const outcome = await nativeShareScore(payload, t('app.title'));
    if (outcome === 'unavailable') {
      openShare('whatsapp', payload);
    }
  }, [
    quizzes,
    t,
    result.correctCount,
    result.totalQuestions,
    result.percentage,
    quizTitle,
    langCode,
  ]);

  // Daily streak + achievements + mistake vault (local)
  useEffect(() => {
    markQuizPlayed();
    const streakState = recordDailyCompletion(result.quizId);
    setDailyStreak(streakState.currentStreak);
    const newly = unlockAchievements({
      quizId: result.quizId,
      percentage: result.percentage,
      categoryQuizIds,
      highscores: getAllHighScores(),
      streak: streakState,
    });
    setNewAchievements(newly);
    setVaultSaved(recordMistakes(result.mistakes ?? []));
  }, [result.quizId, result.percentage, result.mistakes, categoryQuizIds]);

  useEffect(() => {
    if (!isDaily) return;
    const tick = () =>
      setDailyCountdown(formatDailyCountdown(msUntilNextDaily(), langCode));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isDaily, langCode]);

  // Sync to Cloudflare D1 + analytics
  useEffect(() => {
    void submitRemoteHighScore({
      quizId: result.quizId,
      playerId: getPlayerId(),
      displayName,
      percentage: result.percentage,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
    })
      .then((ok) => {
        if (ok) {
          setLeaderboardRefresh((n) => n + 1);
          onScoreSubmitted?.();
        }
      })
      .catch(() => {});

    void trackQuizAttempt({
      quizId: result.quizId,
      percentage: result.percentage,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      timeTakenSeconds: result.timeTakenSeconds,
    });
  }, [result, displayName, onScoreSubmitted]);

  // Confetti for perfect scores
  const { fire, isAnimating, canvasRef } = useConfetti();
  const [hasFired, setHasFired] = useState(false);

  useEffect(() => {
    if (result.percentage === 100 && !hasFired) {
      fire(120);
      setHasFired(true);
    }
  }, [result.percentage, hasFired, fire]);

  const handleExportImage = useCallback(
    async (format: ExportImageFormat) => {
      try {
        const blob = await exportResultAsImage(result, quiz, langCode, format);
        const payload = buildScorePayload();
        const shared = await shareResultImage(blob, {
          title: t('app.title'),
          text: payload.text,
          url: payload.url,
          fileName: `quiz-pixfan-${format}.png`,
        });
        if (!shared) {
          downloadResultImage(blob, quiz.id, format);
        }
      } catch {
        // Silently fail — not critical
      }
    },
    [result, quiz, langCode, t, buildScorePayload]
  );

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
              {(result.answerMarks?.length ?? 0) > 0 && (
                <button
                  type="button"
                  className="btn btn--secondary btn--small"
                  onClick={() => void handleCopyDailyGrid()}
                >
                  {gridCopied
                    ? t('result.dailyGridCopied')
                    : t('result.copyDailyGrid')}
                </button>
              )}
            </div>
          )}

          {vaultSaved > 0 && (
            <p className="result-vault-saved" role="status">
              {t('result.vaultSaved', { count: vaultSaved })}
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
                  className="btn btn--primary btn--small"
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

          <MistakesReview mistakes={result.mistakes ?? []} />

          <div className="share-section">
            <h3 className="share-section__title">{t('result.shareTitle')}</h3>

            <div className="share-primary">
              {isDuel ? (
                <>
                  <button
                    type="button"
                    className="btn btn--primary btn--block"
                    onClick={() => void handleCopyDuelLink()}
                  >
                    <span className="btn__icon" aria-hidden="true">
                      ⚔️
                    </span>
                    {linkCopied
                      ? t('result.linkCopied')
                      : t('result.sendDuelLink')}
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary btn--block"
                    onClick={() => void handleNativeShare()}
                  >
                    <span className="btn__icon" aria-hidden="true">
                      ↗
                    </span>
                    {shareFallbackCopied
                      ? t('result.linkCopied')
                      : t('result.sharePrimary')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn--primary btn--block"
                    onClick={() => void handleNativeShare()}
                  >
                    <span className="btn__icon" aria-hidden="true">
                      ↗
                    </span>
                    {shareFallbackCopied
                      ? t('result.linkCopied')
                      : t('result.sharePrimary')}
                  </button>
                  {quizzes.length > 0 && (
                    <button
                      type="button"
                      className="btn btn--secondary btn--block"
                      onClick={() => void handleChallengeFriend()}
                    >
                      <span className="btn__icon" aria-hidden="true">
                        ⚔️
                      </span>
                      {challengeCopied
                        ? t('result.challengeLinkCopied')
                        : t('result.challengeFriend')}
                    </button>
                  )}
                </>
              )}
            </div>

            <div className="export-section">
              <button
                type="button"
                className="btn btn--ghost btn--block"
                onClick={() => void handleExportImage('square')}
              >
                <span className="btn__icon" aria-hidden="true">
                  📸
                </span>
                {t('result.exportImage')}
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--block"
                onClick={() => void handleExportImage('story')}
              >
                <span className="btn__icon" aria-hidden="true">
                  ▢
                </span>
                {t('result.exportStory')}
              </button>
            </div>

            <p className="share-section__platforms-label">
              {t('result.shareAlso')}
            </p>
            <div className="share-grid">
              {SHARE_PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`btn share-btn ${p.className}`}
                  onClick={() => handleShare(p.id)}
                >
                  <span className="btn__icon" aria-hidden="true">
                    {p.icon}
                  </span>
                  {t(p.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <PixfanCta quizId={result.quizId} percentage={result.percentage} />

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
