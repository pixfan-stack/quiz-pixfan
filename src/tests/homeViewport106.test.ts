import { describe, expect, it } from 'vitest';
import questionsData from '../../public/data/questions.json';
import nextSteps from '../../NEXT_STEPS.md?raw';
import readme from '../../README.md?raw';
import indexHtml from '../../index.html?raw';
import sitemap from '../../public/sitemap.xml?raw';
import histoireGuide from '../../public/guides/histoire-photo.html?raw';
import { resolvePixfanTopic } from '../utils/pixfanCta';
import { pickLocale } from '../utils/locale';
import { quizLabel, ogThemeSlug } from '../../functions/lib/sharePreview';

const data = questionsData as {
  quizzes: Array<{
    id: string;
    title: { en: string; fr: string; es?: string; de?: string };
    questions: Array<{
      text: { en: string; fr: string; es?: string; de?: string };
      explanation?: { en: string; fr: string; es?: string; de?: string };
      answers: Array<{ text: { en: string; fr: string; es?: string; de?: string } }>;
    }>;
  }>;
};

describe('vague 1.106 — Nikon + Tamron histoire packs (QP-294)', () => {
  it('NEXT_STEPS cites v1.105.0 + vague 1.106; no-go through 1.106', () => {
    expect(nextSteps).toContain('**v1.105.0**');
    expect(nextSteps).toContain('Vague **1.106**');
    expect(nextSteps).toMatch(/no-go.*1\.106/);
    expect(nextSteps).toContain('nikon-histoire');
    expect(nextSteps).toContain('tamron-histoire');
    expect(readme).toMatch(/histoire de Nikon/i);
    expect(readme).toMatch(/histoire de Tamron/i);
  });

  it('catalog is 17 packs / 478 Q with both brand packs', () => {
    expect(data.quizzes).toHaveLength(17);
    const total = data.quizzes.reduce((n, q) => n + q.questions.length, 0);
    expect(total).toBe(478);
    expect(indexHtml).toContain('478 questions');
    expect(indexHtml).toContain('17 catégories');
    expect(indexHtml).toMatch(/histoire de Nikon/i);
    expect(indexHtml).toMatch(/histoire de Tamron/i);
  });

  it('nikon-histoire + tamron-histoire are fully localized and wired', () => {
    for (const id of ['nikon-histoire', 'tamron-histoire'] as const) {
      const pack = data.quizzes.find((q) => q.id === id);
      expect(pack, id).toBeDefined();
      expect(pack!.title.es).toBeTruthy();
      expect(pack!.title.de).toBeTruthy();
      expect(pickLocale(pack!.title, 'de')).toBeTruthy();
      expect(resolvePixfanTopic(id)).toBe('history');
      expect(quizLabel(id, 'fr')).toMatch(/Nikon|Tamron/);
      expect(ogThemeSlug(id)).toBe(id);
      for (const q of pack!.questions) {
        expect(q.text.es).toBeTruthy();
        expect(q.text.de).toBeTruthy();
        expect(q.explanation?.es).toBeTruthy();
        expect(q.explanation?.de).toBeTruthy();
        for (const a of q.answers) {
          expect(a.text.es).toBeTruthy();
          expect(a.text.de).toBeTruthy();
        }
      }
    }
  });

  it('sitemap lists both packs; guide histoire links them', () => {
    expect(sitemap).toContain('https://quiz.pixfan.fr/s/nikon-histoire');
    expect(sitemap).toContain('https://quiz.pixfan.fr/s/tamron-histoire');
    expect(histoireGuide).toContain('/s/nikon-histoire');
    expect(histoireGuide).toContain('/s/tamron-histoire');
  });
});
