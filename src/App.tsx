import { useMemo, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import questionsData from './data/questions.json';
import type { Quiz, QuizzesData } from './types/quiz';
import { useDarkMode } from './hooks/useDarkMode';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { QuizSelector } from './components/QuizSelector';
import { QuizScreen } from './components/QuizScreen';

type AppView = 'home' | 'quiz';

interface QuizSettings {
  timePerQuestion: number;
  antiCheat: boolean;
}

/**
 * Root application shell with Suspense boundary for lazy loading.
 * The QuizScreen component is wrapped in Suspense so Vite's
 * manualChunks can split it into a separate chunk.
 */
export default function App() {
  const { t } = useTranslation();
  const [view, setView] = useState<AppView>('home');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [settings, setSettings] = useState<QuizSettings>({
    timePerQuestion: 0,
    antiCheat: false,
  });
  const { isDark, toggleDark } = useDarkMode();

  const quizzes = useMemo(
    () => (questionsData as QuizzesData).quizzes,
    []
  );

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
      <div className="app__bg" aria-hidden="true" />

      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__logo" aria-hidden="true">Q</div>
          <div className="app-header__text">
            <h1 className="app-header__title">
              <button
                type="button"
                className="app-header__title-btn"
                onClick={handleHome}
              >
                {t('app.title')}
              </button>
            </h1>
            <p className="app-header__tagline">{t('app.tagline')}</p>
          </div>
        </div>

        <div className="app-header__controls">
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
        {view === 'home' && (
          <QuizSelector
            quizzes={quizzes}
            onSelect={handleSelectQuiz}
            onSettingsChange={setSettings}
          />
        )}
        {view === 'quiz' && activeQuiz && (
          <Suspense fallback={
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading quiz...</p>
            </div>
          }>
            <QuizScreen
              key={activeQuiz.id}
              quiz={activeQuiz}
              onHome={handleHome}
              timePerQuestion={settings.timePerQuestion}
              antiCheat={settings.antiCheat}
            />
          </Suspense>
        )}
      </main>
    </div>
  );
}
