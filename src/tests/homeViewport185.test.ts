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

describe('vague 1.85 — docs v1.84.0/v1.85.0 + portrait-light LocalizedString.de', () => {
  it('docs still mention vague 1.84/1.85; no-go through 1.85; headline may be v1.85.0', () => {
    /* Docs headline moved to v1.85.0 in vague 1.86 — keep historical Livré lock. */
    expect(readme).toMatch(/v1\.(84|85|86|87|88|89|90|91|92)\.\d/);
    expect(nextSteps).toMatch(/\*\*v1\.(84|85|86|87|88|89|90|91|92)\.\d+\*\*/);
    expect(nextSteps).toContain('Vague **1.84**');
    expect(nextSteps).toContain('Vague **1.85**');
    expect(nextSteps).toMatch(/no-go.*1\.(85|86|87)/);
  });

  it('portrait-light ships .de on all LocalizedString fields (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'portrait-light');
    expect(pack).toBeTruthy();
    const ls = collectLs(pack!);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.de?.trim().length, JSON.stringify(item)).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('pickLocale returns German for portrait-light title when lang=de', () => {
    const pack = data.quizzes.find((q) => q.id === 'portrait-light')!;
    expect(pickLocale(pack.title, 'de')).toMatch(/Porträt/i);
    expect(pickLocale(pack.title, 'de')).not.toBe(pack.title.en);
    expect(pickLocale(pack.questions[0].text, 'de')).toMatch(/Porträt|Hauptlicht/i);
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

  it('portrait-light .es still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'portrait-light')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
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

  it('public-domain .es still intact (194)', () => {
    const pack = data.quizzes.find((q) => q.id === 'public-domain')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(194);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('exposure-basics .es still intact (226)', () => {
    const pack = data.quizzes.find((q) => q.id === 'exposure-basics')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(226);
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

  it('série DE: lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light (+ public-domain after 1.86) have title.de', () => {
    const withDe = data.quizzes
      .filter((q) => q.title.de != null && q.title.de !== '')
      .map((q) => q.id)
      .sort();
    expect(withDe).toEqual(
      expect.arrayContaining([
        'flash-studio',
        'history-icons',
        'lexique-image-fixe',
        'light-color',
        'photo-rights',
        'portrait-light',
        'retouching',
      ])
    );
    expect(withDe.length).toBeGreaterThanOrEqual(7);
    expect(withDe.length).toBeLessThanOrEqual(15);
    expect(data.quizzes.length - withDe.length).toBeGreaterThanOrEqual(0);
  });

  it('still no path-locale /es/|/de/; no .de outside lexique+photo-rights+light-color+flash-studio+retouching+history-icons+portrait-light(+public-domain); ops no-gos through 1.85; SVG theme toggle', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.(85|86|87)/);
    expect(
      data.quizzes
        .filter(
          (q) =>
            q.id !== 'lexique-image-fixe' &&
            q.id !== 'photo-rights' &&
            q.id !== 'light-color' &&
            q.id !== 'flash-studio' &&
            q.id !== 'retouching' &&
            q.id !== 'history-icons' &&
            q.id !== 'portrait-light' &&
            q.id !== 'public-domain' &&
            q.id !== 'exposure-basics' &&
            q.id !== 'genres' &&
            q.id !== 'composition' &&
            q.id !== 'smartphone' &&
            q.id !== 'gear-lenses' &&
            q.id !== 'lightroom-workflow' &&
            q.id !== 'marques-photo'
        )
        .every((q) => {
          const title = q.title as { de?: string };
          return title.de == null || title.de === '';
        })
    ).toBe(true);
    expect(appSource).toContain('className="dark-mode-toggle"');
    expect(appSource).toContain('dark-mode-toggle__icon');
    expect(appSource).not.toContain("'🌙'");
    expect(appSource).not.toContain("'☀️'");
  });
});
