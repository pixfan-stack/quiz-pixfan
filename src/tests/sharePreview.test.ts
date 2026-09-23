import { describe, it, expect } from 'vitest';
import {
  buildOgSvg,
  buildShareHtml,
  DAILY_THEME_CHIPS,
  dailyThemeChipForDate,
  normalizeQuizId,
  parseLang,
  parseScore,
  quizLabel,
} from '../../functions/lib/sharePreview';
import {
  DAILY_THEME_ROTATION,
  getDailyTheme,
} from '../utils/dailyChallenge';

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

  it('keeps daily theme chips in sync with editorial rotation', () => {
    expect(DAILY_THEME_CHIPS.length).toBe(DAILY_THEME_ROTATION.length);
    for (let i = 0; i < DAILY_THEME_ROTATION.length; i++) {
      expect(DAILY_THEME_CHIPS[i]!.fr).toBe(DAILY_THEME_ROTATION[i]!.chip.fr);
      expect(DAILY_THEME_CHIPS[i]!.en).toBe(DAILY_THEME_ROTATION[i]!.chip.en);
    }
  });

  it('labels known quizzes', () => {
    expect(quizLabel('composition', 'fr')).toContain('Composition');
    expect(quizLabel('lightroom-workflow', 'fr')).toBe('Workflow Lightroom');
    expect(quizLabel('lightroom-workflow', 'en')).toBe('Lightroom workflow');
    expect(normalizeQuizId('lightroom-workflow')).toBe('lightroom-workflow');
    expect(quizLabel('portrait-light', 'fr')).toBe('Portrait & lumière');
    expect(quizLabel('portrait-light', 'en')).toBe('Portrait & light');
    expect(normalizeQuizId('portrait-light')).toBe('portrait-light');
    expect(quizLabel('duel-abcd2345', 'en')).toBe('Friend duel');
  });

  it('includes editorial week chip in daily OG labels', () => {
    const date = new Date(Date.UTC(2026, 8, 21)); // 2026-09-21
    const theme = getDailyTheme(date);
    expect(quizLabel('daily-2026-09-21', 'fr')).toBe(
      `Défi du jour · ${theme.chip.fr}`
    );
    expect(quizLabel('daily-2026-09-21', 'en')).toBe(
      `Daily challenge · ${theme.chip.en}`
    );
    expect(dailyThemeChipForDate(date, 'fr')).toBe(theme.chip.fr);
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
      ogImageUrl: 'https://quiz.pixfan.fr/og-image.png?v=4',
      appOrigin: 'https://quiz.pixfan.fr',
    });
    expect(html).toContain('og:image');
    expect(html).toContain('/og-image.png');
    expect(html).toContain('fb:app_id');
    expect(html).toContain('1845182679783128');
    expect(html).toContain('/#/quiz/composition?score=80');
    expect(html).toContain('80 %');
  });

  it('builds daily share HTML with theme chip in title', () => {
    const date = new Date(Date.UTC(2026, 8, 21));
    const chip = getDailyTheme(date).chip.fr;
    const html = buildShareHtml({
      quizId: 'daily-2026-09-21',
      score: 90,
      lang: 'fr',
      pageUrl: 'https://quiz.pixfan.fr/s/daily-2026-09-21?score=90',
      ogImageUrl: 'https://quiz.pixfan.fr/og-image.png?v=4',
      appOrigin: 'https://quiz.pixfan.fr',
    });
    expect(html).toContain(chip);
    expect(html).toContain('og:title');
  });

  it('builds a mobile-friendly duel landing with large CTA', () => {
    const html = buildShareHtml({
      quizId: 'duel-abcd2345',
      score: 70,
      lang: 'fr',
      pageUrl: 'https://quiz.pixfan.fr/s/duel-abcd2345?score=70&lang=fr',
      ogImageUrl: 'https://quiz.pixfan.fr/og-image.png?v=4',
      appOrigin: 'https://quiz.pixfan.fr',
    });
    expect(html).toContain('Relever le duel');
    expect(html).toContain('class="cta"');
    expect(html).toContain('/#/quiz/duel-abcd2345?score=70');
    expect(html).toContain('viewport-fit=cover');
  });
});
