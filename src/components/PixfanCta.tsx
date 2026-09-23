import { useTranslation } from 'react-i18next';
import { getPixfanCta, type PixfanCtaTarget } from '../utils/pixfanCta';
import { trackCtaClick } from '../utils/analyticsApi';

interface PixfanCtaProps {
  quizId: string;
  /** Score % — softens copy for low scores. */
  percentage: number;
  /** Question ids answered incorrectly (failed-theme targeting). */
  mistakeQuestionIds?: string[];
}

/**
 * One clear post-score path: guide on the failed theme → newsletter.
 */
export function PixfanCta({
  quizId,
  percentage,
  mistakeQuestionIds = [],
}: PixfanCtaProps) {
  const { t } = useTranslation();
  const cta = getPixfanCta(quizId, { mistakeQuestionIds });
  const tone = percentage < 60 ? 'improve' : 'goFurther';
  const titleKey = cta.fromMistakes
    ? `pixfan.${tone}FailedTitle`
    : `pixfan.${tone}Title`;
  const primaryCtaKey =
    cta.primaryTarget === 'guide'
      ? `pixfan.topic_${cta.topic}_guideCta`
      : `pixfan.topic_${cta.topic}_cta`;

  const onCtaClick = (target: PixfanCtaTarget) => {
    void trackCtaClick({
      sourceQuizId: quizId,
      target,
      topic: cta.topic,
    });
  };

  return (
    <aside className="pixfan-cta" aria-labelledby="pixfan-cta-title">
      <p className="pixfan-cta__eyebrow">{t('pixfan.eyebrow')}</p>
      <h3 id="pixfan-cta-title" className="pixfan-cta__title">
        {t(titleKey)}
      </h3>
      <p className="pixfan-cta__lead">
        {cta.fromMistakes
          ? t(`pixfan.topic_${cta.topic}_failedDesc`)
          : t(`pixfan.topic_${cta.topic}_desc`)}
      </p>

      <div className="pixfan-cta__actions">
        <a
          className="btn btn--primary pixfan-cta__primary"
          href={cta.primaryUrl}
          target={cta.primaryTarget === 'guide' ? undefined : '_blank'}
          rel={
            cta.primaryTarget === 'guide' ? undefined : 'noopener noreferrer'
          }
          onClick={() => onCtaClick(cta.primaryTarget)}
        >
          {t(primaryCtaKey)}
          <span aria-hidden="true"> →</span>
        </a>
        {cta.secondaryUrl && cta.secondaryTarget ? (
          <a
            className="btn btn--ghost"
            href={cta.secondaryUrl}
            target={
              cta.secondaryTarget === 'guide' ? undefined : '_blank'
            }
            rel={
              cta.secondaryTarget === 'guide'
                ? undefined
                : 'noopener noreferrer'
            }
            onClick={() => onCtaClick(cta.secondaryTarget!)}
          >
            {cta.secondaryTarget === 'newsletter'
              ? t('pixfan.newsletterCta')
              : t(`pixfan.topic_${cta.topic}_secondaryCta`)}
            <span aria-hidden="true"> →</span>
          </a>
        ) : null}
      </div>

      {/* Soft newsletter block — skip when secondary is already newsletter. */}
      {cta.secondaryTarget !== 'newsletter' ? (
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
            onClick={() => onCtaClick('newsletter')}
          >
            {t('pixfan.newsletterCta')}
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      ) : null}
    </aside>
  );
}
