import { useCallback, useEffect, type CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz, QuizResult } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import {
  getPerformanceMessageKey,
  getResultBadgeKey,
} from '../utils/scoring';
import { openShare, quizShareUrl, type SharePlatform } from '../utils/share';
import { submitRemoteHighScore } from '../utils/highscoreApi';
import { trackQuizAttempt } from '../utils/analyticsApi';
import { getPlayerId, resolveDisplayNameForSubmit } from '../utils/player';
import { useConfetti } from '../hooks/useConfetti';
import {
  exportResultAsImage,
  downloadResultImage,
  shareResultImage,
} from '../utils/exportResult';
import { Leaderboard } from './Leaderboard';
import { MistakesReview } from './MistakesReview';

interface ResultScreenProps {
  quiz: Quiz;
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
  onScoreSubmitted?: () => void;
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
  onScoreSubmitted,
}: ResultScreenProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const quizTitle = pickLocale(quiz.title, lang);
  const messageKey = getPerformanceMessageKey(result.percentage);
  const badgeKey = getResultBadgeKey(result.percentage);
  const shareUrl = quizShareUrl(result.quizId);

  const displayName = resolveDisplayNameForSubmit(lang);
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);

  const shareText = t('share.text', {
    score: result.correctCount,
    total: result.totalQuestions,
    percent: result.percentage,
    quizTitle,
  });

  const handleShare = (platform: SharePlatform) => {
    openShare(platform, {
      text: shareText,
      url: shareUrl,
      hashtags: t('share.hashtags'),
    });
  };

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [shareUrl]);

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

  // Export result as image
  const handleExportImage = useCallback(async () => {
    try {
      const blob = await exportResultAsImage(result, quiz, lang as 'en' | 'fr');
      // Try native share first
      const shared = await shareResultImage(blob, quizTitle, lang as 'en' | 'fr');
      if (!shared) {
        // Fallback to download
        downloadResultImage(blob, quiz.id);
      }
    } catch {
      // Silently fail — not critical
    }
  }, [result, quiz, lang, quizTitle]);

  return (
    <>
      {/* Confetti canvas overlay */}
      {isAnimating && (
        <canvas
          ref={canvasRef}
          className="confetti-canvas"
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
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
              aria-label={t('result.percentage', { percent: result.percentage })}
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
              {t('result.antiCheatPenalty', { count: result.tabSwitchPenalty })}
            </p>
          )}

          <div className="result-stats" role="group" aria-label={t('result.statsLabel')}>
            <div className="result-stat">
              <span className="result-stat__icon" aria-hidden="true">⏱</span>
              <span className="result-stat__label">{t('result.timeLabel')}</span>
              <span className="result-stat__value">{result.timeTakenSeconds}s</span>
            </div>
            <div className="result-stat">
              <span className="result-stat__icon" aria-hidden="true">🔥</span>
              <span className="result-stat__label">{t('result.streakLabel')}</span>
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

          <MistakesReview mistakes={result.mistakes ?? []} />

          <div className="export-section">
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={handleExportImage}
            >
              <span className="btn__icon" aria-hidden="true">📸</span>
              {t('result.exportImage')}
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={handleCopyLink}
            >
              <span className="btn__icon" aria-hidden="true">🔗</span>
              {linkCopied ? t('result.linkCopied') : t('result.copyLink')}
            </button>
          </div>

          <div className="share-section">
            <h3 className="share-section__title">{t('result.shareTitle')}</h3>
            <div className="share-grid">
              {SHARE_PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`btn share-btn ${p.className}`}
                  onClick={() => handleShare(p.id)}
                >
                  <span className="btn__icon" aria-hidden="true">{p.icon}</span>
                  {t(p.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <Leaderboard
            quizId={result.quizId}
            limit={10}
            quizzes={[quiz]}
            refreshToken={leaderboardRefresh}
          />

          <div className="btn-row">
            <button type="button" className="btn btn--primary" onClick={onRetry}>
              {t('result.retry')}
            </button>
            <button type="button" className="btn btn--secondary" onClick={onHome}>
              {t('result.backHome')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
