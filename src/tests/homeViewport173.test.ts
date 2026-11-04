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

describe('vague 1.73 — docs v1.72.0 + genres LocalizedString.es', () => {
  it('docs still mention vague 1.72/1.73; no-go through 1.73; headline may be v1.80.0', () => {
    /* Docs headline moved to v1.80.0 in vague 1.81 — keep historical Livré lock. */
    expect(readme).toMatch(/v1\.(72|73|74|75|76|77|78|79|80|81|82|83)\.\d/);
    expect(nextSteps).toMatch(/\*\*v1\.(72|73|74|75|76|77|78|79|80|81|82|83)\.\d+\*\*/);
    expect(nextSteps).toContain('Vague **1.72**');
    expect(nextSteps).toContain('Vague **1.73**');
    expect(nextSteps).toMatch(/no-go.*1\.73/);
  });

  it('genres ships .es on all LocalizedString fields (226)', () => {
    const pack = data.quizzes.find((q) => q.id === 'genres');
    expect(pack).toBeTruthy();
    const ls = collectLs(pack!);
    expect(ls).toHaveLength(226);
    for (const item of ls) {
      expect(item.es?.trim().length, JSON.stringify(item)).toBeGreaterThan(0);
      expect(item.es).not.toBe(item.en);
    }
  });

  it('pickLocale returns Spanish for genres title when lang=es', () => {
    const pack = data.quizzes.find((q) => q.id === 'genres')!;
    expect(pickLocale(pack.title, 'es')).toBe('Géneros fotográficos');
    expect(pickLocale(pack.title, 'es')).not.toBe(pack.title.en);
    expect(pickLocale(pack.questions[0].text, 'es')).toContain('calle');
  });

  it('exposure-basics .es still intact (226)', () => {
    const pack = data.quizzes.find((q) => q.id === 'exposure-basics')!;
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

  it('jalon: 0 non-scolaire remaining without title.es (série closed in 1.78)', () => {
    /* marques-photo .es 1.78 — drop historical without-es lock. */
    const withoutEs = data.quizzes
      .filter((q) => !(q.tags ?? []).includes('scolaires'))
      .filter((q) => q.title.es == null || q.title.es === '')
      .map((q) => q.id);
    expect(withoutEs).toEqual([]);
  });

  it('still no path-locale /es/|/de/; only lexique catalogue .de; ops no-gos through 1.73; SVG theme toggle', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.73/);
    /* Vague 1.79–1.84 — lexique-image-fixe + photo-rights + light-color + flash-studio + retouching + history-icons may ship title.de; others must not. */
    expect(
      data.quizzes
        .filter((q) => q.id !== 'lexique-image-fixe' && q.id !== 'photo-rights' && q.id !== 'light-color' && q.id !== 'flash-studio' && q.id !== 'retouching' && q.id !== 'history-icons')
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
