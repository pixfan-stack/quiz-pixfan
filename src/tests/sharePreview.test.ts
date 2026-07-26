import { describe, it, expect } from 'vitest';
import {
  buildOgSvg,
  buildShareHtml,
  normalizeQuizId,
  parseLang,
  parseScore,
  quizLabel,
} from '../../functions/lib/sharePreview';

describe('sharePreview', () => {
  it('normalizes quiz ids', () => {
    expect(normalizeQuizId('composition')).toBe('composition');
    expect(normalizeQuizId('daily-2026-07-26')).toBe('daily-2026-07-26');
    expect(normalizeQuizId('duel-abcd2345')).toBe('duel-abcd2345');
    expect(normalizeQuizId('../evil')).toBeNull();
    expect(normalizeQuizId('')).toBeNull();
  });

  it('parses score and lang', () => {
    expect(parseScore('80')).toBe(80);
    expect(parseScore('150')).toBe(100);
    expect(parseScore('-5')).toBe(0);
    expect(parseScore('x')).toBeNull();
    expect(parseLang('fr-FR')).toBe('fr');
    expect(parseLang('en')).toBe('en');
  });

  it('labels known quizzes', () => {
    expect(quizLabel('composition', 'fr')).toContain('Composition');
    expect(quizLabel('daily-2026-07-26', 'fr')).toBe('Défi du jour');
    expect(quizLabel('duel-abcd2345', 'en')).toBe('Friend duel');
  });

  it('builds SVG and HTML previews', () => {
    const svg = buildOgSvg({
      quizId: 'composition',
      score: 80,
      lang: 'fr',
    });
    expect(svg).toContain('<svg');
    expect(svg).toContain('80%');
    expect(svg).toContain('Quiz PixFan');

    const html = buildShareHtml({
      quizId: 'composition',
      score: 80,
      lang: 'fr',
      pageUrl: 'https://quiz.pixfan.fr/s/composition?score=80',
      ogImageUrl: 'https://quiz.pixfan.fr/api/og?quiz=composition&score=80',
      appOrigin: 'https://quiz.pixfan.fr',
    });
    expect(html).toContain('og:image');
    expect(html).toContain('/#/quiz/composition');
    expect(html).toContain('80 %');
  });
});
