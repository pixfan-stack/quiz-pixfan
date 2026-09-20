import { useEffect, useState } from 'react';
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
import { submitRemoteHighScore } from '../../utils/highscoreApi';
import { recordMistakes, resolveCorrectAnswers } from '../../utils/mistakeVault';
import { getPlayerId } from '../../utils/player';
import { markQuizPlayed } from '../../utils/reengage';
import { unlockSeasonParticipant } from '../../utils/seasonEngagement';
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

  // Daily streak + achievements + mistake vault (local)
  useEffect(() => {
    markQuizPlayed();
    const streakState = recordDailyCompletion(result.quizId);
    setDailyStreak(streakState.currentStreak);
    setFreezeConsumed(streakState.freezeConsumed);
    const newly = unlockAchievements({
      quizId: result.quizId,
      percentage: result.percentage,
      categoryQuizIds,
      highscores: getAllHighScores(),
      streak: streakState,
    });
    setNewAchievements(newly);
    setVaultSaved(recordMistakes(result.mistakes ?? []));
    setVaultCleared(resolveCorrectAnswers(result.reviews ?? []));
  }, [result.quizId, result.percentage, result.mistakes, result.reviews, categoryQuizIds]);

  useEffect(() => {
    if (!isDaily) return;
    const tick = () =>
      setDailyCountdown(formatDailyCountdown(msUntilNextDaily(), langCode));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isDaily, langCode]);

  // Sync to Cloudflare D1 + analytics
  useEffect(() => {
    unlockSeasonParticipant();
    void submitRemoteHighScore({
      quizId: result.quizId,
      playerId: getPlayerId(),
      displayName,
      percentage: result.percentage,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
    })
      .then((ok) => {
        if (ok) {
          setLeaderboardRefresh((n) => n + 1);
          onScoreSubmitted?.();
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

    return () => window.clearTimeout(syncTimer);
  }, [result, displayName, onScoreSubmitted]);

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
