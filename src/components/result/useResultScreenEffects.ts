import { useEffect, useRef, useState } from 'react';
import type { QuizResult } from '../../types/quiz';
import { useConfetti } from '../../hooks/useConfetti';
import {
  unlockAchievements,
  type AchievementId,
} from '../../utils/achievements';
import { trackQuizAttempt } from '../../utils/analyticsApi';
import { pushAccountProgress } from '../../utils/accountSync';
import {
  formatDailyCountdown,
  msUntilNextDaily,
} from '../../utils/dailyChallenge';
import { recordDailyCompletion } from '../../utils/dailyStreak';
import { getAllHighScores } from '../../utils/highscore';
import {
  fetchLeaderboard,
  submitRemoteHighScore,
} from '../../utils/highscoreApi';
import { recordMistakes, resolveCorrectAnswers } from '../../utils/mistakeVault';
import { getPlayerId } from '../../utils/player';
import { markQuizPlayed } from '../../utils/reengage';
import {
  unlockSeasonFromRank,
  unlockSeasonParticipant,
  unlockSeasonStreak,
} from '../../utils/seasonEngagement';
import type { LangCode } from './types';

interface UseResultScreenEffectsArgs {
  result: QuizResult;
  categoryQuizIds: string[];
  displayName: string;
  onScoreSubmitted?: () => void;
  isDaily: boolean;
  langCode: LangCode;
}

export function useResultScreenEffects({
  result,
  categoryQuizIds,
  displayName,
  onScoreSubmitted,
  isDaily,
  langCode,
}: UseResultScreenEffectsArgs) {
  const [leaderboardRefresh, setLeaderboardRefresh] = useState(0);
  const [newAchievements, setNewAchievements] = useState<AchievementId[]>([]);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [freezeConsumed, setFreezeConsumed] = useState(false);
  const [vaultSaved, setVaultSaved] = useState(0);
  const [vaultCleared, setVaultCleared] = useState(0);
  const [dailyCountdown, setDailyCountdown] = useState(() =>
    formatDailyCountdown(msUntilNextDaily(), langCode)
  );

  // Keep latest callback without re-firing the sync effect on parent re-renders.
  const onScoreSubmittedRef = useRef(onScoreSubmitted);
  onScoreSubmittedRef.current = onScoreSubmitted;

  // Parent often passes a fresh array each render — stabilize for effect deps.
  const categoryQuizIdsKey = categoryQuizIds.join('\0');

  // Daily streak + mistake vault + achievements (local)
  useEffect(() => {
    markQuizPlayed();
    const streakState = recordDailyCompletion(result.quizId);
    setDailyStreak(streakState.currentStreak);
    setFreezeConsumed(streakState.freezeConsumed);
    unlockSeasonParticipant();
    unlockSeasonStreak(streakState.currentStreak);
    // Resolve before unlock so vault-clear can count this run
    const cleared = resolveCorrectAnswers(result.reviews ?? []);
    setVaultCleared(cleared);
    setVaultSaved(recordMistakes(result.mistakes ?? []));
    const newly = unlockAchievements({
      quizId: result.quizId,
      percentage: result.percentage,
      categoryQuizIds: categoryQuizIdsKey
        ? categoryQuizIdsKey.split('\0')
        : [],
      highscores: getAllHighScores(),
      streak: streakState,
      vaultClearedThisRun: cleared,
    });
    setNewAchievements(newly);
  }, [
    result.quizId,
    result.percentage,
    result.mistakes,
    result.reviews,
    categoryQuizIdsKey,
  ]);

  useEffect(() => {
    if (!isDaily) return;
    const tick = () =>
      setDailyCountdown(formatDailyCountdown(msUntilNextDaily(), langCode));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isDaily, langCode]);

  // Sync to Cloudflare D1 + analytics + season rank cosmetics — once per result.
  useEffect(() => {
    let cancelled = false;

    void submitRemoteHighScore({
      quizId: result.quizId,
      playerId: getPlayerId(),
      displayName,
      percentage: result.percentage,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
    })
      .then(async (ok) => {
        if (!ok || cancelled) return;
        setLeaderboardRefresh((n) => n + 1);
        onScoreSubmittedRef.current?.();
        try {
          const board = await fetchLeaderboard({
            period: 'month',
            limit: 10,
            playerId: getPlayerId(),
          });
          if (cancelled) return;
          unlockSeasonFromRank(board.viewer?.rank ?? null);
          // Re-push badges after rank enrichment
          void pushAccountProgress();
        } catch {
          // ignore rank enrichment failures
        }
      })
      .catch(() => {});

    // Streak + achievements (after local unlock effect has run)
    const syncTimer = window.setTimeout(() => {
      void pushAccountProgress();
    }, 0);

    void trackQuizAttempt({
      quizId: result.quizId,
      percentage: result.percentage,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      timeTakenSeconds: result.timeTakenSeconds,
    });

    return () => {
      cancelled = true;
      window.clearTimeout(syncTimer);
    };
  }, [
    result.quizId,
    result.percentage,
    result.correctCount,
    result.totalQuestions,
    result.timeTakenSeconds,
    displayName,
  ]);

  // Confetti for perfect scores
  const { fire, isAnimating, canvasRef } = useConfetti();
  const [hasFired, setHasFired] = useState(false);

  useEffect(() => {
    if (result.percentage === 100 && !hasFired) {
      fire(120);
      setHasFired(true);
    }
  }, [result.percentage, hasFired, fire]);

  return {
    leaderboardRefresh,
    newAchievements,
    dailyStreak,
    freezeConsumed,
    vaultSaved,
    vaultCleared,
    dailyCountdown,
    isAnimating,
    canvasRef,
  };
}
