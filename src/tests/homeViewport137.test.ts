import { describe, expect, it } from 'vitest';
import hub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import featuredSource from '../components/quiz-selector/FeaturedQuizCards.tsx?raw';
import scolairesSource from '../components/ScolairesScreen.tsx?raw';
import fr from '../../public/locales/fr/translation.json';
import en from '../../public/locales/en/translation.json';

describe('EN meta/og + quiet chrome (vague 1.37)', () => {
  it('hub and fiche set EN meta description + og on ?lang=en', () => {
    expect(hub).toContain(
      "var enTitle = 'Schools — photo in class | Quiz PixFan'"
    );
    expect(hub).toContain("ogTitle.setAttribute('content', enTitle)");
    expect(hub).toContain("setLocales('en_US', 'fr_FR')");
    expect(hub).toContain('Free cycle 3–4, lycée and media-literacy paths');
    expect(fiche).toContain('meta[property="og:title"]');
    expect(fiche).toContain('Lesson sheet — Schools | Quiz PixFan');
    expect(fiche).toContain('Printable Quiz PixFan lesson sheet');
    expect(fiche).toContain("setLocales('en_US', 'fr_FR')");
  });

  it('cycle-3 classroom CTAs share (cycle 3) suffix', () => {
    for (const [name, html] of [
      ['histoire', histoire],
      ['smartphone', smartphone],
    ] as const) {
      expect(html, name).toContain(
        'Pour la classe → parcours Scolaires (cycle 3)'
      );
      expect(html, name).toContain(
        'For the classroom → Schools paths (cycle 3)'
      );
    }
  });

  it('Daily copy-link drops emoji glyphs', () => {
    expect(featuredSource).toContain("dailyLinkCopied ? 'OK' : 'URL'");
    expect(featuredSource).not.toContain('🔗');
    expect(featuredSource).not.toContain("'✓'");
  });

  it('FR openHub is shortened; SPA preserves EN lang on hub/fiche', () => {
    expect(fr.scolaires.openHub).toBe('Hub Scolaires');
    expect(fr.scolaires.openHub).not.toMatch(/^Page /);
    expect(en.scolaires.openHub).toBe('Schools guides hub');
    expect(scolairesSource).toContain('langQuery');
    expect(scolairesSource).toContain('guideLangQuery');
    expect(scolairesSource).toContain(
      'href={`/guides/scolaires/${langQuery}`}'
    );
    expect(scolairesSource).toContain(
      'href={`/guides/scolaires/fiche-seance.html${langQuery}`}'
    );
  });
});
