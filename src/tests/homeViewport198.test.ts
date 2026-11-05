import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';
import appSource from '../App.tsx?raw';
import themeJs from '../../public/guides/theme.js?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import hub from '../../public/guides/scolaires/index.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import indexHtml from '../../index.html?raw';
import robotsTxt from '../../public/robots.txt?raw';
import sitemapXml from '../../public/sitemap.xml?raw';
import redirects from '../../public/_redirects?raw';
import questionsData from '../../public/data/questions.json';
import { pickLocale } from '../utils/locale';
import type { LocalizedString } from '../types/quiz';

type Ls = { en: string; fr: string; es?: string; de?: string };

const data = questionsData as {
  quizzes: Array<{
    id: string;
    tags?: string[];
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

const guidePagesWithTheme = [guidesIndex, hub, composition, fiche];

describe('vague 1.98 — sitemap refresh + crawlable Googlebot text', () => {
  it('docs headline cites v1.97.0; vague 1.98 listed; no-go through 1.98', () => {
    expect(readme).toContain('v1.97.0');
    expect(nextSteps).toContain('**v1.97.0**');
    expect(nextSteps).toContain('Vague **1.98**');
    expect(nextSteps).toMatch(/no-go.*1\.98/);
    expect(nextSteps).not.toMatch(
      /suite.*path\s*`?\/es\/`?\s*`?\/de\/`?\s*comme suite automatique/i
    );
  });

  it('NEXT_STEPS announces sitemap + crawl text (not automatic path ship)', () => {
    expect(nextSteps).toMatch(/sitemap|lastmod|crawl/i);
    expect(nextSteps).toMatch(/noscript|FAQ|Googlebot/i);
    expect(nextSteps).toMatch(/path no-go|reste no-go|reste interdit/i);
    expect(nextSteps).not.toMatch(
      /Vague \*\*1\.98\*\*.*ship.*\/es\/|Vague \*\*1\.98\*\*.*path-locale/i
    );
  });

  it('sitemap lastmod floor 2026-11-05; 74 locs; no path-locale', () => {
    expect(sitemapXml).toContain('<?xml');
    expect(sitemapXml).toContain('<urlset');
    const locs = [...sitemapXml.matchAll(/<loc>/g)];
    expect(locs).toHaveLength(74);
    expect(sitemapXml).toContain('<lastmod>2026-11-05</lastmod>');
    expect(sitemapXml).not.toMatch(/<lastmod>2026-10-\d{2}<\/lastmod>/);
    expect(sitemapXml).not.toMatch(/quiz\.pixfan\.fr\/(es|de|en|fr)\//);
    expect(robotsTxt).toContain('Sitemap: https://quiz.pixfan.fr/sitemap.xml');
    expect(redirects).toMatch(/\/sitemap\.xml\s+\/sitemap\.xml\s+200/);
  });

  it('home has crawlable noscript + FAQ catalogues complets (no stale DE)', () => {
    expect(indexHtml).toMatch(/<noscript>[\s\S]*<h1>[\s\S]*Quiz PixFan/i);
    expect(indexHtml).toContain('href="/guides/"');
    expect(indexHtml).toContain('href="/s/daily"');
    expect(indexHtml).toContain('href="/s/photo-reading"');
    expect(indexHtml).toMatch(/FR\/EN\/ES\/DE/);
    expect(indexHtml).toMatch(/catalogues? de questions FR, EN, ES et DE sont complets/i);
    expect(indexHtml).toMatch(/Question catalogs in FR, EN, ES, and DE are complete/i);
    expect(indexHtml).not.toMatch(/catalogue DE n.est pas encore traduit/i);
    expect(indexHtml).not.toMatch(/DE catalog is not translated yet/i);
    expect(indexHtml).not.toMatch(/noch nicht übersetzt/i);
    expect(indexHtml).toMatch(/name=["']robots["'][^>]*content=["'][^"']*index/i);
  });

  it('guides hub lead declares FR/EN/ES/DE quizzes', () => {
    expect(guidesIndex).toContain('FR/EN/ES/DE');
    expect(guidesIndex).not.toMatch(
      /quiz interactifs de Quiz PixFan \(386 questions, 268 illustrées, FR\/EN\)\./
    );
  });

  it('theme.js preserves ?lang= on Guides/Schools chrome hrefs (1.95 regress)', () => {
    expect(themeJs).toContain('withLangHref');
    expect(themeJs).toContain('isGuidesHubHref');
    expect(themeJs).toContain('isScolairesHubHref');
    expect(themeJs).toContain("'?lang='");
    expect(themeJs).not.toContain("'/es/'");
    expect(themeJs).not.toContain("'/de/'");
  });

  it('theme.js keeps 1.94 chrome labels + es/de theme strings + SVG', () => {
    expect(themeJs).toContain("guides: 'Guías'");
    expect(themeJs).toContain("scolaires: 'Colegios'");
    expect(themeJs).toContain("guides: 'Leitfäden'");
    expect(themeJs).toContain("scolaires: 'Schule'");
    expect(themeJs).toContain("'Modo noche'");
    expect(themeJs).toContain("'Nachtmodus'");
    expect(themeJs).toContain('ICON_MOON');
    expect(themeJs).toContain('ICON_SUN');
    expect(themeJs).toContain('dark-mode-toggle__icon');
    expect(themeJs).not.toContain("'🌙'");
    expect(themeJs).not.toContain("'☀️'");
  });

  it('all guide HTML pages load theme.js; ?lang= model retained', () => {
    for (const html of guidePagesWithTheme) {
      expect(html).toContain('src="/guides/theme.js"');
    }
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(guidesIndex).toContain('href="?lang=es"');
    expect(guidesIndex).toContain('href="?lang=de"');
    expect(hub).toContain('href="?lang=es"');
    expect(hub).toContain('href="?lang=de"');
    expect(composition).not.toMatch(/href="\/es\//);
    expect(composition).not.toMatch(/href="\/de\//);
  });

  it('jalon: catalogues ES+DE still 15/15 (0 without title.es|de)', () => {
    const withoutEs = data.quizzes
      .filter((q) => q.title.es == null || q.title.es === '')
      .map((q) => q.id);
    const withoutDe = data.quizzes
      .filter((q) => q.title.de == null || q.title.de === '')
      .map((q) => q.id);
    expect(withoutEs).toEqual([]);
    expect(withoutDe).toEqual([]);
    expect(data.quizzes).toHaveLength(15);
    expect(nextSteps).toMatch(/complets \(15\/15\)/);
  });

  it('marques-photo .de still intact (194); ops no-gos through 1.98; SVG kept', () => {
    const pack = data.quizzes.find((q) => q.id === 'marques-photo')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
    expect(pickLocale(pack.title, 'de')).toMatch(/Markengeschichte/i);
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.98/);
    expect(appSource).toContain('className="dark-mode-toggle"');
    expect(appSource).toContain('dark-mode-toggle__icon');
  });
});
