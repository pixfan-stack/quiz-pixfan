import { useTranslation } from 'react-i18next';
import { getPixfanCta } from '../utils/pixfanCta';

interface PixfanCtaProps {
  quizId: string;
  /** Score % — softens copy for low scores. */
  percentage: number;
}

/**
 * Contextual pixfan.com next-step after a quiz (guides + newsletter).
 */
export function PixfanCta({ quizId, percentage }: PixfanCtaProps) {
  const { t } = useTranslation();
  const cta = getPixfanCta(quizId);
  const tone = percentage < 60 ? 'improve' : 'goFurther';

  return (
    <aside className="pixfan-cta" aria-labelledby="pixfan-cta-title">
      <p className="pixfan-cta__eyebrow">pixfan.com</p>
      <h3 id="pixfan-cta-title" className="pixfan-cta__title">
        {t(`pixfan.${tone}Title`)}
      </h3>
      <p className="pixfan-cta__lead">
        {t(`pixfan.topic_${cta.topic}_desc`)}
      </p>

      <div className="pixfan-cta__actions">
        <a
          className="btn btn--primary pixfan-cta__primary"
          href={cta.primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(`pixfan.topic_${cta.topic}_cta`)}
          <span aria-hidden="true"> →</span>
        </a>
        {cta.secondaryUrl && (
          <a
            className="btn btn--ghost"
            href={cta.secondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('pixfan.exploreMore')}
          </a>
        )}
      </div>

      <div className="pixfan-cta__newsletter">
        <p className="pixfan-cta__newsletter-title">
          {t('pixfan.newsletterTitle')}
        </p>
        <p className="pixfan-cta__newsletter-desc">
          {t('pixfan.newsletterDesc')}
        </p>
        <a
          className="pixfan-cta__newsletter-link"
          href={cta.newsletterUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('pixfan.newsletterCta')}
          <span aria-hidden="true"> →</span>
        </a>
      </div>
    </aside>
  );
}
