import { useTranslation } from 'react-i18next';
import type { Quiz } from '../../types/quiz';
import { pickLocale } from '../../utils/locale';
import { HighScoreBadge } from '../HighScoreBadge';
import { deriveQuizDifficulty } from '../../utils/difficulty';
import type { getHighScore } from '../../utils/highscore';
import type { fetchRemoteHighScore } from '../../utils/highscoreApi';
import { QUIZ_ICON_MARK } from './types';

type BestScore =
  | ReturnType<typeof getHighScore>
  | Awaited<ReturnType<typeof fetchRemoteHighScore>>;

interface LatestQuizzesSectionProps {
  latestQuizzes: Quiz[];
  lang: string;
  getBestScore: (quizId: string) => BestScore;
  onPrefetchQuiz?: () => void;
  onStartQuiz: (quiz: Quiz) => void;
}

export function LatestQuizzesSection({
  latestQuizzes,
  lang,
  getBestScore,
  onPrefetchQuiz,
  onStartQuiz,
}: LatestQuizzesSectionProps) {
  const { t } = useTranslation();
  if (latestQuizzes.length === 0) return null;

  return (
    <section
      className="home-latest-packs"
      data-testid="home-latest-packs"
      aria-labelledby="home-latest-packs-title"
    >
      <header className="home-latest-packs__header">
        <h2 id="home-latest-packs-title" className="home-latest-packs__title">
          {t('home.latestSection')}
        </h2>
        <p className="home-latest-packs__hint">{t('home.latestSectionHint')}</p>
      </header>
      <ul className="quiz-list" aria-label={t('home.latestSection')}>
        {latestQuizzes.map((quiz, index) => {
          const bestScore = getBestScore(quiz.id);
          const difficulty = deriveQuizDifficulty(quiz);
          return (
            <li key={quiz.id}>
              <button
                type="button"
                data-testid="latest-quiz-card"
                className={`quiz-card${index % 2 === 1 ? ' quiz-card--alt' : ''}`}
                onClick={() => onStartQuiz(quiz)}
                onMouseEnter={onPrefetchQuiz}
                onFocus={onPrefetchQuiz}
                aria-label={`${t('home.start')}: ${pickLocale(quiz.title, lang)} (${t('home.questionsCount', { count: quiz.questions.length })})`}
              >
                <span className="quiz-card__icon" aria-hidden="true">
                  {QUIZ_ICON_MARK}
                </span>
                <div className="quiz-card__body">
                  <h3 className="quiz-card__title">
                    {pickLocale(quiz.title, lang)}
                  </h3>
                  <p className="quiz-card__desc">
                    {pickLocale(quiz.description, lang)}
                  </p>
                </div>
                <div className="quiz-card__footer">
                  <div className="quiz-card__meta">
                    <span className="quiz-card__meta-chip">
                      {t('home.questionsCount', {
                        count: quiz.questions.length,
                      })}
                    </span>
                    <span
                      className={`quiz-card__meta-chip quiz-card__meta-chip--difficulty is-${difficulty}`}
                    >
                      {t(`home.difficulty_${difficulty}`)}
                    </span>
                    <HighScoreBadge bestScore={bestScore} />
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
          );
        })}
      </ul>
    </section>
  );
}
