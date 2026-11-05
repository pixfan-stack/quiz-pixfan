/**
 * Day/night toggle + chrome i18n for static guide pages.
 * Shares the SPA key + class: localStorage `quiz-pixfan-dark-mode`, html.dark-mode
 * (see src/hooks/useDarkMode.ts).
 * Chrome nav/footer labels follow path locale / documentElement.lang / ?lang=
 * (vague 1.99 path product: /en/ /es/ /de/).
 */
(function () {
  var STORAGE_KEY = 'quiz-pixfan-dark-mode';

  var ICON_MOON =
    '<svg class="dark-mode-toggle__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z"/></svg>';
  var ICON_SUN =
    '<svg class="dark-mode-toggle__icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M12 2.5v2.25M12 19.25V21.5M2.5 12h2.25M19.25 12H21.5M5.05 5.05l1.6 1.6M17.35 17.35l1.6 1.6M5.05 18.95l1.6-1.6M17.35 6.65l1.6-1.6"/></svg>';

  /** Short chrome labels (nav + footer) — vague 1.94 */
  var CHROME = {
    fr: { guides: 'Guides', scolaires: 'Scolaires' },
    en: { guides: 'Guides', scolaires: 'Schools' },
    es: { guides: 'Guías', scolaires: 'Colegios' },
    de: { guides: 'Leitfäden', scolaires: 'Schule' },
  };

  var THEME_LABELS = {
    fr: {
      dark: 'Mode nuit',
      light: 'Mode jour',
      darkShort: 'Nuit',
      lightShort: 'Jour',
    },
    en: {
      dark: 'Dark mode',
      light: 'Light mode',
      darkShort: 'Dark',
      lightShort: 'Light',
    },
    es: {
      dark: 'Modo noche',
      light: 'Modo día',
      darkShort: 'Noche',
      lightShort: 'Día',
    },
    de: {
      dark: 'Nachtmodus',
      light: 'Tagmodus',
      darkShort: 'Nacht',
      lightShort: 'Tag',
    },
  };

  function resolveLang() {
    try {
      var pathLang = (location.pathname.match(/^\/(en|es|de)(?=\/|$)/) || [])[1];
      if (pathLang) return pathLang;
    } catch (e) {
      /* ignore */
    }
    try {
      var p = new URLSearchParams(location.search).get('lang');
      if (p === 'fr' || p === 'en' || p === 'es' || p === 'de') return p;
    } catch (e2) {
      /* ignore */
    }
    // Bare guide paths = FR x-default (do not trust a stale html[lang] from SPA).
    return 'fr';
  }

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
    var pack = THEME_LABELS[resolveLang()] || THEME_LABELS.fr;
    return isDark ? pack.light : pack.dark;
  }

  function shortLabel(isDark) {
    var pack = THEME_LABELS[resolveLang()] || THEME_LABELS.fr;
    return isDark ? pack.lightShort : pack.darkShort;
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  /** Normalize pathname: strip locale prefix, trailing slash, no query/hash. */
  function chromePathname(href) {
    try {
      var u = new URL(href, 'https://quiz.pixfan.fr');
      var p = u.pathname || '/';
      p = p.replace(/^\/(en|es|de)(?=\/|$)/, '') || '/';
      if (p.charAt(0) !== '/') p = '/' + p;
      if (p.charAt(p.length - 1) !== '/') p += '/';
      return p;
    } catch (e) {
      return '';
    }
  }

  function isGuidesHubHref(href) {
    return chromePathname(href) === '/guides/';
  }

  function isScolairesHubHref(href) {
    return chromePathname(href) === '/guides/scolaires/';
  }

  /**
   * Path-locale chrome hub links (vague 1.99).
   * FR → bare `/guides/`; EN/ES/DE → `/xx/guides/…`. Keeps hash.
   */
  function withLangHref(basePath, href) {
    var lang = resolveLang();
    var hash = '';
    try {
      var u = new URL(href || basePath, 'https://quiz.pixfan.fr');
      hash = u.hash || '';
    } catch (e) {
      /* ignore */
    }
    if (lang === 'fr') return basePath + hash;
    var path = basePath.charAt(0) === '/' ? basePath : '/' + basePath;
    return '/' + lang + path + hash;
  }

  function applyChromeLabels() {
    var lang = resolveLang();
    var pack = CHROME[lang] || CHROME.fr;
    var guidesHref = '/guides/';
    var scolairesHref = '/guides/scolaires/';

    document.querySelectorAll('a.guide-nav-link').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (isGuidesHubHref(href)) {
        setText(a, pack.guides);
        a.setAttribute('href', withLangHref(guidesHref, href));
      } else if (isScolairesHubHref(href)) {
        setText(a, pack.scolaires);
        a.setAttribute('href', withLangHref(scolairesHref, href));
      }
    });

    document.querySelectorAll('a.app-footer__link').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (isGuidesHubHref(href)) {
        setText(a, pack.guides);
        a.setAttribute('href', withLangHref(guidesHref, href));
      } else if (isScolairesHubHref(href)) {
        setText(a, pack.scolaires);
        a.setAttribute('href', withLangHref(scolairesHref, href));
      }
    });

    document.querySelectorAll('nav.app-footer__guides').forEach(function (nav) {
      nav.setAttribute('aria-label', pack.guides);
    });
  }

  function syncToggle(isDark) {
    var btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;
    var label = labels(isDark);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.innerHTML =
      (isDark ? ICON_SUN : ICON_MOON) +
      '<span class="visually-hidden">' +
      shortLabel(isDark) +
      '</span>';
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

  function onReady() {
    applyChromeLabels();
    bindToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (localStorage.getItem(STORAGE_KEY) === null) {
      applyTheme(e.matches);
      syncToggle(e.matches);
    }
  });
})();
