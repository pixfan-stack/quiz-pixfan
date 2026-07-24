import { useCallback, useEffect, type CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz, QuizResult } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import { getPerformanceMessageKey } from '../utils/scoring';
import {
  APP_SHARE_URL,
  openShare,
  type SharePlatform,
} from '../utils/share';
import { submitRemoteHighScore } from '../utils/highscoreApi';
import { useConfetti } from '../hooks/useConfetti';
import {
  exportResultAsImage,
  downloadResultImage,
  shareResultImage,
} from '../utils/exportResult';
import { Leaderboard } from './Leaderboard';

interface ResultScreenProps {
  quiz: Quiz;
  result: QuizResult;
  onRetry: () => void;
  onHome: () => void;
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
}: ResultScreenProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const quizTitle = pickLocale(quiz.title, lang);
  const messageKey = getPerformanceMessageKey(result.percentage);

  const shareText = t('share.text', {
    score: result.correctCount,
    total: result.totalQuestions,
    percent: result.percentage,
    quizTitle,
  });

  const handleShare = (platform: SharePlatform) => {
    openShare(platform, { text: shareText, url: APP_SHARE_URL, hashtags: t('share.hashtags') });
  };

  // Sync to Cloudflare D1
  useEffect(() => {
    void submitRemoteHighScore({
      quizId: result.quizId,
      percentage: result.percentage,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
    }).catch(() => {});
  }, [result]);

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
          </div>

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

          {/* Export button */}
          <div className="export-section">
            <button
              type="button"
              className="btn btn--ghost btn--block"
              onClick={handleExportImage}
            >
              <span className="btn__icon" aria-hidden="true">📸</span>
              {t('result.exportImage')}
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

          <Leaderboard quizId={result.quizId} limit={10} />

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
