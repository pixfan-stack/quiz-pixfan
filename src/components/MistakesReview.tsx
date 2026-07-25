import { useTranslation } from 'react-i18next';
import type { AnswerReviewItem } from '../types/quiz';
import { pickLocale } from '../utils/locale';

interface MistakesReviewProps {
  mistakes: AnswerReviewItem[];
}

/**
 * Post-quiz review of incorrect answers with correct options + explanations.
 */
export function MistakesReview({ mistakes }: MistakesReviewProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;

  if (mistakes.length === 0) {
    return (
      <div className="mistakes-review mistakes-review--empty" role="status">
        <h3 className="mistakes-review__title">{t('result.reviewTitle')}</h3>
        <p className="mistakes-review__empty">{t('result.reviewPerfect')}</p>
      </div>
    );
  }

  return (
    <div className="mistakes-review">
      <h3 className="mistakes-review__title">{t('result.reviewTitle')}</h3>
      <p className="mistakes-review__subtitle">
        {t('result.reviewCount', { count: mistakes.length })}
      </p>
      <ol className="mistakes-review__list">
        {mistakes.map((item) => {
          const correctAnswers = item.question.answers.filter((a) =>
            item.question.correctAnswers.includes(a.id)
          );
          const selectedAnswers = item.question.answers.filter((a) =>
            item.selectedIds.includes(a.id)
          );

          return (
            <li key={item.question.id} className="mistakes-review__item">
              <p className="mistakes-review__question">
                {pickLocale(item.question.text, lang)}
              </p>
              {item.timedOut && (
                <p className="mistakes-review__timeout">{t('result.reviewTimedOut')}</p>
              )}
              <p className="mistakes-review__line">
                <span className="mistakes-review__label">{t('result.reviewYourAnswer')}</span>
                {selectedAnswers.length > 0
                  ? selectedAnswers.map((a) => pickLocale(a.text, lang)).join(' · ')
                  : t('result.reviewNoAnswer')}
              </p>
              <p className="mistakes-review__line mistakes-review__line--correct">
                <span className="mistakes-review__label">{t('result.reviewCorrect')}</span>
                {correctAnswers.map((a) => pickLocale(a.text, lang)).join(' · ')}
              </p>
              {item.question.explanation && (
                <p className="mistakes-review__explanation">
                  {pickLocale(item.question.explanation, lang)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
