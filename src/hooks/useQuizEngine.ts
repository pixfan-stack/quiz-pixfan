import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import type { Question, Quiz, QuizResult } from '../types/quiz';
import {
  computePercentage,
  isAnswerCorrect,
} from '../utils/scoring';
import { saveHighScoreIfBetter } from '../utils/highscore';
import { submitRemoteHighScore } from '../utils/highscoreApi';
import { useTimer } from './useTimer';
import { useTabTracker } from './useTabTracker';

export type QuizPhase = 'answering' | 'feedback' | 'finished';

export interface QuizEngineOptions {
  /** Enable timed mode (seconds per question). 0 = disabled. */
  timePerQuestion?: number;
  /** Penalize tab switches (each switch = -1 question). 0 = disabled. */
  antiCheat?: boolean;
}

interface QuizEngineState {
  attemptId: number;
  currentIndex: number;
  selectedIds: string[];
  phase: QuizPhase;
  correctCount: number;
  currentStreak: number;
  maxStreak: number;
  lastWasCorrect: boolean | null;
  result: QuizResult | null;
  tabSwitches: number;
  questionTimedOut: boolean;
}

const initialState = (attemptId = 0, tabSwitches = 0): QuizEngineState => ({
  attemptId,
  currentIndex: 0,
  selectedIds: [],
  phase: 'answering',
  correctCount: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastWasCorrect: null,
  result: null,
  tabSwitches,
  questionTimedOut: false,
});

export function useQuizEngine(
  quiz: Quiz,
  options: QuizEngineOptions = {}
) {
  const [state, setState] = useState<QuizEngineState>(initialState);
  const startedAt = useRef<number>(Date.now());
  const { timePerQuestion = 0, antiCheat = false } = options;

  const timer = useTimer(
    state.phase === 'answering' && timePerQuestion > 0,
    { duration: timePerQuestion, penalizeOnTimeout: true }
  );

  const tabTracker = useTabTracker(state.phase !== 'finished');

  // Handle timer expiry
  useEffect(() => {
    if (timer.timeUp && state.phase === 'answering') {
      setState((prev) => ({
        ...prev,
        phase: 'feedback' as const,
        lastWasCorrect: false,
        currentStreak: 0,
        questionTimedOut: true,
      }));
    }
  }, [timer.timeUp, state.phase]);

  // Handle anti-cheat
  useEffect(() => {
    if (antiCheat && tabTracker.tabSwitchCount > 0) {
      setState((prev) => ({
        ...prev,
        tabSwitches: prev.tabSwitches + tabTracker.tabSwitchCount,
      }));
      tabTracker.onFocus();
    }
  }, [tabTracker.tabSwitchCount, antiCheat]);

  const questions = quiz.questions;
  const total = questions.length;
  const currentQuestion: Question | undefined = questions[state.currentIndex];
  const isLast = state.currentIndex >= total - 1;

  const progress = useMemo(
    () => ({
      current: Math.min(state.currentIndex + 1, total),
      total,
    }),
    [state.currentIndex, total]
  );

  const reset = useCallback(() => {
    startedAt.current = Date.now();
    timer.reset();
    setState((prev) => initialState(prev.attemptId + 1, prev.tabSwitches));
  }, [timer]);

  const toggleAnswer = useCallback(
    (answerId: string) => {
      setState((prev) => {
        if (prev.phase !== 'answering' || !currentQuestion) return prev;
        if (timePerQuestion > 0) timer.pause();

        if (currentQuestion.type === 'single') {
          return { ...prev, selectedIds: [answerId] };
        }

        const exists = prev.selectedIds.includes(answerId);
        const selectedIds = exists
          ? prev.selectedIds.filter((id) => id !== answerId)
          : [...prev.selectedIds, answerId];
        return { ...prev, selectedIds };
      });
    },
    [currentQuestion, timePerQuestion, timer]
  );

  const submitAnswer = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'answering' || !currentQuestion) return prev;
      if (prev.selectedIds.length === 0) return prev;
      if (timePerQuestion > 0) timer.resume();

      const correct = isAnswerCorrect(currentQuestion, prev.selectedIds);
      const correctCount = prev.correctCount + (correct ? 1 : 0);
      const currentStreak = correct ? prev.currentStreak + 1 : 0;
      const maxStreak = Math.max(prev.maxStreak, currentStreak);

      return {
        ...prev,
        phase: 'feedback',
        correctCount,
        currentStreak,
        maxStreak,
        lastWasCorrect: correct,
        questionTimedOut: false,
      };
    });
  }, [currentQuestion, timePerQuestion, timer]);

  const goNext = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'feedback') return prev;

      if (prev.currentIndex >= total - 1) {
        const timeTakenSeconds = Math.round(
          (Date.now() - startedAt.current) / 1000
        );
        const percentage = computePercentage(prev.correctCount, total);
        const { isNewHighScore, previousBest } = saveHighScoreIfBetter({
          quizId: quiz.id,
          percentage,
          correctCount: prev.correctCount,
          totalQuestions: total,
        });

        const result: QuizResult = {
          quizId: quiz.id,
          correctCount: prev.correctCount,
          totalQuestions: total,
          percentage,
          timeTakenSeconds,
          maxStreak: prev.maxStreak,
          isNewHighScore,
          previousBest,
        };

        void submitRemoteHighScore({
          quizId: quiz.id,
          percentage,
          correctCount: prev.correctCount,
          totalQuestions: total,
        }).catch(() => {});

        return { ...prev, phase: 'finished', result };
      }

      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedIds: [],
        phase: 'answering',
        lastWasCorrect: null,
        questionTimedOut: false,
      };
    });
  }, [quiz.id, total]);

  return {
    ...state,
    currentQuestion,
    progress,
    isLast,
    reset,
    toggleAnswer,
    submitAnswer,
    goNext,
    timerRemaining: timer.remaining,
    timerIsCritical: timer.isCritical,
    timerEnabled: timePerQuestion > 0,
    tabSwitches: state.tabSwitches,
    antiCheatEnabled: antiCheat,
    isTabFocused: tabTracker.isFocused,
  };
}
