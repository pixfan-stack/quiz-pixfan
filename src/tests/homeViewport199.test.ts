import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';
import langSource from '../utils/lang.ts?raw';
import i18nSource from '../i18n.ts?raw';
import appSource from '../App.tsx?raw';
import themeJs from '../../public/guides/theme.js?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import indexHtml from '../../index.html?raw';
import redirects from '../../public/_redirects?raw';
import sitemapXml from '../../public/sitemap.xml?raw';
import localeShells from '../../vite/localeHomeShells.ts?raw';
import viteConfig from '../../vite.config.ts?raw';
import questionsData from '../../public/data/questions.json';
import {
  detectPathLang,
  lookupPathLocalePreference,
  navigateToLang,
  stripLocalePrefix,
  withGuideLang,
  withLocalePath,
} from '../utils/lang';
import { pickLocale } from '../utils/locale';
import type { LocalizedString } from '../types/quiz';

type Ls = { en: string; fr: string; es?: string; de?: string };

const data = questionsData as {
  quizzes: Array<{
    id: string;
    title: Ls;
    description: Ls;
    questions: Array<{
      text: Ls;
      explanation?: Ls;
      imageAlt?: Ls;
      imageCredit?: Ls;
      answers: Array<{ text: Ls }>;
    }>;
  }>;
};

function collectLs(pack: (typeof data.quizzes)[number]): LocalizedString[] {
  const out: LocalizedString[] = [pack.title, pack.description];
  for (const q of pack.questions) {
    out.push(q.text);
    if (q.explanation) out.push(q.explanation);
    if (q.imageAlt) out.push(q.imageAlt);
    if (q.imageCredit) out.push(q.imageCredit);
    for (const a of q.answers) out.push(a.text);
  }
  return out;
}

