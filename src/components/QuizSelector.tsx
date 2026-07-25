import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Difficulty, Quiz } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import { HighScoreBadge } from './HighScoreBadge';
import { Leaderboard } from './Leaderboard';
import { getHighScore } from '../utils/highscore';
import { fetchRemoteHighScore } from '../utils/highscoreApi';
import { fetchQuizStats, type QuizStats } from '../utils/analyticsApi';
import { PlayerNamePrompt } from './PlayerNameInput';
import { buildRandomQuiz, RANDOM_QUIZ_ID } from '../utils/randomQuiz';
import {
  buildDailyQuiz,
  DAILY_QUESTION_COUNT,
  getDailyQuizId,
} from '../utils/dailyChallenge';
import {
  buildDifficultyMix,
  deriveQuizDifficulty,
  filterQuizzesByDifficulty,
} from '../utils/difficulty';
import {
  buildDuelQuiz,
  createDuelSeed,
  DUEL_QUESTION_COUNT,
} from '../utils/duel';
import { getDisplayDailyStreak } from '../utils/dailyStreak';
import { AchievementsPanel } from './AchievementsPanel';
import { quizShareUrl } from '../utils/share';

interface QuizSelectorProps {
  quizzes: Quiz[];
  onSelect: (quiz: Quiz) => void;
  onSettingsChange: (settings: { timePerQuestion: number; antiCheat: boolean }) => void;
  onPrefetchQuiz?: () => void;
  leaderboardRefreshToken?: number;
}

const QUIZ_ICONS: Record<string, string> = {
  'exposure-basics': '📷',
  composition: '📐',
  'light-color': '🌅',
  'gear-lenses': '🔭',
  'history-icons': '🎞️',
  genres: '🖼️',
  smartphone: '📱',
  'photo-rights': '⚖️',
  retouching: '✨',
};

interface QuizWithScore {
  quiz: Quiz;
  localScore: ReturnType<typeof getHighScore>;
  remoteScore: Awaited<ReturnType<typeof fetchRemoteHighScore>>;
}

