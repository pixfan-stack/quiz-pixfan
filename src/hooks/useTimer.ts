/**
 * Hook: Timer mode — countdown per question with configurable duration.
 *
 * Usage:
 *   const { seconds, timeUp, remainingPct, start, pause, resume } = useTimer(
 *     isRunning,
 *     { duration: 30, penalizeOnTimeout: true }
 *   );
 */

import { useCallback, useRef, useState, useEffect } from 'react';

export interface TimerConfig {
  /** Seconds per question (default: 30). */
  duration: number;
}

const DEFAULT_CONFIG: TimerConfig = {
  duration: 30,
};

export function useTimer(
  isRunning: boolean,
  config: Partial<TimerConfig> = {}
) {
  const merged = { ...DEFAULT_CONFIG, ...config };
  const [remaining, setRemaining] = useState(merged.duration);
  const [timeUp, setTimeUp] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (durationOverride?: number) => {
      clear();
      setTimeUp(false);
      const dur = durationOverride ?? merged.duration;
      setRemaining(dur);
      endTimeRef.current = Date.now() + dur * 1000;
      pausedAtRef.current = 0;

      intervalRef.current = window.setInterval(() => {
        const left = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setRemaining(left);
        if (left <= 0) {
          clear();
          setTimeUp(true);
        }
      }, 250);
    },
    [clear, merged.duration]
  );

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clear();
      pausedAtRef.current = Date.now();
    }
  }, [clear]);

  const resume = useCallback(() => {
    if (pausedAtRef.current > 0 && !timeUp) {
      const pausedDuration = Date.now() - pausedAtRef.current;
      endTimeRef.current += pausedDuration;
      pausedAtRef.current = 0;

      intervalRef.current = window.setInterval(() => {
        const left = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setRemaining(left);
        if (left <= 0) {
          clear();
          setTimeUp(true);
        }
      }, 250);
    }
  }, [timeUp, clear]);

  // Auto-start when isRunning becomes true
  useEffect(() => {
    if (isRunning && !timeUp) {
      start();
    } else if (!isRunning) {
      clear();
    }
    return clear;
  }, [isRunning, timeUp, start, clear]);

  const isCritical = remaining <= 5;

  return {
    remaining,
    timeUp,
    isCritical,
    start,
    pause,
    resume,
    reset: () => {
      clear();
      setRemaining(merged.duration);
      setTimeUp(false);
    },
  };
}
