/**
 * Hook: Tab visibility tracker — detects when user switches tabs/apps.
 * Useful for anti-cheat mode.
 *
 * Usage:
 *   const { isFocused, tabSwitchCount, onFocus, onBlur } = useTabTracker();
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export function useTabTracker(active: boolean) {
  const [isFocused, setIsFocused] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const wasVisibleRef = useRef(true);
  const lastVisibilityChange = useRef<number>(0);

  const handleVisibilityChange = useCallback(() => {
    const visible = !document.hidden;
    if (wasVisibleRef.current && !visible) {
      // Just lost focus — tab switch detected
      const now = Date.now();
      // Debounce: ignore rapid toggles (< 1s apart)
      if (now - lastVisibilityChange.current > 1000) {
        setTabSwitchCount((c) => c + 1);
        lastVisibilityChange.current = now;
      }
    }
    wasVisibleRef.current = visible;
    setIsFocused(visible);
  }, []);

  useEffect(() => {
    if (!active) return;
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [active, handleVisibilityChange]);

  return {
    isFocused,
    tabSwitchCount,
    onFocus: () => setIsFocused(true),
  };
}
