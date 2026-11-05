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

describe('vague 1.94 — docs v1.93.0 + Guides/Schools chrome i18n residual', () => {
  it('docs headline cites v1.93.0+; vague 1.93/1.94 listed; no-go through 1.94+', () => {
    // Softened in 1.95–1.97: headline may cite later Livré versions
    expect(readme).toMatch(/v1\.9[3-8]\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.9[3-8]\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.93**');
    expect(nextSteps).toContain('Vague **1.94**');
    expect(nextSteps).toMatch(/no-go.*1\.9[4-7]/);
    expect(nextSteps).toMatch(/chrome|residual/i);
    expect(nextSteps).not.toMatch(
      /suite.*path\s*`?\/es\/`?\s*`?\/de\/`?\s*comme suite automatique/i
    );
  });

  it('theme.js ships chrome labels for fr/en/es/de (≠ FR-only Scolaires)', () => {
    expect(themeJs).toContain("guides: 'Guides'");
    expect(themeJs).toContain("scolaires: 'Scolaires'");
    expect(themeJs).toContain("scolaires: 'Schools'");
    expect(themeJs).toContain("guides: 'Guías'");
    expect(themeJs).toContain("scolaires: 'Colegios'");
    expect(themeJs).toContain("guides: 'Leitfäden'");
    expect(themeJs).toContain("scolaires: 'Schule'");
    expect(themeJs).toContain('applyChromeLabels');
    expect(themeJs).toContain('resolveLang');
  });

  it('theme.js dark/light labels cover es+de (≠ EN-only stub for non-FR)', () => {
    expect(themeJs).toContain("'Modo noche'");
    expect(themeJs).toContain("'Modo día'");
    expect(themeJs).toContain("'Nachtmodus'");
    expect(themeJs).toContain("'Tagmodus'");
    expect(themeJs).toContain("'Nuit'");
    expect(themeJs).toContain("'Dark'");
    expect(themeJs).not.toContain("document.documentElement.lang !== 'fr'");
  });

  it('all guide HTML pages load theme.js (single helper)', () => {
    for (const html of guidePagesWithTheme) {
      expect(html).toContain('src="/guides/theme.js"');
    }
  });

  it('?lang= model retained — no /es/|/de/ path prefixes in switcher or guides chrome', () => {
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

  it('marques-photo .de still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'marques-photo')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
    expect(pickLocale(pack.title, 'de')).toMatch(/Markengeschichte/i);
  });

  it('lightroom-workflow .de still intact (194) sample prior', () => {
    const pack = data.quizzes.find((q) => q.id === 'lightroom-workflow')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('ops no-gos through 1.94+; SVG theme toggle kept', () => {
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    // Softened in 1.95–1.97: no-go line may extend through 1.97
    expect(nextSteps).toMatch(/no-go.*1\.9[4-7]/);
    expect(themeJs).toContain('ICON_MOON');
    expect(themeJs).toContain('ICON_SUN');
    expect(themeJs).toContain('dark-mode-toggle__icon');
    expect(themeJs).not.toContain("'🌙'");
    expect(themeJs).not.toContain("'☀️'");
    expect(appSource).toContain('className="dark-mode-toggle"');
    expect(appSource).toContain('dark-mode-toggle__icon');
  });
});
