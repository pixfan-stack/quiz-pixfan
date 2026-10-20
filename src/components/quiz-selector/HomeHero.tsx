import { useTranslation } from 'react-i18next';

interface HomeHeroProps {
  photoTeaserUrl?: string | null;
  photoPackAvailable: boolean;
  onStartPhotoReading: () => void;
  onPrefetchQuiz?: () => void;
}

/**
 * First-viewport Persuade surface: brand-first, one photo signal, one CTA group.
 */
export function HomeHero({
  photoTeaserUrl,
  photoPackAvailable,
  onStartPhotoReading,
  onPrefetchQuiz,
}: HomeHeroProps) {
  const { t } = useTranslation();

  return (
    <header
      className={`home-hero${photoTeaserUrl ? ' home-hero--visual' : ''}`}
      data-testid="home-hero"
    >
      {photoTeaserUrl ? (
        <div className="home-hero__media" aria-hidden="true">
          <img
            src={photoTeaserUrl}
            alt=""
            className="home-hero__media-img"
            loading="eager"
            decoding="async"
          />
          <span className="home-hero__media-shade" />
        </div>
      ) : null}

      <div className="home-hero__copy">
        <h2 className="home-hero__brand">{t('app.title')}</h2>
        <p className="home-hero__lead">{t('home.selectQuiz')}</p>
        {photoPackAvailable && (
          <div className="home-hero__cta">
            <button
              type="button"
              className="btn btn--primary home-hero__cta-btn"
              onClick={onStartPhotoReading}
              onMouseEnter={onPrefetchQuiz}
              onFocus={onPrefetchQuiz}
              data-testid="home-hero-cta"
            >
              {t('home.photoReading')}
              <span className="home-hero__cta-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <p className="home-hero__cta-hint">{t('home.photoReadingDesc')}</p>
            <p className="home-hero__reassure" data-testid="home-hero-no-account">
              {t('home.noAccountHint')}
            </p>
            <a
              className="home-hero__teachers"
              href="/guides/scolaires/"
              data-testid="home-hero-scolaires"
            >
              {t('home.teachersCta')}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
