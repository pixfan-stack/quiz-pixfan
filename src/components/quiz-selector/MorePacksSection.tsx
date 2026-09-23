import { useTranslation } from 'react-i18next';
import type { Quiz } from '../../types/quiz';
import { pickLocale } from '../../utils/locale';
import { HighScoreBadge } from '../HighScoreBadge';
import { RANDOM_QUIZ_ID } from '../../utils/randomQuiz';
import { WEAK_SPOTS_QUESTION_COUNT } from '../../utils/mistakeVault';
import { deriveQuizDifficulty } from '../../utils/difficulty';
import {
  masteryLabelKey,
  masteryTierFromPercent,
  nextMasteryTarget,
} from '../../utils/mastery';
import type { getHighScore } from '../../utils/highscore';
import type { fetchRemoteHighScore } from '../../utils/highscoreApi';
import { QUIZ_ICONS, type DifficultyFilter } from './types';

type BestScore =
  | ReturnType<typeof getHighScore>
  | Awaited<ReturnType<typeof fetchRemoteHighScore>>;

interface MorePacksSectionProps {
  morePacksOpen: boolean;
  setMorePacksOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  difficultyFilter: DifficultyFilter;
  setDifficultyFilter: (value: DifficultyFilter) => void;
  visibleQuizzes: Quiz[];
  quizzes: Quiz[];
  playCounts: Map<string, number>;
  vaultCount: number;
  dueCount: number;
  lang: string;
  getBestScore: (quizId: string) => BestScore;
  onPrefetchQuiz?: () => void;
  onStartQuiz: (quiz: Quiz) => void;
  onStartRandom: () => void;
  onStartWeakSpots: () => void;
  onStartDifficultyMix: () => void;
}

