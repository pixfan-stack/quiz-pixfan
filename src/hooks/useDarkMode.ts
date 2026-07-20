/**
 * Hook: Dark mode with system preference detection and persistence.
 *
 * Usage:
 *   const { isDark, toggleDark } = useDarkMode();
 */

import { useCallback, useEffect, useState } from 'react';

const DARK_MODE_STORAGE_KEY = 'quiz-pixfan-dark-mode';

function getSystemPreference(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('dark-mode', isDark);
  document.body.style.backgroundColor = isDark ? '#0f172a' : '';
  document.body.style.color = isDark ? '#e2e8f0' : '';
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(DARK_MODE_STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    return getSystemPreference();
  });

  useEffect(() => {
    applyTheme(isDark);
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDark));
  }, [isDark]);

  // Listen for system theme changes
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(DARK_MODE_STORAGE_KEY);
      if (stored === null) {
        setIsDark(e.matches);
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((d) => !d);
  }, []);

  return { isDark, toggleDark };
}
