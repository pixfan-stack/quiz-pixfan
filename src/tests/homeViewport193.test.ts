import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';
import appSource from '../App.tsx?raw';
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

describe('vague 1.93 — docs v1.92.0 + marques-photo LocalizedString.de', () => {
  it('docs headline cites v1.92.0+; vague 1.92/1.93 listed; no-go through 1.93+', () => {
    // Softened in 1.94: headline may cite v1.93.0 (Livré pattern)
    expect(readme).toMatch(/v1\.9[23]\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.9[23]\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.92**');
    expect(nextSteps).toContain('Vague **1.93**');
    expect(nextSteps).toMatch(/no-go.*1\.9[34]/);
  });

  it('marques-photo ships .de on all LocalizedString fields (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'marques-photo');
    expect(pack).toBeTruthy();
    const ls = collectLs(pack!);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.de?.trim().length, JSON.stringify(item)).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('pickLocale returns German for marques-photo title when lang=de', () => {
    const pack = data.quizzes.find((q) => q.id === 'marques-photo')!;
    expect(pickLocale(pack.title, 'de')).toMatch(/Markengeschichte/i);
    expect(pickLocale(pack.title, 'de')).not.toBe(pack.title.en);
    expect(pickLocale(pack.questions[0].text, 'de')).toMatch(
      /Canon|Japan|1930/i
    );
  });

  it('lexique-image-fixe .de still intact (74)', () => {
    const pack = data.quizzes.find((q) => q.id === 'lexique-image-fixe')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(74);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('photo-rights .de still intact (180)', () => {
    const pack = data.quizzes.find((q) => q.id === 'photo-rights')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(180);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('light-color .de still intact (182)', () => {
    const pack = data.quizzes.find((q) => q.id === 'light-color')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(182);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('flash-studio .de still intact (184)', () => {
    const pack = data.quizzes.find((q) => q.id === 'flash-studio')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(184);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('retouching .de still intact (190)', () => {
    const pack = data.quizzes.find((q) => q.id === 'retouching')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(190);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('history-icons .de still intact (192)', () => {
    const pack = data.quizzes.find((q) => q.id === 'history-icons')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(192);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('portrait-light .de still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'portrait-light')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('public-domain .de still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'public-domain')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('exposure-basics .de still intact (226)', () => {
    const pack = data.quizzes.find((q) => q.id === 'exposure-basics')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(226);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('genres .de still intact (226)', () => {
    const pack = data.quizzes.find((q) => q.id === 'genres')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(226);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('composition .de still intact (230)', () => {
    const pack = data.quizzes.find((q) => q.id === 'composition')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(230);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('smartphone .de still intact (230)', () => {
    const pack = data.quizzes.find((q) => q.id === 'smartphone')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(230);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('gear-lenses .de still intact (192)', () => {
    const pack = data.quizzes.find((q) => q.id === 'gear-lenses')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(192);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('lightroom-workflow .de still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'lightroom-workflow')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.de?.trim().length).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('composition .es still intact (230)', () => {
    const pack = data.quizzes.find((q) => q.id === 'composition')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(230);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('genres .es still intact (226)', () => {
    const pack = data.quizzes.find((q) => q.id === 'genres')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(226);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('marques-photo .es still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'marques-photo')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('lightroom-workflow .es still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'lightroom-workflow')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('gear-lenses .es still intact (192)', () => {
    const pack = data.quizzes.find((q) => q.id === 'gear-lenses')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(192);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('smartphone .es still intact (230)', () => {
    const pack = data.quizzes.find((q) => q.id === 'smartphone')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(230);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('jalon: 0 scolaire remaining without title.es', () => {
    const withoutEs = data.quizzes
      .filter((q) => (q.tags ?? []).includes('scolaires'))
      .filter((q) => q.title.es == null || q.title.es === '')
      .map((q) => q.id);
    expect(withoutEs).toEqual([]);
  });

  it('jalon: 0 non-scolaire remaining without title.es (série ES catalogue fermée)', () => {
    const withoutEs = data.quizzes
      .filter((q) => !(q.tags ?? []).includes('scolaires'))
      .filter((q) => q.title.es == null || q.title.es === '')
      .map((q) => q.id);
    expect(withoutEs).toEqual([]);
  });

  it('jalon scolaire DE: 0 scolaire remaining without title.de', () => {
    const withoutDe = data.quizzes
      .filter((q) => (q.tags ?? []).includes('scolaires'))
      .filter((q) => q.title.de == null || q.title.de === '')
      .map((q) => q.id);
    expect(withoutDe).toEqual([]);
  });

  it('série DE catalogue fermée: all 15 packs have title.de (0 without)', () => {
    const withDe = data.quizzes
      .filter((q) => q.title.de != null && q.title.de !== '')
      .map((q) => q.id)
      .sort();
    expect(withDe).toEqual([
      'composition',
      'exposure-basics',
      'flash-studio',
      'gear-lenses',
      'genres',
      'history-icons',
      'lexique-image-fixe',
      'light-color',
      'lightroom-workflow',
      'marques-photo',
      'photo-rights',
      'portrait-light',
      'public-domain',
      'retouching',
      'smartphone',
    ]);
    expect(data.quizzes.length - withDe.length).toBe(0);
    expect(nextSteps).toMatch(/complets \(15\/15\)/);
    expect(nextSteps).toMatch(/complets \(15\/15\)/);
  });

  it('still no path-locale /es/|/de/; catalogue .de complete; ops no-gos through 1.93+; SVG theme toggle', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    // Softened in 1.94: no-go line may extend through 1.94
    expect(nextSteps).toMatch(/no-go.*1\.9[34]/);
    expect(
      data.quizzes.every((q) => {
        const title = q.title as { de?: string };
        return title.de != null && title.de !== '';
      })
    ).toBe(true);
    expect(appSource).toContain('className="dark-mode-toggle"');
    expect(appSource).toContain('dark-mode-toggle__icon');
    expect(appSource).not.toContain("'🌙'");
    expect(appSource).not.toContain("'☀️'");
  });
});
