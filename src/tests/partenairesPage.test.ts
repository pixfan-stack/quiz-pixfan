import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';
import partenaires from '../../public/partenaires/index.html?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import themeJs from '../../public/guides/theme.js?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';

const PHOTOS_PROVENCE =
  'https://www.photos-provence.fr/annuaire-photo';
const PHOTOLIENS = 'https://www.photoliens.eu/';
const ANCHOR_PROVENCE = 'Provence Mer Montagne : annuaire photo';
const ANCHOR_PHOTOLIENS =
  'Photoliens.eu — Annuaire photographie / Portail photo';

describe('partenaires page (vague 1.102)', () => {
  it('ships exactly two HTTPS reciprocal text links with required anchors', () => {
    expect(partenaires).toContain(`href="${PHOTOS_PROVENCE}"`);
    expect(partenaires).toContain(`href="${PHOTOLIENS}"`);
    expect(partenaires).toContain(ANCHOR_PROVENCE);
    expect(partenaires).toContain(ANCHOR_PHOTOLIENS);

    const httpsAnchors = [
      ...partenaires.matchAll(
        /<a\b[^>]*href="(https:[^"]+)"[^>]*>([^<]*)<\/a>/g
      ),
    ].filter((m) => {
      const href = m[1]!;
      return (
        href === PHOTOS_PROVENCE ||
        href === PHOTOLIENS ||
        href.startsWith('https://www.photos-provence.fr') ||
        href.startsWith('https://www.photoliens.eu')
      );
    });
    // One <a> per reciprocal target (not duplicated across locale articles)
    expect(httpsAnchors).toHaveLength(2);
    expect(httpsAnchors.map((m) => m[1])).toEqual([
      PHOTOS_PROVENCE,
      PHOTOLIENS,
    ]);
    expect(httpsAnchors.map((m) => m[2])).toEqual([
      ANCHOR_PROVENCE,
      ANCHOR_PHOTOLIENS,
    ]);

    for (const m of httpsAnchors) {
      expect(m[0]).toMatch(/rel="noopener noreferrer"/);
      expect(m[0]).not.toMatch(/nofollow/);
      expect(m[0]).not.toMatch(/href="http:/);
    }
  });

  it('has basic SEO (title, description, canonical) and no mixed-content assets', () => {
    expect(partenaires).toMatch(/<title>[^<]*Partenaires/);
    expect(partenaires).toMatch(
      /<meta name="description" content="[^"]+"/
    );
    expect(partenaires).toContain(
      'rel="canonical" href="https://quiz.pixfan.fr/partenaires/"'
    );
    expect(partenaires).not.toMatch(/src="http:/);
    expect(partenaires).not.toMatch(/href="http:/);
    expect(partenaires).not.toMatch(/backlink|lien retour reçu|approuv/i);
  });

  it('is reachable from guides footer, not quiz chrome', () => {
    expect(guidesIndex).toMatch(
      /href="\/partenaires\/" class="app-footer__link">Partenaires/
    );
    expect(triangle).toMatch(
      /href="\/partenaires\/" class="app-footer__link">Partenaires/
    );
    expect(appSource).not.toContain('/partenaires/');
    expect(appSource).not.toMatch(/partenaires|Partenaires/i);
  });

  it('theme.js localizes partenaires footer href for path locales', () => {
    expect(themeJs).toContain("partenaires: 'Partenaires'");
    expect(themeJs).toContain("partenaires: 'Partners'");
    expect(themeJs).toContain("var partenairesHref = '/partenaires/';");
    expect(themeJs).toContain('isPartenairesHref');
    expect(themeJs).toContain('withLangHref(partenairesHref');
  });
});
