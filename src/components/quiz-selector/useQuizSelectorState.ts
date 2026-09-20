import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type MouseEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { Quiz } from '../../types/quiz';
import { getHighScore } from '../../utils/highscore';
import { fetchRemoteHighScore } from '../../utils/highscoreApi';
import { fetchQuizStats, type QuizStats } from '../../utils/analyticsApi';
import { buildRandomQuiz, RANDOM_QUIZ_ID } from '../../utils/randomQuiz';
import {
  buildDailyQuiz,
  formatDailyCountdown,
  getDailyPhotoTeaser,
  getDailyQuizId,
  msUntilNextDaily,
} from '../../utils/dailyChallenge';
import {
  isDailyReminderEnabled,
  maybeNotifyDailyReminder,
  requestDailyReminderPermission,
  setDailyReminderEnabled,
} from '../../utils/dailyReminder';
import { hasPlayedDailyToday } from '../../utils/reengage';
import {
  buildWeakSpotsQuiz,
  getMistakeVaultCount,
} from '../../utils/mistakeVault';
import {
  buildDifficultyMix,
  filterQuizzesByDifficulty,
} from '../../utils/difficulty';
import { buildDuelQuiz, createDuelSeed } from '../../utils/duel';
import {
  getDisplayDailyStreak,
  getStreakFreezesAvailable,
} from '../../utils/dailyStreak';
import {
  buildPhotoReadingQuiz,
  collectIllustratedQuestions,
  getPhotoReadingTeaser,
} from '../../utils/photoReading';
import { socialShareUrl } from '../../utils/share';
import type { DifficultyFilter, QuizSelectorProps, QuizWithScore } from './types';

type UseQuizSelectorStateArgs = Pick<
  QuizSelectorProps,
  | 'quizzes'
  | 'onSelect'
  | 'onSettingsChange'
  | 'onPrefetchQuiz'
  | 'leaderboardRefreshToken'
  | 'recoveryCode'
  | 'onRecovered'
>;

export function useQuizSelectorState({
  quizzes,
  onSelect,
  onSettingsChange,
  onPrefetchQuiz,
  leaderboardRefreshToken = 0,
  recoveryCode = null,
  onRecovered,
}: UseQuizSelectorStateArgs) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const [quizScores, setQuizScores] = useState<Map<string, QuizWithScore>>(new Map());
  const [showSettings, setShowSettings] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState(0);
  const [antiCheat, setAntiCheat] = useState(false);
  const [leaderboardQuizId, setLeaderboardQuizId] = useState<string | undefined>(undefined);
  const [playCounts, setPlayCounts] = useState<Map<string, number>>(new Map());
  const [morePacksOpen, setMorePacksOpen] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
  const [dailyLinkCopied, setDailyLinkCopied] = useState(false);
  const [reminderOn, setReminderOn] = useState(() => isDailyReminderEnabled());
  const dailyStreak = getDisplayDailyStreak();
  const streakFreezes = getStreakFreezesAvailable();
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
  const photoPoolCount = useMemo(
    () => (quizzes.length > 0 ? collectIllustratedQuestions(quizzes).length : 0),
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

  const handleToggleReminder = () => {
    void (async () => {
      if (reminderOn) {
        setDailyReminderEnabled(false);
        setReminderOn(false);
        return;
      }
      const ok = await requestDailyReminderPermission();
      setReminderOn(ok);
    })();
  };

  return {
    t,
    lang,
    langCode,
    quizzes,
    onPrefetchQuiz,
    leaderboardRefreshToken,
    recoveryCode,
    onRecovered,
    showSettings,
    setShowSettings,
    timePerQuestion,
    setTimePerQuestion,
    antiCheat,
    setAntiCheat,
    leaderboardQuizId,
    setLeaderboardQuizId,
    playCounts,
    morePacksOpen,
    setMorePacksOpen,
    difficultyFilter,
    setDifficultyFilter,
    dailyLinkCopied,
    reminderOn,
    dailyStreak,
    streakFreezes,
    dailyPlayed,
    vaultCount,
    dailyCountdown,
    dailyTeaser,
    photoTeaser,
    photoPoolCount,
    photoPackAvailable,
    leaderboardSectionRef,
    visibleQuizzes,
    getBestScore,
    dailyId,
    handleCopyDailyLink,
    handleStartQuiz,
    handleStartRandom,
    handleStartDaily,
    handleStartPhotoReading,
    handleStartDifficultyMix,
    handleStartDuel,
    handleStartWeakSpots,
    scrollToLeaderboard,
    handleToggleReminder,
  };
}
