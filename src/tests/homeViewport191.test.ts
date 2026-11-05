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

describe('vague 1.91 — docs v1.90.0 + gear-lenses LocalizedString.de', () => {
  it('docs headline cites v1.90.0 or later; vague 1.90/1.91 listed; no-go through 1.91+', () => {
    expect(readme).toMatch(/v1\.90\.0|v1\.91\.0|v1\.92\.0|v1\.93\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.90\.0\*\*|\*\*v1\.91\.0\*\*|\*\*v1\.92\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.90**');
    expect(nextSteps).toContain('Vague **1.91**');
    expect(nextSteps).toMatch(/no-go.*1\.91|no-go.*1\.92|no-go.*1\.93/);
  });

  it('gear-lenses ships .de on all LocalizedString fields (192)', () => {
    const pack = data.quizzes.find((q) => q.id === 'gear-lenses');
    expect(pack).toBeTruthy();
    const ls = collectLs(pack!);
    expect(ls).toHaveLength(192);
    for (const item of ls) {
      expect(item.de?.trim().length, JSON.stringify(item)).toBeGreaterThan(0);
      expect(item.de).not.toBe(item.en);
    }
  });

  it('pickLocale returns German for gear-lenses title when lang=de', () => {
    const pack = data.quizzes.find((q) => q.id === 'gear-lenses')!;
    expect(pickLocale(pack.title, 'de')).toMatch(
      /Ausrüstung & Objektive/i
    );
    expect(pickLocale(pack.title, 'de')).not.toBe(pack.title.en);
    expect(pickLocale(pack.questions[0].text, 'de')).toMatch(
      /Vollformat|50.?mm|normal/i
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

  it('série DE: lexique + photo-rights + light-color + flash-studio + retouching + history-icons + portrait-light + public-domain + exposure-basics + genres + composition + smartphone + gear-lenses (+ lightroom-workflow allowed) have title.de', () => {
    const withDe = new Set(
      data.quizzes
        .filter((q) => q.title.de != null && q.title.de !== '')
        .map((q) => q.id)
    );
    for (const id of [
      'composition',
      'exposure-basics',
      'flash-studio',
      'gear-lenses',
      'genres',
      'history-icons',
      'lexique-image-fixe',
      'light-color',
      'photo-rights',
      'portrait-light',
      'public-domain',
      'retouching',
      'smartphone',
    ]) {
      expect(withDe.has(id), id).toBe(true);
    }
    // lightroom-workflow / marques-photo may appear once vague 1.92/1.93 ship
    expect(withDe.size).toBeGreaterThanOrEqual(13);
    expect(withDe.size).toBeLessThanOrEqual(15);
    expect(data.quizzes.length - withDe.size).toBeLessThanOrEqual(2); // marques-photo may ship in 1.93
  });

  it('still no path-locale /es/|/de/; no .de outside prior packs + gear-lenses/lightroom; ops no-gos through 1.91+; SVG theme toggle', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.91|no-go.*1\.92|no-go.*1\.93/);
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
