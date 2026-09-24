/**
 * Day/night toggle for static guide pages.
 * Shares the SPA key + class: localStorage `quiz-pixfan-dark-mode`, html.dark-mode
 * (see src/hooks/useDarkMode.ts).
 */
(function () {
  var STORAGE_KEY = 'quiz-pixfan-dark-mode';

  function systemPrefersDark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function readPreference() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === 'true';
    return systemPrefersDark();
  }

  function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark-mode', isDark);
  }

  function labels(isDark) {
    var en = document.documentElement.lang === 'en';
    if (isDark) {
      return en ? 'Light mode' : 'Mode jour';
    }
    return en ? 'Dark mode' : 'Mode nuit';
  }

  function syncToggle(isDark) {
    var btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;
    var label = labels(isDark);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.textContent = isDark ? '☀️' : '🌙';
  }

  function setDark(isDark) {
    applyTheme(isDark);
    localStorage.setItem(STORAGE_KEY, String(isDark));
    syncToggle(isDark);
  }

  // Apply before paint when this script runs in <head>
  var initial = readPreference();
  applyTheme(initial);

  function bindToggle() {
    var btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;
    syncToggle(document.documentElement.classList.contains('dark-mode'));
    btn.addEventListener('click', function () {
      setDark(!document.documentElement.classList.contains('dark-mode'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindToggle);
  } else {
    bindToggle();
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (localStorage.getItem(STORAGE_KEY) === null) {
      applyTheme(e.matches);
      syncToggle(e.matches);
    }
  });
})();
