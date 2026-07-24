import { useState, useEffect, Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz, QuizzesData } from './types/quiz';
import { useDarkMode } from './hooks/useDarkMode';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QuizSelector } from './components/QuizSelector';
const QuizScreen = lazy(() => import('./components/QuizScreen'));

type AppView = 'home' | 'quiz';

interface QuizSettings {
  timePerQuestion: number;
  antiCheat: boolean;
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
  const { isDark, toggleDark } = useDarkMode();

  // Sync <html lang> with current language
  useEffect(() => {
    document.documentElement.lang = (i18n.resolvedLanguage ?? i18n.language).slice(0, 2);
  }, [i18n.language, i18n.resolvedLanguage]);

  // Load quizzes from static asset (not bundled in JS)
  useEffect(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((data) => setQuizzes((data as QuizzesData).quizzes));
  }, []);

  const handleSelectQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setView('quiz');
  };

  const handleHome = () => {
    setActiveQuiz(null);
    setView('home');
  };

  return (
    <div className="app">
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
