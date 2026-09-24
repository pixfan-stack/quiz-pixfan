import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import type { QuizResult } from '../types/quiz';
import { useResultScreenEffects } from '../components/result/useResultScreenEffects';

const submitRemoteHighScore = vi.fn(() => Promise.resolve(true));
const fetchLeaderboard = vi.fn(() =>
  Promise.resolve({ leaderboard: [], total: 0, viewer: null, period: 'month' as const })
);
const pushAccountProgress = vi.fn(() => Promise.resolve());
const trackQuizAttempt = vi.fn(() => Promise.resolve());

vi.mock('../utils/highscoreApi', () => ({
  submitRemoteHighScore: (...args: unknown[]) =>
    submitRemoteHighScore(...(args as [])),
  fetchLeaderboard: (...args: unknown[]) => fetchLeaderboard(...(args as [])),
}));

vi.mock('../utils/accountSync', () => ({
  pushAccountProgress: () => pushAccountProgress(),
}));

vi.mock('../utils/analyticsApi', () => ({
  trackQuizAttempt: (...args: unknown[]) => trackQuizAttempt(...(args as [])),
}));

vi.mock('../utils/highscore', () => ({
  getAllHighScores: () => ({}),
}));

vi.mock('../utils/achievements', () => ({
  unlockAchievements: () => [],
}));

vi.mock('../utils/dailyStreak', () => ({
  recordDailyCompletion: () => ({
    currentStreak: 0,
    freezeConsumed: false,
  }),
}));

vi.mock('../utils/mistakeVault', () => ({
  recordMistakes: () => 0,
  resolveCorrectAnswers: () => 0,
}));

vi.mock('../utils/reengage', () => ({
  markQuizPlayed: () => {},
}));

vi.mock('../utils/seasonEngagement', () => ({
  unlockSeasonFromRank: () => {},
  unlockSeasonParticipant: () => {},
  unlockSeasonStreak: () => {},
}));

vi.mock('../utils/player', () => ({
  getPlayerId: () => 'player-test-1',
}));

vi.mock('../hooks/useConfetti', () => ({
  useConfetti: () => ({
    fire: vi.fn(),
    isAnimating: false,
    canvasRef: { current: null },
  }),
}));

const result: QuizResult = {
  quizId: 'marques-photo',
  percentage: 40,
  correctCount: 4,
  totalQuestions: 10,
  timeTakenSeconds: 42,
  maxStreak: 2,
  isNewHighScore: false,
  previousBest: 80,
  mistakes: [],
  reviews: [],
};

describe('useResultScreenEffects', () => {
  beforeEach(() => {
    submitRemoteHighScore.mockClear();
    fetchLeaderboard.mockClear();
    pushAccountProgress.mockClear();
    trackQuizAttempt.mockClear();
  });

  it('does not re-submit when parent passes a new onScoreSubmitted identity', async () => {
    let submitCount = 0;
    const { rerender } = renderHook(
      ({ onScoreSubmitted }) =>
        useResultScreenEffects({
          result,
          categoryQuizIds: ['a', 'b'],
          displayName: 'Joueur-abc',
          onScoreSubmitted,
          isDaily: false,
          langCode: 'fr',
        }),
      {
        initialProps: {
          onScoreSubmitted: () => {
            submitCount += 1;
          },
        },
      }
    );

    await waitFor(() => {
      expect(submitRemoteHighScore.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
    await waitFor(() => {
      expect(submitCount).toBeGreaterThanOrEqual(1);
    });

    const postsAfterMount = submitRemoteHighScore.mock.calls.length;
    const callbacksAfterMount = submitCount;

    // Simulate App re-render after setLeaderboardRefreshToken (new callback each time)
    for (let i = 0; i < 5; i++) {
      rerender({
        onScoreSubmitted: () => {
          submitCount += 1;
        },
      });
    }

    await new Promise((r) => setTimeout(r, 50));

    expect(submitRemoteHighScore).toHaveBeenCalledTimes(postsAfterMount);
    expect(submitCount).toBe(callbacksAfterMount);
  });

  it('does not re-submit when categoryQuizIds array identity changes', async () => {
    const { rerender } = renderHook(
      ({ categoryQuizIds }) =>
        useResultScreenEffects({
          result,
          categoryQuizIds,
          displayName: 'Joueur-abc',
          isDaily: false,
          langCode: 'fr',
        }),
      {
        initialProps: { categoryQuizIds: ['a', 'b'] },
      }
    );

    await waitFor(() => {
      expect(submitRemoteHighScore.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
    const postsAfterMount = submitRemoteHighScore.mock.calls.length;

    rerender({ categoryQuizIds: ['a', 'b'] });
    rerender({ categoryQuizIds: ['a', 'b'] });
    await new Promise((r) => setTimeout(r, 50));

    expect(submitRemoteHighScore).toHaveBeenCalledTimes(postsAfterMount);
  });
});