export function QuizSelector({
  quizzes,
  onSelect,
  onSettingsChange,
  onPrefetchQuiz,
  leaderboardRefreshToken = 0,
}: QuizSelectorProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const [quizScores, setQuizScores] = useState<Map<string, QuizWithScore>>(new Map());
  const [showSettings, setShowSettings] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState(0);
  const [antiCheat, setAntiCheat] = useState(false);
  const [leaderboardQuizId, setLeaderboardQuizId] = useState<string | undefined>(undefined);
  const [playCounts, setPlayCounts] = useState<Map<string, number>>(new Map());
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [duelLinkCopied, setDuelLinkCopied] = useState(false);
  const dailyStreak = getDisplayDailyStreak();

  const visibleQuizzes = useMemo(
    () => filterQuizzesByDifficulty(quizzes, difficultyFilter),
    [quizzes, difficultyFilter]
  );

  // Load scores + popularity
  useEffect(() => {
    const loadScores = async () => {
      const scores = new Map<string, QuizWithScore>();
      for (const quiz of quizzes) {
        const localScore = getHighScore(quiz.id);
        const remoteScore = await fetchRemoteHighScore(quiz.id).catch(() => null);
        scores.set(quiz.id, { quiz, localScore, remoteScore });
      }
      const randomLocal = getHighScore(RANDOM_QUIZ_ID);
      const randomRemote = await fetchRemoteHighScore(RANDOM_QUIZ_ID).catch(() => null);
      scores.set(RANDOM_QUIZ_ID, {
        quiz: {
          id: RANDOM_QUIZ_ID,
          title: { en: 'Random mix', fr: 'Mix aléatoire' },
          description: { en: '', fr: '' },
          questions: [],
        },
        localScore: randomLocal,
        remoteScore: randomRemote,
      });
      const dailyId = getDailyQuizId();
      const dailyLocal = getHighScore(dailyId);
      const dailyRemote = await fetchRemoteHighScore(dailyId).catch(() => null);
      scores.set(dailyId, {
        quiz: {
          id: dailyId,
          title: { en: 'Daily challenge', fr: 'Défi du jour' },
          description: { en: '', fr: '' },
          questions: [],
        },
        localScore: dailyLocal,
        remoteScore: dailyRemote,
      });
      setQuizScores(scores);

      const stats = await fetchQuizStats().catch(() => []);
      if (Array.isArray(stats)) {
        const map = new Map<string, number>();
        for (const row of stats as QuizStats[]) {
          map.set(row.quizId, Number(row.attempts) || 0);
        }
        setPlayCounts(map);
      }
    };
    void loadScores();
  }, [quizzes, leaderboardRefreshToken]);

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

  const handleStartRandom = () => {
    if (quizzes.length === 0) return;
    handleStartQuiz(buildRandomQuiz(quizzes));
  };

  const dailyId = getDailyQuizId();
  const handleStartDaily = () => {
    if (quizzes.length === 0) return;
    handleStartQuiz(buildDailyQuiz(quizzes));
  };

  const handleStartDifficultyMix = () => {
    if (quizzes.length === 0 || difficultyFilter === 'all') return;
    handleStartQuiz(buildDifficultyMix(quizzes, difficultyFilter));
  };

  const handleStartDuel = async () => {
    if (quizzes.length === 0) return;
    const seed = createDuelSeed();
    const duel = buildDuelQuiz(quizzes, seed);
    try {
      await navigator.clipboard.writeText(quizShareUrl(duel.id));
      setDuelLinkCopied(true);
      window.setTimeout(() => setDuelLinkCopied(false), 2500);
    } catch {
      // ignore — quiz still starts
    }
    handleStartQuiz(duel);
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
        <PlayerNamePrompt />
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
            <div className="setting-row setting-row--stack">
              <label htmlFor="anticheat-toggle" className="setting-label">
                {t('home.antiCheat')}
              </label>
              <p className="setting-hint">{t('home.antiCheatHint')}</p>
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

      <div className="difficulty-filter" role="group" aria-label={t('home.difficultyFilter')}>
        {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            type="button"
            className={`difficulty-chip${difficultyFilter === level ? ' is-active' : ''}`}
            onClick={() => setDifficultyFilter(level)}
            aria-pressed={difficultyFilter === level}
          >
            {t(`home.difficulty_${level}`)}
          </button>
        ))}
        {difficultyFilter !== 'all' && (
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={handleStartDifficultyMix}
            disabled={visibleQuizzes.length === 0}
          >
            {t('home.startDifficultyMix')}
          </button>
        )}
      </div>

      <ul className="quiz-list">
        {quizzes.length > 0 && difficultyFilter === 'all' && (
          <li>
            <button
              type="button"
              className="quiz-card quiz-card--daily"
              onClick={handleStartDaily}
              onMouseEnter={onPrefetchQuiz}
              onFocus={onPrefetchQuiz}
              aria-label={t('home.dailyChallenge')}
            >
              <span className="quiz-card__icon" aria-hidden="true">
                🗓️
              </span>
              <div className="quiz-card__body">
                <h3 className="quiz-card__title">{t('home.dailyChallenge')}</h3>
                <p className="quiz-card__desc">{t('home.dailyChallengeDesc')}</p>
              </div>
              <div className="quiz-card__footer">
                <div className="quiz-card__meta">
                  <span className="quiz-card__meta-chip">
                    {t('home.questionsCount', { count: DAILY_QUESTION_COUNT })}
                  </span>
                  {dailyStreak > 0 && (
                    <span className="quiz-card__meta-chip quiz-card__meta-chip--streak">
                      {t('home.dailyStreak', { count: dailyStreak })}
                    </span>
                  )}
                  <HighScoreBadge showEmpty bestScore={getBestScore(dailyId)} />
                </div>
                <span className="quiz-card__cta">
                  {t('home.start')}
                  <span className="quiz-card__cta-arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </button>
          </li>
        )}
        {quizzes.length > 0 && difficultyFilter === 'all' && (
          <li>
            <button
              type="button"
              className="quiz-card quiz-card--duel"
              onClick={() => void handleStartDuel()}
              onMouseEnter={onPrefetchQuiz}
              onFocus={onPrefetchQuiz}
              aria-label={t('home.duel')}
            >
              <span className="quiz-card__icon" aria-hidden="true">
                ⚔️
              </span>
              <div className="quiz-card__body">
                <h3 className="quiz-card__title">{t('home.duel')}</h3>
                <p className="quiz-card__desc">
                  {duelLinkCopied ? t('home.duelLinkCopied') : t('home.duelDesc')}
                </p>
              </div>
              <div className="quiz-card__footer">
                <div className="quiz-card__meta">
                  <span className="quiz-card__meta-chip">
                    {t('home.questionsCount', { count: DUEL_QUESTION_COUNT })}
                  </span>
                </div>
                <span className="quiz-card__cta">
                  {t('home.start')}
                  <span className="quiz-card__cta-arrow" aria-hidden="true">→</span>
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
              onClick={handleStartRandom}
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
                      {t('home.playsCount', { count: playCounts.get(RANDOM_QUIZ_ID) })}
                    </span>
                  )}
                  <HighScoreBadge showEmpty bestScore={getBestScore(RANDOM_QUIZ_ID)} />
                </div>
                <span className="quiz-card__cta">
                  {t('home.start')}
                  <span className="quiz-card__cta-arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </button>
          </li>
        )}
        {visibleQuizzes.map((quiz, index) => {
          const bestScore = getBestScore(quiz.id);
          const plays = playCounts.get(quiz.id) ?? 0;
          const difficulty = deriveQuizDifficulty(quiz);
          return (
            <li key={quiz.id}>
              <button
                type="button"
                className={`quiz-card${index % 2 === 1 ? ' quiz-card--alt' : ''}`}
                onClick={() => handleStartQuiz(quiz)}
                onMouseEnter={onPrefetchQuiz}
                onFocus={onPrefetchQuiz}
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
                    <span className={`quiz-card__meta-chip quiz-card__meta-chip--difficulty is-${difficulty}`}>
                      {t(`home.difficulty_${difficulty}`)}
                    </span>
                    {plays > 0 && (
                      <span className="quiz-card__meta-chip quiz-card__meta-chip--soft">
                        {t('home.playsCount', { count: plays })}
                      </span>
                    )}
                    <HighScoreBadge showEmpty bestScore={bestScore} />
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

      <AchievementsPanel />

      <div className="leaderboard-section">
        <select
          className="setting-select"
          value={leaderboardQuizId ?? ''}
          onChange={(e) => setLeaderboardQuizId(e.target.value || undefined)}
          aria-label={t('leaderboard.title')}
        >
          <option value="">{t('leaderboard.filterAll')}</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {pickLocale(quiz.title, lang)}
            </option>
          ))}
          <option value={RANDOM_QUIZ_ID}>{t('home.randomQuiz')}</option>
        </select>
        <Leaderboard
          quizId={leaderboardQuizId}
          limit={20}
          quizzes={quizzes}
          refreshToken={leaderboardRefreshToken}
        />
      </div>
    </section>
  );
}
