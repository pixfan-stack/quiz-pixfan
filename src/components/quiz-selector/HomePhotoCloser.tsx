import { useTranslation } from 'react-i18next';
import { hasCompletedAnyQuiz } from '../../utils/reengage';

interface HomePhotoCloserProps {
  photoPackAvailable: boolean;
  dailyPlayed: boolean;
  dailyCountdown: string;
  onStartPhotoReading: () => void;
  onStartDaily: () => void;
  onPrefetchQuiz?: () => void;
}

/**
 * End-of-scroll closer for first-timers: invite another photo / daily
 * instead of a soft-social achievements + leaderboard wall.
 */
export function HomePhotoCloser({
  photoPackAvailable,
  dailyPlayed,
  dailyCountdown,
  onStartPhotoReading,
  onStartDaily,
  onPrefetchQuiz,
}: HomePhotoCloserProps) {
  const { t } = useTranslation();
  if (hasCompletedAnyQuiz()) return null;

  return (
    <section
      className="home-photo-closer"
      aria-labelledby="home-photo-closer-title"
      data-testid="home-photo-closer"
    >
      <h3 id="home-photo-closer-title" className="home-photo-closer__title">
        {t('home.photoCloserTitle')}
      </h3>
      <p className="home-photo-closer__desc">{t('home.photoCloserDesc')}</p>
      <div className="home-photo-closer__actions">
        {photoPackAvailable && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={onStartPhotoReading}
            onMouseEnter={onPrefetchQuiz}
            onFocus={onPrefetchQuiz}
            data-testid="home-photo-closer-photo"
          >
            {t('home.photoCloserPhoto')}
            <span aria-hidden="true"> →</span>
          </button>
        )}
        <button
          type="button"
          className="btn btn--secondary"
          onClick={onStartDaily}
          onMouseEnter={onPrefetchQuiz}
          onFocus={onPrefetchQuiz}
          data-testid="home-photo-closer-daily"
        >
          {dailyPlayed
            ? t('home.photoCloserDailySoon', { time: dailyCountdown })
            : t('home.photoCloserDaily')}
        </button>
      </div>
    </section>
  );
}
