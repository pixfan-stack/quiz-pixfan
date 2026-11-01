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
  it('docs headline cites v1.70.0; vague 1.70/1.71 listed; no-go through 1.71', () => {
    expect(readme).toContain('v1.70.0');
    expect(nextSteps).toContain('**v1.70.0**');
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

  it('remaining scolaires + non-scolaires still lack title.es', () => {
    const withoutEs = [
      'composition',
      'exposure-basics',
      'gear-lenses',
      'genres',
      'lightroom-workflow',
      'marques-photo',
      'smartphone',
    ];
    for (const id of withoutEs) {
      const pack = data.quizzes.find((q) => q.id === id)!;
      expect(pack.title.es == null || pack.title.es === '', id).toBe(true);
    }
  });

  it('still no path-locale /es/|/de/; no catalogue .de; ops no-gos through 1.71', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.71/);
    expect(
      data.quizzes.every((q) => {
        const title = q.title as { de?: string };
        return title.de == null || title.de === '';
      })
    ).toBe(true);
  });
});
