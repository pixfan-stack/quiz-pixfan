import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import { HighScoreBadge } from './HighScoreBadge';
import { getHighScore } from '../utils/highscore';
import { fetchRemoteHighScore } from '../utils/highscoreApi';

interface QuizSelectorProps {
  quizzes: Quiz[];
  onSelect: (quiz: Quiz) => void;
  onSettingsChange: (settings: { timePerQuestion: number; antiCheat: boolean }) => void;
}

const QUIZ_ICONS: Record<string, string> = {
  'exposure-basics': '📷',
  composition: '📐',
  'light-color': '🌅',
  'gear-lenses': '🔭',
  'history-icons': '🎞️',
  genres: '🖼️',
};

interface QuizWithScore {
  quiz: Quiz;
  localScore: ReturnType<typeof getHighScore>;
  remoteScore: Awaited<ReturnType<typeof fetchRemoteHighScore>>;
}

export function QuizSelector({ quizzes, onSelect, onSettingsChange }: QuizSelectorProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const [quizScores, setQuizScores] = useState<Map<string, QuizWithScore>>(new Map());
  const [showSettings, setShowSettings] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState(0);
  const [antiCheat, setAntiCheat] = useState(false);

  // Load scores
  useState(() => {
    const loadScores = async () => {
      const scores = new Map<string, QuizWithScore>();
      for (const quiz of quizzes) {
        const localScore = getHighScore(quiz.id);
        const remoteScore = await fetchRemoteHighScore(quiz.id).catch(() => null);
        scores.set(quiz.id, { quiz, localScore, remoteScore });
      }
      setQuizScores(scores);
    };
    void loadScores();
  });

  const getBestScore = (quizId: string) => {
    const qs = quizScores.get(quizId);
    if (!qs) return null;
    const localPct = qs.localScore?.percentage ?? 0;
    const remotePct = qs.remoteScore?.percentage ?? 0;
    return localPct >= remotePct ? qs.localScore : qs.remoteScore;
  };

  const handleStartQuiz = (quiz: Quiz) => {
    onSettingsChange({ timePerQuestion, antiCheat });
    onSelect(quiz);
  };

  return (
    <section className="home">
      <header className="home-hero">
        <p className="home-hero__eyebrow">
          <span className="home-hero__eyebrow-dot" aria-hidden="true" />
          {t('app.title')}
        </p>
        <h2 className="page-title">{t('home.welcome')}</h2>
        <p className="page-subtitle">{t('home.selectQuiz')}</p>
      </header>

      {/* Settings toggle */}
      <div className="quiz-settings-bar">
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setShowSettings(!showSettings)}
          aria-expanded={showSettings}
        >
          ⚙️ {t('home.settings')}
        </button>

        {showSettings && (
          <div className="quiz-settings-panel">
            <div className="setting-row">
              <label htmlFor="timer-select" className="setting-label">
                {t('home.timerMode')}
              </label>
              <select
                id="timer-select"
                className="setting-select"
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(Number(e.target.value))}
              >
                <option value={0}>{t('home.off')}</option>
                <option value={15}>15s</option>
                <option value={30}>30s</option>
                <option value={45}>45s</option>
                <option value={60}>60s</option>
              </select>
            </div>
            <div className="setting-row">
              <label htmlFor="anticheat-toggle" className="setting-label">
                {t('home.antiCheat')}
              </label>
              <button
                id="anticheat-toggle"
                type="button"
                className={`toggle-btn${antiCheat ? ' toggle-btn--on' : ''}`}
                onClick={() => setAntiCheat(!antiCheat)}
                role="switch"
                aria-checked={antiCheat}
              >
                {antiCheat ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className="quiz-list">
        {quizzes.map((quiz, index) => {
          const bestScore = getBestScore(quiz.id);
          return (
            <li key={quiz.id}>
              <button
                type="button"
                className={`quiz-card${index % 2 === 1 ? ' quiz-card--alt' : ''}`}
                onClick={() => handleStartQuiz(quiz)}
                aria-label={`${t('home.start')}: ${pickLocale(quiz.title, lang)} (${t('home.questionsCount', { count: quiz.questions.length })})`}
              >
                <span className="quiz-card__icon" aria-hidden="true">
                  {QUIZ_ICONS[quiz.id] ?? '✦'}
                </span>
                <div className="quiz-card__body">
                  <h3 className="quiz-card__title">{pickLocale(quiz.title, lang)}</h3>
                  <p className="quiz-card__desc">{pickLocale(quiz.description, lang)}</p>
                </div>
                <div className="quiz-card__footer">
                  <div className="quiz-card__meta">
                    <span className="quiz-card__meta-chip">
                      {t('home.questionsCount', { count: quiz.questions.length })}
                    </span>
                    <HighScoreBadge quizId={quiz.id} showEmpty bestScore={bestScore} />
                  </div>
                  <span className="quiz-card__cta">
                    {t('home.start')}
                    <span className="quiz-card__cta-arrow" aria-hidden="true">→</span>
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
