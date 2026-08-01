import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type MouseEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { Difficulty, Quiz } from '../types/quiz';
import { pickLocale } from '../utils/locale';
import { HighScoreBadge } from './HighScoreBadge';
import { Leaderboard } from './Leaderboard';
import { WeeklyLeaders } from './WeeklyLeaders';
import { DailyNudge } from './DailyNudge';
import { getHighScore } from '../utils/highscore';
import { fetchRemoteHighScore } from '../utils/highscoreApi';
import { fetchQuizStats, type QuizStats } from '../utils/analyticsApi';
import { PlayerNamePrompt } from './PlayerNameInput';
import { buildRandomQuiz, RANDOM_QUIZ_ID } from '../utils/randomQuiz';
import {
  buildDailyQuiz,
  DAILY_QUESTION_COUNT,
  formatDailyCountdown,
  getDailyPhotoTeaser,
  getDailyQuizId,
  msUntilNextDaily,
} from '../utils/dailyChallenge';
import {
  isDailyReminderEnabled,
  maybeNotifyDailyReminder,
  notificationsSupported,
  requestDailyReminderPermission,
  setDailyReminderEnabled,
} from '../utils/dailyReminder';
import { hasPlayedDailyToday } from '../utils/reengage';
import {
  buildWeakSpotsQuiz,
  getMistakeVaultCount,
  WEAK_SPOTS_QUESTION_COUNT,
} from '../utils/mistakeVault';
import {
  buildDifficultyMix,
  deriveQuizDifficulty,
  filterQuizzesByDifficulty,
} from '../utils/difficulty';
import {
  buildDuelQuiz,
  createDuelSeed,
  duelQuizId,
  DUEL_QUESTION_COUNT,
} from '../utils/duel';
import { getDisplayDailyStreak } from '../utils/dailyStreak';
import {
  buildPhotoReadingQuiz,
  getPhotoReadingTeaser,
  PHOTO_READING_COUNT,
  PHOTO_READING_ID,
} from '../utils/photoReading';
import { masteryLabelKey, masteryTierFromPercent } from '../utils/mastery';
import { AchievementsPanel } from './AchievementsPanel';
import { socialShareUrl } from '../utils/share';

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
  'public-domain': '🏛️',
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
  const [dailyLinkCopied, setDailyLinkCopied] = useState(false);
  const [duelLinkCopied, setDuelLinkCopied] = useState(false);
  const [reminderOn, setReminderOn] = useState(() => isDailyReminderEnabled());
  const dailyStreak = getDisplayDailyStreak();
  const dailyPlayed = hasPlayedDailyToday();
  const vaultCount = getMistakeVaultCount();
  const langCode = (lang.startsWith('fr') ? 'fr' : 'en') as 'en' | 'fr';
  const [dailyCountdown, setDailyCountdown] = useState(() =>
    formatDailyCountdown(msUntilNextDaily(), langCode)
  );
  const dailyTeaser = useMemo(
    () => (quizzes.length > 0 ? getDailyPhotoTeaser(quizzes) : null),
    [quizzes]
  );
  const photoTeaser = useMemo(
    () => (quizzes.length > 0 ? getPhotoReadingTeaser(quizzes) : null),
    [quizzes]
  );
  const photoPackAvailable = Boolean(photoTeaser);
  const leaderboardSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () =>
      setDailyCountdown(formatDailyCountdown(msUntilNextDaily(), langCode));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [langCode, leaderboardRefreshToken]);

  useEffect(() => {
    const dailyQuizId = getDailyQuizId();
    const ping = () => {
      void maybeNotifyDailyReminder({
        title: t('home.dailyReminderNotifyTitle'),
        body: t('home.dailyReminderNotifyBody'),
        dailyQuizId,
      });
    };
    ping();
    const onVis = () => {
      if (document.visibilityState === 'hidden') ping();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [t, leaderboardRefreshToken]);

  const flashCopied = useCallback(
    (setter: (v: boolean) => void) => {
      setter(true);
      window.setTimeout(() => setter(false), 2500);
    },
    []
  );

  const handleCopyDailyLink = async (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(
        socialShareUrl(getDailyQuizId(), { lang: langCode })
      );
      flashCopied(setDailyLinkCopied);
    } catch {
      // ignore
    }
  };

  const handleCopyDuelLink = async (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const id = duelQuizId(createDuelSeed());
    try {
      await navigator.clipboard.writeText(
        socialShareUrl(id, { lang: langCode })
      );
      flashCopied(setDuelLinkCopied);
    } catch {
      // ignore
    }
  };

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

  const handleStartPhotoReading = () => {
    if (quizzes.length === 0) return;
    const pack = buildPhotoReadingQuiz(quizzes);
    if (pack) handleStartQuiz(pack);
  };

  const handleStartDifficultyMix = () => {
    if (quizzes.length === 0 || difficultyFilter === 'all') return;
    handleStartQuiz(buildDifficultyMix(quizzes, difficultyFilter));
  };

  const handleStartDuel = () => {
    if (quizzes.length === 0) return;
    const seed = createDuelSeed();
    handleStartQuiz(buildDuelQuiz(quizzes, seed));
  };

  const handleStartWeakSpots = () => {
    const pack = buildWeakSpotsQuiz(quizzes);
    if (!pack) return;
    handleStartQuiz(pack);
  };

  const scrollToLeaderboard = () => {
    leaderboardSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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
            {notificationsSupported() && (
              <div className="setting-row setting-row--stack">
                <label htmlFor="daily-reminder-toggle" className="setting-label">
                  {t('home.dailyReminder')}
                </label>
                <p className="setting-hint">{t('home.dailyReminderHint')}</p>
                <button
                  id="daily-reminder-toggle"
                  type="button"
                  className={`toggle-btn${reminderOn ? ' toggle-btn--on' : ''}`}
                  onClick={() => {
                    void (async () => {
                      if (reminderOn) {
                        setDailyReminderEnabled(false);
                        setReminderOn(false);
                        return;
                      }
                      const ok = await requestDailyReminderPermission();
                      setReminderOn(ok);
                    })();
                  }}
                  role="switch"
                  aria-checked={reminderOn}
                >
                  {reminderOn ? 'ON' : 'OFF'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <DailyNudge onPlayDaily={handleStartDaily} />

      {difficultyFilter === 'all' && (
        <WeeklyLeaders
          quizzes={quizzes}
          refreshToken={leaderboardRefreshToken}
          onSeeAll={scrollToLeaderboard}
        />
      )}

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
          <li className="quiz-card-with-copy">
            <button
              type="button"
              className={`quiz-card quiz-card--daily${dailyPlayed ? ' quiz-card--played' : ''}`}
              onClick={handleStartDaily}
              onMouseEnter={onPrefetchQuiz}
              onFocus={onPrefetchQuiz}
              aria-label={t('home.dailyChallenge')}
            >
              {dailyTeaser?.imageUrl ? (
                <span className="quiz-card__teaser" aria-hidden="true">
                  <img
                    src={dailyTeaser.imageUrl}
                    alt=""
                    className="quiz-card__teaser-img"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              ) : (
                <span className="quiz-card__icon" aria-hidden="true">
                  🗓️
                </span>
              )}
              <div className="quiz-card__body">
                <h3 className="quiz-card__title">{t('home.dailyChallenge')}</h3>
                <p className="quiz-card__desc">
                  {dailyLinkCopied
                    ? t('home.linkCopied')
                    : dailyPlayed
                      ? t('home.dailyPlayedDesc', { time: dailyCountdown })
                      : t('home.dailyChallengeDesc')}
                </p>
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
                  {dailyPlayed && (
                    <span className="quiz-card__meta-chip quiz-card__meta-chip--done">
                      {t('home.dailyPlayed')}
                    </span>
                  )}
                  <HighScoreBadge showEmpty bestScore={getBestScore(dailyId)} />
                </div>
                <span className="quiz-card__cta">
                  {dailyPlayed ? t('home.dailyReplay') : t('home.start')}
                  <span className="quiz-card__cta-arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </button>
            <button
              type="button"
              className="quiz-card-copy-btn"
              onClick={(e) => void handleCopyDailyLink(e)}
              aria-label={t('home.copyDailyLink')}
              title={t('home.copyDailyLink')}
            >
              {dailyLinkCopied ? '✓' : '🔗'}
            </button>
          </li>
        )}
        {quizzes.length > 0 && difficultyFilter === 'all' && (
          <li className="quiz-card-with-copy">
            <button
              type="button"
              className="quiz-card quiz-card--duel"
              onClick={handleStartDuel}
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
                  {duelLinkCopied ? t('home.linkCopied') : t('home.duelDesc')}
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
            <button
              type="button"
              className="quiz-card-copy-btn"
              onClick={(e) => void handleCopyDuelLink(e)}
              aria-label={t('home.copyDuelLink')}
              title={t('home.copyDuelLink')}
            >
              {duelLinkCopied ? '✓' : '🔗'}
            </button>
          </li>
        )}
        {quizzes.length > 0 && difficultyFilter === 'all' && vaultCount > 0 && (
          <li>
            <button
              type="button"
              className="quiz-card quiz-card--weak"
              onClick={handleStartWeakSpots}
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
        {quizzes.length > 0 && difficultyFilter === 'all' && photoPackAvailable && (
          <li>
            <button
              type="button"
              className="quiz-card quiz-card--photo"
              onClick={handleStartPhotoReading}
              onMouseEnter={onPrefetchQuiz}
              onFocus={onPrefetchQuiz}
              aria-label={t('home.photoReading')}
            >
              {photoTeaser?.imageUrl ? (
                <span className="quiz-card__teaser" aria-hidden="true">
                  <img
                    src={photoTeaser.imageUrl}
                    alt=""
                    className="quiz-card__teaser-img"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              ) : (
                <span className="quiz-card__icon" aria-hidden="true">
                  🖼️
                </span>
              )}
              <div className="quiz-card__body">
                <h3 className="quiz-card__title">{t('home.photoReading')}</h3>
                <p className="quiz-card__desc">{t('home.photoReadingDesc')}</p>
              </div>
              <div className="quiz-card__footer">
                <div className="quiz-card__meta">
                  <span className="quiz-card__meta-chip">
                    {t('home.questionsCount', { count: PHOTO_READING_COUNT })}
                  </span>
                  <HighScoreBadge
                    showEmpty
                    bestScore={getBestScore(PHOTO_READING_ID)}
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
          const mastery = masteryTierFromPercent(bestScore?.percentage);
          const masteryKey = masteryLabelKey(mastery);
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
                    {masteryKey && (
                      <span
                        className={`quiz-card__meta-chip quiz-card__meta-chip--mastery is-${mastery}`}
                      >
                        {t(masteryKey)}
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
                    <span className="quiz-card__cta-arrow" aria-hidden="true">→</span>
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <AchievementsPanel />

      <div className="leaderboard-section" ref={leaderboardSectionRef} id="leaderboard">
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
          defaultPeriod="week"
        />
      </div>
    </section>
  );
}
