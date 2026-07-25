import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz, QuizzesData } from './types/quiz';
import { useDarkMode } from './hooks/useDarkMode';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QuizSelector } from './components/QuizSelector';
import { buildRandomQuiz, RANDOM_QUIZ_ID } from './utils/randomQuiz';
import { buildDailyQuiz, isDailyQuizId } from './utils/dailyChallenge';
import {
  buildDifficultyMix,
  isDifficultyMixId,
  parseDifficultyMixId,
} from './utils/difficulty';
import {
  buildDuelQuiz,
  isDuelQuizId,
  parseDuelSeed,
} from './utils/duel';
import {
  clearQuizHash,
  parseQuizIdFromHash,
  setQuizHash,
} from './utils/routing';

const QuizScreen = lazy(() => import('./components/QuizScreen'));

type AppView = 'home' | 'quiz';

interface QuizSettings {
  timePerQuestion: number;
  antiCheat: boolean;
}

function prefetchQuizScreen(): void {
  void import('./components/QuizScreen');
}

/**
 * Root application shell.
 */
export default function App() {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState<AppView>('home');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [settings, setSettings] = useState<QuizSettings>({
    timePerQuestion: 0,
    antiCheat: false,
  });
  const [leaderboardRefreshToken, setLeaderboardRefreshToken] = useState(0);
  const { isDark, toggleDark } = useDarkMode();

  useEffect(() => {
    document.documentElement.lang = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2);
  }, [i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((data) => setQuizzes((data as QuizzesData).quizzes));
  }, []);

  const startQuiz = useCallback((quiz: Quiz) => {
    setActiveQuiz(quiz);
    setView('quiz');
    setQuizHash(quiz.id);
  }, []);

  useEffect(() => {
    if (quizzes.length === 0) return;
    const quizId = parseQuizIdFromHash(window.location.hash);
    if (!quizId || view === 'quiz') return;

    if (quizId === RANDOM_QUIZ_ID) {
      startQuiz(buildRandomQuiz(quizzes));
      return;
    }

    if (isDailyQuizId(quizId)) {
      startQuiz(buildDailyQuiz(quizzes));
      return;
    }

    if (isDifficultyMixId(quizId)) {
      const difficulty = parseDifficultyMixId(quizId);
      if (difficulty) {
        startQuiz(buildDifficultyMix(quizzes, difficulty));
      }
      return;
    }

    if (isDuelQuizId(quizId)) {
      const seed = parseDuelSeed(quizId);
      if (seed) {
        startQuiz(buildDuelQuiz(quizzes, seed));
      }
      return;
    }

    const found = quizzes.find((q) => q.id === quizId);
    if (found) {
      startQuiz(found);
    }
  }, [quizzes, startQuiz, view]);

  useEffect(() => {
    const onHashChange = () => {
      if (!window.location.hash) {
        setActiveQuiz(null);
        setView('home');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSelectQuiz = (quiz: Quiz) => {
    prefetchQuizScreen();
    startQuiz(quiz);
  };

  const handleHome = () => {
    setActiveQuiz(null);
    setView('home');
    clearQuizHash();
    setLeaderboardRefreshToken((n) => n + 1);
  };

  const handleScoreSubmitted = () => {
    setLeaderboardRefreshToken((n) => n + 1);
  };

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">
        {t('common.accessibilitySkipToContent')}
      </a>

      <header className="app-header">
        <div className="app-header__brand">
          <button
            type="button"
            className="app-header__logo-container"
            onClick={handleHome}
            aria-label="Quiz PixFan"
          >
            <span className="logo-pix">Pix</span>
            <span className="logo-fan">fan</span>
            <span className="logo-badge">Quiz</span>
          </button>
        </div>

        <div className="app-header__controls">
          <a
            href="https://pixfan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="app-header__pixfan-link"
            title="pixfan.com"
          >
            pixfan.com
          </a>
          <LanguageSwitcher />
          <button
            type="button"
            className="dark-mode-toggle"
            onClick={toggleDark}
            aria-label={isDark ? t('common.lightMode') : t('common.darkMode')}
            title={isDark ? t('common.lightMode') : t('common.darkMode')}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="app-main" key={view} id="main-content" tabIndex={-1}>
        <ErrorBoundary>
          {view === 'home' && (
            <QuizSelector
              quizzes={quizzes}
              onSelect={handleSelectQuiz}
              onSettingsChange={setSettings}
              onPrefetchQuiz={prefetchQuizScreen}
              leaderboardRefreshToken={leaderboardRefreshToken}
            />
          )}
          {view === 'quiz' && activeQuiz && (
            <Suspense>
              <QuizScreen
                key={activeQuiz.id}
                quiz={activeQuiz}
                onHome={handleHome}
                timePerQuestion={settings.timePerQuestion}
                antiCheat={settings.antiCheat}
                onScoreSubmitted={handleScoreSubmitted}
                categoryQuizIds={quizzes.map((q) => q.id)}
              />
            </Suspense>
          )}
        </ErrorBoundary>
      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <a
            href="https://pixfan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__link"
          >
            © {new Date().getFullYear()} pixfan.com — Apprendre la photo, choisir son matériel
          </a>
        </div>
      </footer>
    </div>
  );
}