export function MorePacksSection({
  morePacksOpen,
  setMorePacksOpen,
  difficultyFilter,
  setDifficultyFilter,
  visibleQuizzes,
  quizzes,
  playCounts,
  vaultCount,
  dueCount,
  lang,
  getBestScore,
  onPrefetchQuiz,
  onStartQuiz,
  onStartRandom,
  onStartWeakSpots,
  onStartDifficultyMix,
}: MorePacksSectionProps) {
  const { t } = useTranslation();

  return (
    <details
      className="home-more-packs"
      open={morePacksOpen}
      onToggle={(e) => {
        setMorePacksOpen((e.target as HTMLDetailsElement).open);
      }}
    >
      <summary className="home-more-packs__summary">
        <span className="home-more-packs__title">{t('home.morePacks')}</span>
        <span className="home-more-packs__hint">{t('home.morePacksHint')}</span>
      </summary>

      <div className="home-more-packs__body">
        <div
          className="difficulty-filter"
          role="group"
          aria-label={t('home.difficultyFilter')}
        >
          {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
            <button
              key={level}
              type="button"
              className={`difficulty-chip${difficultyFilter === level ? ' is-active' : ''}`}
              onClick={() => {
                setDifficultyFilter(level);
                if (level !== 'all') setMorePacksOpen(true);
              }}
              aria-pressed={difficultyFilter === level}
            >
              {t(`home.difficulty_${level}`)}
            </button>
          ))}
          {difficultyFilter !== 'all' && (
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={onStartDifficultyMix}
              disabled={visibleQuizzes.length === 0}
            >
              {t('home.startDifficultyMix')}
            </button>
          )}
        </div>

        <ul className="quiz-list">
          {quizzes.length > 0 &&
            difficultyFilter === 'all' &&
            vaultCount > 0 && (
              <li>
                <button
                  type="button"
                  className="quiz-card quiz-card--weak"
                  onClick={onStartWeakSpots}
                  onMouseEnter={onPrefetchQuiz}
                  onFocus={onPrefetchQuiz}
                  aria-label={t('home.weakSpots')}
                >
                  <span className="quiz-card__icon" aria-hidden="true">
                    🎯
                  </span>
                  <div className="quiz-card__body">
                    <h3 className="quiz-card__title">{t('home.weakSpots')}</h3>
                    <p className="quiz-card__desc">{t('home.weakSpotsDesc')}</p>
                  </div>
                  <div className="quiz-card__footer">
                    <div className="quiz-card__meta">
                      <span className="quiz-card__meta-chip">
                        {t('home.weakSpotsCount', {
                          count: Math.min(vaultCount, WEAK_SPOTS_QUESTION_COUNT),
                        })}
                      </span>
                      {dueCount > 0 && (
                        <span className="quiz-card__meta-chip quiz-card__meta-chip--due">
                          {t('home.weakSpotsDueCount', { count: dueCount })}
                        </span>
                      )}
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
          {quizzes.length > 0 && difficultyFilter === 'all' && (
            <li>
              <button
                type="button"
                className="quiz-card quiz-card--random"
                onClick={onStartRandom}
                onMouseEnter={onPrefetchQuiz}
                onFocus={onPrefetchQuiz}
                aria-label={t('home.randomQuiz')}
              >
                <span className="quiz-card__icon" aria-hidden="true">
                  🎲
                </span>
                <div className="quiz-card__body">
                  <h3 className="quiz-card__title">{t('home.randomQuiz')}</h3>
                  <p className="quiz-card__desc">{t('home.randomQuizDesc')}</p>
                </div>
                <div className="quiz-card__footer">
                  <div className="quiz-card__meta">
                    <span className="quiz-card__meta-chip">
                      {t('home.questionsCount', { count: 20 })}
                    </span>
                    {(playCounts.get(RANDOM_QUIZ_ID) ?? 0) > 0 && (
                      <span className="quiz-card__meta-chip quiz-card__meta-chip--soft">
                        {t('home.playsCount', {
                          count: playCounts.get(RANDOM_QUIZ_ID),
                        })}
                      </span>
                    )}
                    <HighScoreBadge
                      showEmpty
                      bestScore={getBestScore(RANDOM_QUIZ_ID)}
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
          {visibleQuizzes.map((quiz, index) => {
            const bestScore = getBestScore(quiz.id);
            const plays = playCounts.get(quiz.id) ?? 0;
            const difficulty = deriveQuizDifficulty(quiz);
            const mastery = masteryTierFromPercent(bestScore?.percentage);
            const masteryKey = masteryLabelKey(mastery);
            const masteryNext = nextMasteryTarget(bestScore?.percentage);
            return (
              <li key={quiz.id}>
                <button
                  type="button"
                  data-testid="category-quiz-card"
                  className={`quiz-card${index % 2 === 1 ? ' quiz-card--alt' : ''}`}
                  onClick={() => onStartQuiz(quiz)}
                  onMouseEnter={onPrefetchQuiz}
                  onFocus={onPrefetchQuiz}
                  aria-label={`${t('home.start')}: ${pickLocale(quiz.title, lang)} (${t('home.questionsCount', { count: quiz.questions.length })})`}
                >
                  <span className="quiz-card__icon" aria-hidden="true">
                    {QUIZ_ICONS[quiz.id] ?? '✦'}
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
                      {masteryKey && (
                        <span
                          className={`quiz-card__meta-chip quiz-card__meta-chip--mastery is-${mastery}`}
                        >
                          {t(masteryKey)}
                        </span>
                      )}
                      {masteryNext && (
                        <span className="quiz-card__meta-chip quiz-card__meta-chip--mastery-next">
                          {t('home.masteryNext', {
                            need: masteryNext.need,
                            tier: t(`home.mastery_${masteryNext.nextTier}`),
                          })}
                        </span>
                      )}
                      {plays > 0 && (
                        <span className="quiz-card__meta-chip quiz-card__meta-chip--soft">
                          {t('home.playsCount', { count: plays })}
                        </span>
                      )}
                      <HighScoreBadge showEmpty bestScore={bestScore} />
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
      </div>
    </details>
  );
}
