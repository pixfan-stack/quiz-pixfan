import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { HighScoreBadge } from '../HighScoreBadge';
import {
  DAILY_QUESTION_COUNT,
} from '../../utils/dailyChallenge';
import {
  PHOTO_READING_COUNT,
  PHOTO_READING_ID,
} from '../../utils/photoReading';
import { DUEL_QUESTION_COUNT } from '../../utils/duel';
import type { getHighScore } from '../../utils/highscore';
import type { fetchRemoteHighScore } from '../../utils/highscoreApi';

type BestScore =
  | ReturnType<typeof getHighScore>
  | Awaited<ReturnType<typeof fetchRemoteHighScore>>;

interface Teaser {
  imageUrl?: string | null;
}

interface FeaturedQuizCardsProps {
  photoPackAvailable: boolean;
  photoTeaser: Teaser | null;
  photoPoolCount: number;
  dailyTeaser: Teaser | null;
  dailyPlayed: boolean;
  dailyLinkCopied: boolean;
  dailyCountdown: string;
  dailyStreak: number;
  streakFreezes: number;
  dailyId: string;
  getBestScore: (quizId: string) => BestScore;
  onPrefetchQuiz?: () => void;
  onStartPhotoReading: () => void;
  onStartDaily: () => void;
  onStartDuel: () => void;
  onCopyDailyLink: (event: MouseEvent) => void;
}

export function FeaturedQuizCards({
  photoPackAvailable,
  photoTeaser,
  photoPoolCount,
  dailyTeaser,
  dailyPlayed,
  dailyLinkCopied,
  dailyCountdown,
  dailyStreak,
  streakFreezes,
  dailyId,
  getBestScore,
  onPrefetchQuiz,
  onStartPhotoReading,
  onStartDaily,
  onStartDuel,
  onCopyDailyLink,
}: FeaturedQuizCardsProps) {
  const { t } = useTranslation();

  return (
    <ul className="quiz-list quiz-list--featured" aria-label={t('home.featuredSection')}>
      {photoPackAvailable && (
        <li>
          <button
            type="button"
            className="quiz-card quiz-card--photo quiz-card--featured-photo"
            onClick={onStartPhotoReading}
            onMouseEnter={onPrefetchQuiz}
            onFocus={onPrefetchQuiz}
            aria-label={t('home.photoReading')}
          >
            {photoTeaser?.imageUrl ? (
              <span className="quiz-card__teaser quiz-card__teaser--hero" aria-hidden="true">
                <img
                  src={photoTeaser.imageUrl}
                  alt=""
                  className="quiz-card__teaser-img"
                  loading="lazy"
                  decoding="async"
                />
              </span>
            ) : (
              <span className="quiz-card__icon" aria-hidden="true">
                🖼️
              </span>
            )}
            <div className="quiz-card__body">
              <h3 className="quiz-card__title">{t('home.photoReading')}</h3>
              <p className="quiz-card__desc">{t('home.photoReadingDesc')}</p>
            </div>
            <div className="quiz-card__footer">
              <div className="quiz-card__meta">
                <span className="quiz-card__meta-chip quiz-card__meta-chip--learn">
                  {t('home.photoReadingBadge')}
                </span>
                <span className="quiz-card__meta-chip">
                  {t('home.questionsCount', { count: PHOTO_READING_COUNT })}
                </span>
                {photoPoolCount > 0 && (
                  <span className="quiz-card__meta-chip quiz-card__meta-chip--pool">
                    {t('home.photoPoolCount', { count: photoPoolCount })}
                  </span>
                )}
                <HighScoreBadge
                  showEmpty
                  bestScore={getBestScore(PHOTO_READING_ID)}
                />
              </div>
              <span className="quiz-card__cta">
                {t('home.start')}
                <span className="quiz-card__cta-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </div>
          </button>
        </li>
      )}

      <li className="quiz-card-with-copy">
        <button
          type="button"
          className={`quiz-card quiz-card--daily${dailyPlayed ? ' quiz-card--played' : ''}`}
          onClick={onStartDaily}
          onMouseEnter={onPrefetchQuiz}
          onFocus={onPrefetchQuiz}
          aria-label={t('home.dailyChallenge')}
        >
          {dailyTeaser?.imageUrl ? (
            <span className="quiz-card__teaser" aria-hidden="true">
              <img
                src={dailyTeaser.imageUrl}
                alt=""
                className="quiz-card__teaser-img"
                loading="lazy"
                decoding="async"
              />
            </span>
          ) : (
            <span className="quiz-card__icon" aria-hidden="true">
              🗓️
            </span>
          )}
          <div className="quiz-card__body">
            <h3 className="quiz-card__title">{t('home.dailyChallenge')}</h3>
            <p className="quiz-card__desc">
              {dailyLinkCopied
                ? t('home.linkCopied')
                : dailyPlayed
                  ? t('home.dailyPlayedDesc', { time: dailyCountdown })
                  : t('home.dailyChallengeDesc')}
            </p>
          </div>
          <div className="quiz-card__footer">
            <div className="quiz-card__meta">
              <span className="quiz-card__meta-chip">
                {t('home.questionsCount', { count: DAILY_QUESTION_COUNT })}
              </span>
              {dailyStreak > 0 && (
                <span className="quiz-card__meta-chip quiz-card__meta-chip--streak">
                  {t('home.dailyStreak', { count: dailyStreak })}
                </span>
              )}
              {streakFreezes > 0 && (
                <span className="quiz-card__meta-chip quiz-card__meta-chip--freeze">
                  {t('home.streakFreezeAvailable')}
                </span>
              )}
              {dailyPlayed && (
                <span className="quiz-card__meta-chip quiz-card__meta-chip--done">
                  {t('home.dailyPlayed')}
                </span>
              )}
              <HighScoreBadge showEmpty bestScore={getBestScore(dailyId)} />
            </div>
            <span className="quiz-card__cta">
              {dailyPlayed ? t('home.dailyReplay') : t('home.start')}
              <span className="quiz-card__cta-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </div>
        </button>
        <button
          type="button"
          className="quiz-card-copy-btn"
          onClick={(e) => void onCopyDailyLink(e)}
          aria-label={t('home.copyDailyLink')}
          title={t('home.copyDailyLink')}
        >
          {dailyLinkCopied ? '✓' : '🔗'}
        </button>
      </li>

      <li>
        <button
          type="button"
          className="quiz-card quiz-card--duel"
          onClick={onStartDuel}
          onMouseEnter={onPrefetchQuiz}
          onFocus={onPrefetchQuiz}
          aria-label={t('home.duel')}
        >
          <span className="quiz-card__icon" aria-hidden="true">
            ⚔️
          </span>
          <div className="quiz-card__body">
            <h3 className="quiz-card__title">{t('home.duel')}</h3>
            <p className="quiz-card__desc">{t('home.duelDesc')}</p>
          </div>
          <div className="quiz-card__footer">
            <div className="quiz-card__meta">
              <span className="quiz-card__meta-chip">
                {t('home.questionsCount', { count: DUEL_QUESTION_COUNT })}
              </span>
            </div>
            <span className="quiz-card__cta">
              {t('home.start')}
              <span className="quiz-card__cta-arrow" aria-hidden="true">
                →
              </span>
            </span>
          </div>
        </button>
      </li>
    </ul>
  );
}
