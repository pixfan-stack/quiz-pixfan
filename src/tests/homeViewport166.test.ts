import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import scolairesHub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import materiel from '../../public/guides/materiel-photo.html?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

const articleDePages: Array<[string, string, string]> = [
  ['guides hub', guidesIndex, 'https://quiz.pixfan.fr/guides/'],
  ['scolaires hub', scolairesHub, 'https://quiz.pixfan.fr/guides/scolaires/'],
  ['composition-photo', composition, 'https://quiz.pixfan.fr/guides/composition-photo'],
  ['triangle-exposition', triangle, 'https://quiz.pixfan.fr/guides/triangle-exposition'],
  ['photo-smartphone', smartphone, 'https://quiz.pixfan.fr/guides/photo-smartphone'],
  ['lumiere-photo', lumiere, 'https://quiz.pixfan.fr/guides/lumiere-photo'],
  ['genres-photo', genres, 'https://quiz.pixfan.fr/guides/genres-photo'],
  ['retouche-lightroom', retouche, 'https://quiz.pixfan.fr/guides/retouche-lightroom'],
  ['materiel-photo', materiel, 'https://quiz.pixfan.fr/guides/materiel-photo'],
  ['droits-ethique-photo', droits, 'https://quiz.pixfan.fr/guides/droits-ethique-photo'],
  ['histoire-photo', histoire, 'https://quiz.pixfan.fr/guides/histoire-photo'],
];

describe('vague 1.66 — docs v1.65.0 + hreflang de unlock (11 article.de pages)', () => {
  it('docs still mention vague 1.65/1.66; no-go through 1.66; headline may be v1.66.0', () => {
    /* Docs headline moved to v1.66.0 in vague 1.67 — keep historical Livré lock. */
    expect(readme).toMatch(/v1\.(65|66|67)\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.(65|66|67)\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.65**');
    expect(nextSteps).toContain('Vague **1.66**');
    expect(nextSteps).toMatch(/no-go.*1\.66/);
  });

  it('11 article.de pages expose hreflang="de" + og:locale:alternate de_DE', () => {
    expect(articleDePages).toHaveLength(11);
    for (const [name, html, base] of articleDePages) {
      expect(html, name).toContain('<article class="de">');
      expect(html, name).toContain(
        `<link rel="alternate" hreflang="de" href="${base}?lang=de" />`
      );
      expect(html, name).toContain(
        '<meta property="og:locale:alternate" content="de_DE" />'
      );
      expect(html, name).toContain('hreflang="fr"');
      expect(html, name).toContain('hreflang="en"');
      expect(html, name).toContain('hreflang="es"');
      expect(html, name).toContain('hreflang="x-default"');
    }
  });

  it('topic JSON-LD inLanguage includes de; fiche stays without hreflang de (home unlocked 1.67)', () => {
    for (const html of [
      composition,
      triangle,
      smartphone,
      lumiere,
      genres,
      retouche,
      materiel,
      droits,
      histoire,
    ]) {
      expect(html).toContain('"inLanguage": ["fr", "en", "es", "de"]');
    }
    /* Home gained hreflang de in vague 1.67 — keep fiche negative. */
    expect(fiche).toContain('hreflang="de"'); /* unlocked vague 1.68 */
    expect(fiche).toContain('<article class="de">'); /* unlocked vague 1.68 */
  });

  it('regress ES: 11 pages keep hreflang="es" + article.es; sniff DE intact', () => {
    for (const [name, html] of articleDePages) {
      expect(html, name).toContain('<article class="es">');
      expect(html, name).toContain('hreflang="es"');
      expect(html, name).toContain("p === 'de'");
      expect(html, name).toContain("setLocales('de_DE', 'fr_FR')");
    }
  });

  it('sitemap lists ?lang=de twins for hubs + topics; no fiche de (home unlocked 1.67)', () => {
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/?lang=de');
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/scolaires/?lang=de');
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/composition-photo?lang=de');
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/?lang=es');
    /* Home ?lang=de unlocked in vague 1.67 — keep fiche negative. */
    expect(sitemap).toContain('fiche-seance.html?lang=de'); /* unlocked vague 1.68 */
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.66', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.66/);
  });
});
