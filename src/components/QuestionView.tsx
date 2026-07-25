import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Question } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import { isPartiallyCorrect } from '../utils/scoring';

interface QuestionViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedIds: string[];
  phase: 'answering' | 'feedback';
  lastWasCorrect: boolean | null;
  currentStreak: number;
  isLast: boolean;
  onToggle: (answerId: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  /** Timer config. */
  timerRemaining?: number;
  timerDuration?: number;
  timerIsCritical?: boolean;
  timerEnabled?: boolean;
  /** Anti-cheat. */
  tabSwitches?: number;
  antiCheatEnabled?: boolean;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Single question UI: answers, submit, feedback, timer, and anti-cheat.
 */
export function QuestionView({
  question,
  questionNumber,
  totalQuestions,
  selectedIds,
  phase,
  lastWasCorrect,
  currentStreak,
  isLast,
  onToggle,
  onSubmit,
  onNext,
  timerRemaining,
  timerDuration = 30,
  timerIsCritical = false,
  timerEnabled = false,
  tabSwitches = 0,
  antiCheatEnabled = false,
}: QuestionViewProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const locked = phase === 'feedback';
  const isMultiple = question.type === 'multiple';

  const progressPct = Math.round((questionNumber / totalQuestions) * 100);

  // Focus management for accessibility
  const feedbackRef = useRef<HTMLDivElement>(null);
  const firstAnswerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (phase === 'answering' && firstAnswerRef.current) {
      firstAnswerRef.current.focus();
    } else if (phase === 'feedback' && feedbackRef.current) {
      feedbackRef.current.focus();
    }
  }, [phase, question.id]);

  useEffect(() => {
    if (phase !== 'answering') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedIds.length > 0) {
        e.preventDefault();
        onSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, selectedIds.length, onSubmit]);

  let feedbackKind: 'correct' | 'incorrect' | 'partial' | null = null;
  if (locked) {
    if (lastWasCorrect) {
      feedbackKind = 'correct';
    } else if (isPartiallyCorrect(question, selectedIds)) {
      feedbackKind = 'partial';
    } else {
      feedbackKind = 'incorrect';
    }
  }

  return (
    <section className="question-view">
      <div className="quiz-toolbar">
        <span className="progress">
          {t('quiz.progress', {
            current: questionNumber,
            total: totalQuestions,
          })}
        </span>
        <div className="quiz-stats">
          {/* Timer pill */}
          {timerEnabled && timerRemaining !== undefined && (
            <span
              className={`stat-pill${timerIsCritical ? ' stat-pill--critical' : ''}`}
              aria-label={t('quiz.timerRemaining', { seconds: timerRemaining })}
            >
              <span className="stat-pill__icon" aria-hidden="true">
                {timerIsCritical ? '⚠️' : '⏱'}
              </span>
              {timerRemaining}s
            </span>
          )}

          {/* Tab switch warning */}
          {antiCheatEnabled && tabSwitches > 0 && (
            <span className="stat-pill stat-pill--warning" role="alert">
              <span className="stat-pill__icon" aria-hidden="true">
                👁
              </span>
              {t('quiz.tabSwitches', { count: tabSwitches })}
            </span>
          )}

          {/* Streak */}
          <span
            className={`stat-pill${currentStreak > 0 ? ' stat-pill--streak' : ''}`}
          >
            <span className="stat-pill__icon" aria-hidden="true">
              🔥
            </span>
            {t('quiz.streak', { count: currentStreak })}
          </span>
        </div>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={questionNumber}
        aria-valuemax={totalQuestions}
        aria-label={t('quiz.progress', { current: questionNumber, total: totalQuestions })}
      >
        <div
          className="progress-track__fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Timer bar (visual countdown) */}
      {timerEnabled && timerRemaining !== undefined && timerDuration > 0 && (
        <div
          className="timer-bar"
          style={
            {
              '--pct': (timerRemaining / timerDuration) * 100,
            } as React.CSSProperties
          }
        >
          <div className="timer-bar__fill" />
        </div>
      )}

      <div className="card question-card" key={question.id}>
        <p className="question-type-hint">
          {isMultiple ? t('quiz.multipleChoice') : t('quiz.singleChoice')}
        </p>
        <h2 className="question-text">{pickLocale(question.text, lang)}</h2>

        {question.imageUrl && (
          <figure className="question-figure">
            <img
              className="question-figure__img"
              src={question.imageUrl}
              alt={
                question.imageAlt
                  ? pickLocale(question.imageAlt, lang)
                  : ''
              }
              loading="lazy"
              decoding="async"
            />
          </figure>
        )}

        <ul className="answer-list" role={isMultiple ? 'group' : 'radiogroup'}>
          {question.answers.map((answer, index) => {
            const selected = selectedIds.includes(answer.id);
            const isCorrectAnswer = question.correctAnswers.includes(answer.id);
            const letter = LETTERS[index] ?? String(index + 1);

            let stateClass = '';
            if (locked) {
              if (isCorrectAnswer) stateClass = ' is-correct';
              else if (selected && !isCorrectAnswer) stateClass = ' is-wrong';
            } else if (selected) {
              stateClass = ' is-selected';
            }

            return (
              <li key={answer.id}>
                <button
                  ref={index === 0 ? firstAnswerRef : undefined}
                  type="button"
                  className={`answer-option${stateClass}`}
                  onClick={() => onToggle(answer.id)}
                  disabled={locked}
                  aria-pressed={selected}
                  role={isMultiple ? 'checkbox' : 'radio'}
                  aria-checked={selected}
                >
                  <span className="answer-option__letter" aria-hidden="true">
                    {locked && isCorrectAnswer
                      ? '✓'
                      : locked && selected && !isCorrectAnswer
                        ? '✕'
                        : letter}
                  </span>
                  <span className="answer-option__text">
                    {pickLocale(answer.text, lang)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {feedbackKind && (
          <div
            className={`feedback feedback--${feedbackKind}`}
            role="status"
            aria-live="polite"
            ref={feedbackRef}
            tabIndex={-1}
          >
            <p className="feedback__title">
              <span aria-hidden="true">
                {feedbackKind === 'correct'
                  ? '✓'
                  : feedbackKind === 'partial'
                    ? '◐'
                    : '✕'}
              </span>
              {feedbackKind === 'correct' && t('quiz.correct')}
              {feedbackKind === 'incorrect' && t('quiz.incorrect')}
              {feedbackKind === 'partial' && t('quiz.partial')}
            </p>
            {question.explanation && (
              <p className="feedback__explanation">
                <strong>{t('quiz.explanation')}</strong>
                {pickLocale(question.explanation, lang)}
              </p>
            )}
          </div>
        )}

        <div className="btn-row">
          {phase === 'answering' ? (
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={onSubmit}
              disabled={selectedIds.length === 0}
            >
              {t('quiz.submit')}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary btn--block"
              onClick={onNext}
            >
              {isLast ? t('quiz.finish') : t('quiz.next')}
              <span className="btn__icon" aria-hidden="true">
                →
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
