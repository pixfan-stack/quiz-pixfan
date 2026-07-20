import { describe, it, expect, vi } from 'vitest';
import { useTimer } from '../hooks/useTimer';
import { renderHook, act, flushPromises } from '@testing-library/react';

describe('useTimer', () => {
  it('starts with correct remaining time', () => {
    const { result } = renderHook(() =>
      useTimer(true, { duration: 30, penalizeOnTimeout: true })
    );

    expect(result.current.remaining).toBe(30);
    expect(result.current.timeUp).toBe(false);
    expect(result.current.remainingPct).toBe(100);
    expect(result.current.isCritical).toBe(false);
  });

  it('decrements remaining time', async () => {
    const { result } = renderHook(() =>
      useTimer(true, { duration: 5, penalizeOnTimeout: true })
    );

    await act(async () => {
      await new Promise((r) => setTimeout(r, 2000));
    });

    expect(result.current.remaining).toBeLessThan(5);
    expect(result.current.remaining).toBeGreaterThanOrEqual(0);
  });

  it('resets timer', () => {
    const { result } = renderHook(() =>
      useTimer(true, { duration: 30, penalizeOnTimeout: true })
    );

    act(() => {
      result.current.reset();
    });

    expect(result.current.remaining).toBe(30);
    expect(result.current.timeUp).toBe(false);
  });

  it('stops when isRunning becomes false', () => {
    const { result } = renderHook(
      ({ running }) => useTimer(running, { duration: 30, penalizeOnTimeout: true }),
      { initialProps: { running: true } }
    );

    act(() => {
      result.current.pause();
    });

    expect(result.current.timeUp).toBe(false);
  });
});
