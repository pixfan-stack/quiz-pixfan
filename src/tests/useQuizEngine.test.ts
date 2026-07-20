import { describe, it, expect, vi } from 'vitest';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { renderHook, act } from '@testing-library/react';
import type { Quiz } from '../types/quiz';

const mockQuiz: Quiz = {
  id: 'test-quiz',
  title: { en: 'Test Quiz', fr: 'Quiz Test' },
  description: { en: 'A test quiz', fr: 'Un quiz de test' },
  questions: [
    {
      id: 'q1',
      type: 'single',
      text: { en: 'Q1?', fr: 'Q1 ?' },
      answers: [
        { id: 'a1', text: { en: 'A', fr: 'A' } },
        { id: 'a2', text: { en: 'B', fr: 'B' } },
      ],
      correctAnswers: ['a1'],
      explanation: { en: 'Explanation 1', fr: 'Explication 1' },
    },
    {
      id: 'q2',
      type: 'multiple',
      text: { en: 'Q2?', fr: 'Q2 ?' },
      answers: [
        { id: 'b1', text: { en: 'C', fr: 'C' } },
        { id: 'b2', text: { en: 'D', fr: 'D' } },
        { id: 'b3', text: { en: 'E', fr: 'E' } },
      ],
      correctAnswers: ['b1', 'b2'],
    },
    {
      id: 'q3',
      type: 'single',
      text: { en: 'Q3?', fr: 'Q3 ?' },
      answers: [
        { id: 'c1', text: { en: 'F', fr: 'F' } },
        { id: 'c2', text: { en: 'G', fr: 'G' } },
      ],
      correctAnswers: ['c2'],
    },
  ],
};

vi.mock('../utils/highscore', () => ({
  saveHighScoreIfBetter: () => ({ isNewHighScore: false, previousBest: null }),
}));

vi.mock('../utils/highscoreApi', () => ({
  submitRemoteHighScore: () => Promise.resolve(true),
}));

describe('useQuizEngine', () => {
  it('starts in correct initial state', () => {
    const { result } = renderHook(() => useQuizEngine(mockQuiz));
    const state = result.current;

    expect(state.phase).toBe('answering');
    expect(state.currentIndex).toBe(0);
    expect(state.correctCount).toBe(0);
    expect(state.currentStreak).toBe(0);
    expect(state.maxStreak).toBe(0);
    expect(state.selectedIds).toEqual([]);
    expect(state.progress.current).toBe(1);
    expect(state.progress.total).toBe(3);
    expect(state.isLast).toBe(false);
  });

  it('allows selecting an answer', () => {
    const { result } = renderHook(() => useQuizEngine(mockQuiz));

    act(() => {
      result.current.toggleAnswer('a1');
    });

    expect(result.current.selectedIds).toEqual(['a1']);
  });

  it('submits correct single answer', () => {
    const { result } = renderHook(() => useQuizEngine(mockQuiz));

    act(() => {
      result.current.toggleAnswer('a1');
      result.current.submitAnswer();
    });

    expect(result.current.phase).toBe('feedback');
    expect(result.current.lastWasCorrect).toBe(true);
    expect(result.current.correctCount).toBe(1);
    expect(result.current.currentStreak).toBe(1);
    expect(result.current.maxStreak).toBe(1);
  });

  it('submits wrong single answer', () => {
    const { result } = renderHook(() => useQuizEngine(mockQuiz));

    act(() => {
      result.current.toggleAnswer('a2');
      result.current.submitAnswer();
    });

    expect(result.current.phase).toBe('feedback');
    expect(result.current.lastWasCorrect).toBe(false);
    expect(result.current.correctCount).toBe(0);
    expect(result.current.currentStreak).toBe(0);
  });

  it('goes to next question', () => {
    const { result } = renderHook(() => useQuizEngine(mockQuiz));

    act(() => {
      result.current.toggleAnswer('a1');
      result.current.submitAnswer();
      result.current.goNext();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.phase).toBe('answering');
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.lastWasCorrect).toBeNull();
  });

  it('resets quiz state', () => {
    const { result } = renderHook(() => useQuizEngine(mockQuiz));

    act(() => {
      result.current.toggleAnswer('a1');
      result.current.submitAnswer();
      result.current.reset();
    });

    expect(result.current.phase).toBe('answering');
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.correctCount).toBe(0);
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.result).toBeNull();
  });

  it('handles single choice replacement', () => {
    const { result } = renderHook(() => useQuizEngine(mockQuiz));

    act(() => {
      result.current.toggleAnswer('a1');
      result.current.toggleAnswer('a2');
    });

    expect(result.current.selectedIds).toEqual(['a2']);
  });
});
