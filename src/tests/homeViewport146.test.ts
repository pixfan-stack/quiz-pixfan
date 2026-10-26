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

describe('vague 1.46 — docs v1.45.0 + light-color LocalizedString.es', () => {
  it('docs still mention vague 1.45; no-go line covers 1.46+', () => {
    /* Docs headline moved to v1.46.0 in vague 1.47 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.45**');
    expect(nextSteps).toMatch(/no-go.*1\.46/);
    expect(readme).toMatch(/v1\.(4[56789]|5[0123456789]|60)\.0/);
  });

  it('light-color ships .es on all LocalizedString fields (182)', () => {
    const pack = data.quizzes.find((q) => q.id === 'light-color');
    expect(pack).toBeTruthy();
    const ls = collectLs(pack!);
    expect(ls).toHaveLength(182);
    for (const item of ls) {
      expect(item.es?.trim().length, JSON.stringify(item)).toBeGreaterThan(0);
      expect(item.es).not.toBe(item.en);
    }
  });

  it('pickLocale returns Spanish for light-color title when lang=es', () => {
    const pack = data.quizzes.find((q) => q.id === 'light-color')!;
    expect(pickLocale(pack.title, 'es')).toBe('Luz y color');
    expect(pickLocale(pack.title, 'es')).not.toBe(pack.title.en);
    expect(pickLocale(pack.questions[0].text, 'es')).toContain('hora dorada');
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

  it('still no hreflang de (es unlocked in 1.57 — historical)', () => {
    for (const html of [triangle, composition]) {
      /* hreflang es unlocked in vague 1.57 on article.es pages */
      expect(html).not.toContain('hreflang="de"');
    }
  });
});
