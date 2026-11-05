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

describe('vague 1.95 — docs v1.94.0 + chrome ?lang= href preservation', () => {
  it('docs headline cites v1.94.0+; vague 1.94/1.95 listed; no-go through 1.95+', () => {
    // Softened in 1.96/1.97: headline may cite v1.95.0 (Livré pattern)
    expect(readme).toMatch(/v1\.9[4-8]\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.9[4-8]\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.94**');
    expect(nextSteps).toContain('Vague **1.95**');
    expect(nextSteps).toMatch(/no-go.*1\.9[5-7]/);
    expect(nextSteps).toMatch(/\?lang=/);
    expect(nextSteps).toMatch(/href.*chrome|préserv/i);
    expect(nextSteps).not.toMatch(
      /suite.*path\s*`?\/es\/`?\s*`?\/de\/`?\s*comme suite automatique/i
    );
  });

  it('theme.js preserves ?lang= on Guides/Schools chrome hrefs (no path locale)', () => {
    expect(themeJs).toContain('withLangHref');
    expect(themeJs).toContain('isGuidesHubHref');
    expect(themeJs).toContain('isScolairesHubHref');
    expect(themeJs).toContain("'?lang='");
    expect(themeJs).toContain('setAttribute');
    expect(themeJs).toContain('href');
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

  it('ops no-gos through 1.95+; SVG theme toggle kept in App', () => {
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    // Softened in 1.96/1.97: no-go line may extend through 1.97
    expect(nextSteps).toMatch(/no-go.*1\.9[5-7]/);
    expect(appSource).toContain('className="dark-mode-toggle"');
    expect(appSource).toContain('dark-mode-toggle__icon');
  });
});
