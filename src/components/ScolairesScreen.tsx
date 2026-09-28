import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz } from '../types/quiz';
import { trackHabitEvent } from '../utils/analyticsApi';
import {
  buildPhotoReadingQuiz,
  isPhotoReadingQuizId,
} from '../utils/photoReading';
import { SCOLAIRES_PARCOURS } from '../utils/scolaires';

interface ScolairesScreenProps {
  quizzes: Quiz[];
  onHome: () => void;
  onStartParcours: (quiz: Quiz) => void;
  classeMode?: boolean;
}

/**
 * In-app school hub (`#/scolaires`) — lists curated parcours, FR-first.
 */
export function ScolairesScreen({
  quizzes,
  onHome,
  onStartParcours,
  classeMode = false,
}: ScolairesScreenProps) {
  const { t } = useTranslation();

  useEffect(() => {
    void trackHabitEvent('scolaires_hub');
  }, []);

  const startParcours = (parcoursId: (typeof SCOLAIRES_PARCOURS)[number]) => {
    void trackHabitEvent(parcoursId.event);
    if (isPhotoReadingQuizId(parcoursId.startQuizId)) {
      const pack = buildPhotoReadingQuiz(quizzes);
      if (pack) onStartParcours(pack);
      return;
    }
    const found = quizzes.find((q) => q.id === parcoursId.startQuizId);
    if (found) onStartParcours(found);
  };

  return (
    <section className="scolaires" data-testid="scolaires-screen">
      <header className="scolaires__header">
        <p className="scolaires__eyebrow">{t('scolaires.eyebrow')}</p>
        <h2 className="page-title">{t('scolaires.title')}</h2>
        <p className="page-subtitle">{t('scolaires.subtitle')}</p>
        {classeMode && (
          <p className="classe-mode-banner" role="status">
            {t('classe.banner')}
          </p>
        )}
      </header>

      <ul className="scolaires__list">
        {SCOLAIRES_PARCOURS.map((parcours) => (
          <li key={parcours.id} className="scolaires__card">
            <div className="scolaires__card-body">
              <h3 className="scolaires__card-title">
                {t(`scolaires.parcours.${parcours.id}.title`)}
                <span className="scolaires__mins">
                  {' '}
                  · {t('scolaires.minutes', { count: parcours.minutes })}
                </span>
              </h3>
              <p className="scolaires__card-desc">
                {t(`scolaires.parcours.${parcours.id}.desc`)}
              </p>
            </div>
            <button
              type="button"
              className="btn btn--primary"
              data-testid={`scolaires-start-${parcours.id}`}
              onClick={() => startParcours(parcours)}
            >
              {t('scolaires.startSeance')}
            </button>
          </li>
        ))}
      </ul>

      <nav className="scolaires__links" aria-label={t('scolaires.moreLinks')}>
        <a className="cta-secondary" href="/guides/scolaires/">
          {t('scolaires.openHub')}
        </a>
        <a className="cta-secondary" href="/guides/scolaires/fiche-seance.html">
          {t('scolaires.printSheet')}
        </a>
        <button type="button" className="btn btn--ghost" onClick={onHome}>
          {t('scolaires.backHome')}
        </button>
      </nav>
    </section>
  );
}
