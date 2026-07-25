import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import type { AnswerReviewItem, Question, Quiz, QuizResult } from '../types/quiz';
import {
  computePercentage,
  isAnswerCorrect,
} from '../utils/scoring';
import { saveHighScoreIfBetter } from '../utils/highscore';
import { useTimer } from './useTimer';
import { useTabTracker } from './useTabTracker';

type QuizPhase = 'answering' | 'feedback' | 'finished';

interface QuizEngineOptions {
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
  const reviewLog = useRef<AnswerReviewItem[]>([]);
  const { timePerQuestion = 0, antiCheat = false } = options;

  const timer = useTimer(
    state.phase === 'answering' && timePerQuestion > 0,
    { duration: timePerQuestion }
  );

  const tabTracker = useTabTracker(state.phase !== 'finished');

  // Shuffle questions on mount for replayability
  const questions = useMemo(() => {
    const arr = [...quiz.questions];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.attemptId]);
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

  // Handle timer expiry
  useEffect(() => {
    if (timer.timeUp && state.phase === 'answering' && currentQuestion) {
      const alreadyLogged = reviewLog.current.some(
        (item) => item.question.id === currentQuestion.id
      );
      if (!alreadyLogged) {
        reviewLog.current.push({
          question: currentQuestion,
          selectedIds: state.selectedIds,
          wasCorrect: false,
          timedOut: true,
        });
      }
      setState((prev) => ({
        ...prev,
        phase: 'feedback' as const,
        lastWasCorrect: false,
        currentStreak: 0,
        questionTimedOut: true,
      }));
    }
  }, [timer.timeUp, state.phase, state.selectedIds, currentQuestion]);

  // Sync tab-switch count for focus mode (display + final penalty)
  useEffect(() => {
    if (!antiCheat) return;
    setState((prev) => ({
      ...prev,
      tabSwitches: tabTracker.tabSwitchCount,
    }));
  }, [tabTracker.tabSwitchCount, antiCheat, tabTracker]);

  const reset = useCallback(() => {
    startedAt.current = Date.now();
    reviewLog.current = [];
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

      reviewLog.current.push({
        question: currentQuestion,
        selectedIds: prev.selectedIds,
        wasCorrect: correct,
      });

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
        const tabSwitchPenalty = antiCheat ? tabTracker.tabSwitchCount : 0;
        const adjustedCorrect = Math.max(0, prev.correctCount - tabSwitchPenalty);
        const percentage = computePercentage(adjustedCorrect, total);
        const { isNewHighScore, previousBest } = saveHighScoreIfBetter({
          quizId: quiz.id,
          percentage,
          correctCount: adjustedCorrect,
          totalQuestions: total,
        });

        const result: QuizResult = {
          quizId: quiz.id,
          correctCount: adjustedCorrect,
          totalQuestions: total,
          percentage,
          timeTakenSeconds,
          maxStreak: prev.maxStreak,
          isNewHighScore,
          previousBest,
          tabSwitchPenalty: tabSwitchPenalty > 0 ? tabSwitchPenalty : undefined,
          mistakes: reviewLog.current.filter((item) => !item.wasCorrect),
        };

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
  }, [quiz.id, total, antiCheat, tabTracker.tabSwitchCount]);

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
    antiCheatEnabled: antiCheat,
    tabSwitches: tabTracker.tabSwitchCount,
  };
}
