import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import questionsData from '../../public/data/questions.json';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
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

describe('vague 1.47 — docs v1.46.0 + flash-studio LocalizedString.es', () => {
  it('docs headline cites v1.46.0; vague 1.46 listed; no-go through 1.47', () => {
    expect(readme).toContain('v1.46.0');
    expect(nextSteps).toContain('**v1.46.0**');
    expect(nextSteps).toContain('Vague **1.46**');
    expect(nextSteps).toMatch(/no-go.*1\.47/);
  });

  it('flash-studio ships .es on all LocalizedString fields (184)', () => {
    const pack = data.quizzes.find((q) => q.id === 'flash-studio');
    expect(pack).toBeTruthy();
    const ls = collectLs(pack!);
    expect(ls).toHaveLength(184);
    for (const item of ls) {
      expect(item.es?.trim().length, JSON.stringify(item)).toBeGreaterThan(0);
      expect(item.es).not.toBe(item.en);
    }
  });

  it('pickLocale returns Spanish for flash-studio title when lang=es', () => {
    const pack = data.quizzes.find((q) => q.id === 'flash-studio')!;
    expect(pickLocale(pack.title, 'es')).toBe('Flash y estudio');
    expect(pickLocale(pack.title, 'es')).not.toBe(pack.title.en);
    expect(pickLocale(pack.questions[0].text, 'es')).toContain('TTL');
  });

  it('light-color .es still intact (182)', () => {
    const pack = data.quizzes.find((q) => q.id === 'light-color')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(182);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('photo-rights .es still intact (180)', () => {
    const pack = data.quizzes.find((q) => q.id === 'photo-rights')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(180);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('lexique-image-fixe .es toe-hold still intact (74)', () => {
    const pack = data.quizzes.find((q) => q.id === 'lexique-image-fixe')!;
    const ls = collectLs(pack);
    expect(ls).toHaveLength(74);
    for (const item of ls) {
      expect(item.es?.trim().length).toBeGreaterThan(0);
    }
  });

  it('still no hreflang es/de on topic guides (content not translated)', () => {
    for (const html of [triangle, composition]) {
      expect(html).not.toContain('hreflang="es"');
      expect(html).not.toContain('hreflang="de"');
    }
  });
});