describe('vague 1.99 — path locales /en/ /es/ /de/', () => {
  it('docs cite path locales / vague 1.99+; no-go through 1.99+', () => {
    expect(readme).toMatch(/v1\.(98|99|10[0-3])\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.(98|99|10[0-3])\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.99**');
    expect(nextSteps).toMatch(/no-go.*1\.(99|10[0-3])/);
    expect(nextSteps).toMatch(/\/en\/|path-locale|path locales/i);
  });

  it('lang helpers: path detect / strip / withLocalePath / withGuideLang', () => {
    expect(detectPathLang('/es/')).toBe('es');
    expect(detectPathLang('/en/guides/')).toBe('en');
    expect(detectPathLang('/guides/')).toBeNull();
    expect(stripLocalePrefix('/de/guides/scolaires/')).toBe('/guides/scolaires/');
    expect(withLocalePath('/', 'es')).toBe('/es/');
    expect(withLocalePath('/guides/', 'en')).toBe('/en/guides/');
    expect(withLocalePath('/es/guides/', 'fr')).toBe('/guides/');
    expect(withGuideLang('/guides/scolaires/#c4', 'de')).toBe(
      '/de/guides/scolaires/#c4'
    );
    expect(withGuideLang('/guides/?lang=en', 'es')).toBe('/es/guides/');
    expect(langSource).toContain('navigateToLang');
    expect(switcherSource).toContain('navigateToLang');
    expect(typeof navigateToLang).toBe('function');
  });

  it('bare `/` is FR x-default; ?lang= defers; path prefixes win', () => {
    expect(lookupPathLocalePreference('/', '')).toBe('fr');
    expect(lookupPathLocalePreference('/guides/', '')).toBe('fr');
    expect(lookupPathLocalePreference('/', '?lang=en')).toBeUndefined();
    expect(lookupPathLocalePreference('/en/', '')).toBe('en');
    expect(lookupPathLocalePreference('/es/guides/', '?lang=fr')).toBe('es');
    expect(langSource).toContain('lookupPathLocalePreference');
    expect(langSource).toContain("localStorage.setItem('i18nextLng'");
    expect(i18nSource).toContain('lookupPathLocalePreference');
    expect(themeJs).toMatch(/Bare guide paths = FR x-default/);
  });

  it('i18n detects pathLocale before querystring', () => {
    expect(i18nSource).toContain('pathLocale');
    expect(i18nSource).toContain('lookupPathLocalePreference');
    expect(i18nSource).toMatch(
      /order:\s*\[[^\]]*pathLocale[^\]]*querystring/
    );
  });

  it('vite builds locale home shells; redirects cover home+guides', () => {
    expect(viteConfig).toContain('localeHomeShellsPlugin');
    expect(localeShells).toContain('bakeLocaleHomeHtml');
    expect(localeShells).toContain('writeLocaleHomeShells');
    expect(localeShells).toContain("lang=\"${lang}\"");
    expect(localeShells).toMatch(/Quiz de fotografía/i);
    expect(localeShells).toContain('dist/{en,es,de}');
    // CF Pages: never ship query-string home → path rules (they match `/`).
    const activeRedirects = redirects
      .split('\n')
      .filter((l) => l.trim() && !l.trim().startsWith('#'))
      .join('\n');
    expect(activeRedirects).not.toMatch(/\?lang=/);
    expect(redirects).toMatch(/\/en\s+\/en\/\s+301/);
    expect(redirects).toMatch(/\/en\/guides\/\*\s+\/guides\/:splat\s+200/);
    expect(redirects).toMatch(/\/es\/guides\/\*\s+\/guides\/:splat\s+200/);
  });

  it('sitemap uses path locs (no ?lang=); 78 inventory', () => {
    const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    expect(locs).toHaveLength(78);
    expect(sitemapXml).not.toMatch(/\?lang=/);
    expect(locs).toContain('https://quiz.pixfan.fr/en/');
    expect(locs).toContain('https://quiz.pixfan.fr/es/');
    expect(locs).toContain('https://quiz.pixfan.fr/de/');
    expect(locs).toContain('https://quiz.pixfan.fr/es/guides/');
    expect(locs).toContain('https://quiz.pixfan.fr/de/guides/composition-photo');
  });

  it('home + guides announce path hreflang; switchers use path hrefs', () => {
    expect(indexHtml).toContain('hreflang="en" href="https://quiz.pixfan.fr/en/"');
    expect(indexHtml).toContain('hreflang="es" href="https://quiz.pixfan.fr/es/"');
    expect(indexHtml).toContain('href="/es/"');
    expect(guidesIndex).toContain('href="/es/guides/"');
    expect(guidesIndex).toContain('hreflang="es" href="https://quiz.pixfan.fr/es/guides/"');
    expect(hub).toContain('href="/de/guides/scolaires/"');
    expect(composition).toContain('href="/es/guides/composition-photo"');
    expect(composition).toMatch(/pathLang/);
    expect(fiche).toContain('fiche-seance.html');
    expect(themeJs).toContain('withLangHref');
    expect(themeJs).toMatch(/\/\$\{?lang\}?|lang === 'fr'|\/' \+ lang/);
  });

  it('catalogues ES+DE still 15/15; ops no-gos through 1.99; SVG kept', () => {
    const withoutEs = data.quizzes
      .filter((q) => q.title.es == null || q.title.es === '')
      .map((q) => q.id);
    const withoutDe = data.quizzes
      .filter((q) => q.title.de == null || q.title.de === '')
      .map((q) => q.id);
    expect(withoutEs).toEqual([]);
    expect(withoutDe).toEqual([]);
    expect(data.quizzes).toHaveLength(15);
    const pack = data.quizzes.find((q) => q.id === 'marques-photo')!;
    expect(collectLs(pack)).toHaveLength(194);
    expect(pickLocale(pack.title, 'de')).toMatch(/Markengeschichte/i);
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.(99|10[0-3])/);
    expect(appSource).toContain('className="dark-mode-toggle"');
    expect(appSource).toContain('dark-mode-toggle__icon');
  });
});
