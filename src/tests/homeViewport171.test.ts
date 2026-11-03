import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';
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

describe('vague 1.71 — docs v1.70.0 + public-domain LocalizedString.es', () => {
  it('docs still mention vague 1.70/1.71; no-go through 1.71; headline may be v1.78.0', () => {
    /* Docs headline moved to v1.78.0 in vague 1.79 — keep historical Livré lock. */
    expect(readme).toMatch(/v1\.(70|71|72|73|74|75|76|77|78)\.\d/);
    expect(nextSteps).toMatch(/\*\*v1\.(70|71|72|73|74|75|76|77|78)\.\d+\*\*/);
    expect(nextSteps).toContain('Vague **1.70**');
    expect(nextSteps).toContain('Vague **1.71**');
    expect(nextSteps).toMatch(/no-go.*1\.71/);
  });

  it('public-domain ships .es on all LocalizedString fields (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'public-domain');
    expect(pack).toBeTruthy();
    const ls = collectLs(pack!);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.es?.trim().length, JSON.stringify(item)).toBeGreaterThan(0);
      expect(item.es).not.toBe(item.en);
    }
  });

  it('pickLocale returns Spanish for public-domain title when lang=es', () => {
    const pack = data.quizzes.find((q) => q.id === 'public-domain')!;
    expect(pickLocale(pack.title, 'es')).toBe('Galería de dominio público');
    expect(pickLocale(pack.title, 'es')).not.toBe(pack.title.en);
    expect(pickLocale(pack.questions[0].text, 'es')).toContain('fotografía');
  });

  it('portrait-light .es still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'portrait-light')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('history-icons .es still intact (192)', () => {
    const pack = data.quizzes.find((q) => q.id === 'history-icons')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(192);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('jalon: 0 non-scolaire remaining without title.es (série closed in 1.78)', () => {
    /* marques-photo .es 1.78 — drop historical without-es lock. */
    const withoutEs = data.quizzes
      .filter((q) => !(q.tags ?? []).includes('scolaires'))
      .filter((q) => q.title.es == null || q.title.es === '')
      .map((q) => q.id);
    expect(withoutEs).toEqual([]);
  });

  it('still no path-locale /es/|/de/; only lexique catalogue .de; ops no-gos through 1.71', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.71/);
    /* Vague 1.79 toe-hold — lexique-image-fixe may ship title.de; others must not. */
    expect(
      data.quizzes
        .filter((q) => q.id !== 'lexique-image-fixe')
        .every((q) => {
          const title = q.title as { de?: string };
          return title.de == null || title.de === '';
        })
    ).toBe(true);
  });
});
