import { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz, QuizzesData } from './types/quiz';
import { useDarkMode } from './hooks/useDarkMode';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QuizSelector } from './components/QuizSelector';
import { InstallPrompt } from './components/InstallPrompt';
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
import { isAdminEnabled, isAdminHash } from './utils/adminAuth';
import {
  clearQuizHash,
  parseQuizIdFromHash,
  parseScoreFromLocation,
  setQuizHash,
} from './utils/routing';
import {
  buildWeakSpotsQuiz,
  isWeakSpotsQuizId,
} from './utils/mistakeVault';
import { APP_VERSION } from './version';

const QuizScreen = lazy(() => import('./components/QuizScreen'));
const AdminScreen = lazy(() => import('./components/AdminScreen'));

type AppView = 'home' | 'quiz' | 'admin';

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
  const [view, setView] = useState<AppView>(() =>
    isAdminHash(window.location.hash) ? 'admin' : 'home'
  );
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [settings, setSettings] = useState<QuizSettings>({
    timePerQuestion: 0,
    antiCheat: false,
  });
  const [leaderboardRefreshToken, setLeaderboardRefreshToken] = useState(0);
  const [targetScore, setTargetScore] = useState<number | null>(null);
  const { isDark, toggleDark } = useDarkMode();

  useEffect(() => {
    document.documentElement.lang = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2);
  }, [i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((data) => setQuizzes((data as QuizzesData).quizzes));
  }, []);

  const startQuiz = useCallback(
    (quiz: Quiz, opts?: { targetScore?: number | null }) => {
      const score = opts?.targetScore ?? null;
      setActiveQuiz(quiz);
      setTargetScore(score);
      setView('quiz');
      setQuizHash(quiz.id, score != null ? { score } : undefined);
    },
    []
  );

  const openAdmin = useCallback(() => {
    setActiveQuiz(null);
    setView('admin');
    const url = new URL(window.location.href);
    url.hash = '/admin';
    window.history.pushState(null, '', url.pathname + url.search + url.hash);
  }, []);

  useEffect(() => {
    if (isAdminHash(window.location.hash)) {
      setView('admin');
      setActiveQuiz(null);
      return;
    }

    if (quizzes.length === 0) return;
    const quizId = parseQuizIdFromHash(window.location.hash);
    if (!quizId || view === 'quiz' || view === 'admin') return;
    const scoreFromLink = parseScoreFromLocation();

    if (quizId === RANDOM_QUIZ_ID) {
      startQuiz(buildRandomQuiz(quizzes));
      return;
    }

    if (isWeakSpotsQuizId(quizId)) {
      const pack = buildWeakSpotsQuiz(quizzes);
      if (pack) startQuiz(pack);
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
        startQuiz(buildDuelQuiz(quizzes, seed), {
          targetScore: scoreFromLink,
        });
      }
      return;
    }

    const found = quizzes.find((q) => q.id === quizId);
    if (found) {
      startQuiz(found, { targetScore: scoreFromLink });
    }
  }, [quizzes, startQuiz, view]);

  useEffect(() => {
    const onHashChange = () => {
      if (isAdminHash(window.location.hash)) {
        setActiveQuiz(null);
        setView('admin');
        return;
      }
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
    setTargetScore(null);
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
            href="https://www.pixfan.com"
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
            <>
              <InstallPrompt />
              <QuizSelector
                quizzes={quizzes}
                onSelect={handleSelectQuiz}
                onSettingsChange={setSettings}
                onPrefetchQuiz={prefetchQuizScreen}
                leaderboardRefreshToken={leaderboardRefreshToken}
              />
            </>
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
                quizzes={quizzes}
                targetScore={targetScore}
              />
            </Suspense>
          )}
          {view === 'admin' && (
            <Suspense>
              <AdminScreen
                quizzes={quizzes}
                onHome={handleHome}
                onPreview={setQuizzes}
              />
            </Suspense>
          )}
        </ErrorBoundary>
      </main>

      <footer className="app-footer">
        <div className="app-footer__inner">
          <a
            href="https://www.pixfan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__link"
          >
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </a>
          <span className="app-footer__version">
            {t('footer.version', { version: APP_VERSION })}
          </span>
          {isAdminEnabled() && (
            <button
              type="button"
              className="app-footer__admin"
              onClick={openAdmin}
            >
              {t('footer.admin')}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
