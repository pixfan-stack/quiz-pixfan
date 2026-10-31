import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import indexHtml from '../../index.html?raw';
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

describe('vague 1.67 — docs v1.66.0 + home SPA DE SEO unlock', () => {
  it('docs still mention vague 1.66/1.67; no-go through 1.67; headline may be v1.67.0', () => {
    /* Docs headline moved to v1.67.0 in vague 1.68 — keep historical Livré lock. */
    expect(readme).toMatch(/v1\.(66|67)\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.(66|67)\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.66**');
    expect(nextSteps).toContain('Vague **1.67**');
    expect(nextSteps).toMatch(/no-go.*1\.67/);
  });

  it('home sniff sets German share meta for ?lang=de (real DE, not EN stub)', () => {
    expect(indexHtml).toContain("p === 'de'");
    expect(indexHtml).toContain("setLocales('de_DE', 'fr_FR')");
    expect(indexHtml).toContain('Kostenloses Fotografie-Quiz — 386 Fragen | Quiz PixFan');
    expect(indexHtml).toContain(
      'Teste dein Fotografie-Wissen kostenlos: 386 Fragen (268 illustriert), 15 Kategorien'
    );
    expect(indexHtml).toContain("} else if (p === 'en') {");
    expect(indexHtml).not.toMatch(/p === 'en' \|\| p === 'de'/);
    expect(indexHtml).toContain('Free photography quiz — 386 questions | Quiz PixFan');
    expect(indexHtml).toContain("p === 'es'");
    expect(indexHtml).toContain("setLocales('es_ES', 'fr_FR')");
    expect(indexHtml).toContain('<link rel="canonical" href="https://quiz.pixfan.fr/" />');
  });

  it('home exposes hreflang="de" + og:locale:alternate de_DE + JSON-LD inLanguage de', () => {
    expect(indexHtml).toContain(
      '<link rel="alternate" hreflang="de" href="https://quiz.pixfan.fr/?lang=de" />'
    );
    expect(indexHtml).toContain('hreflang="fr"');
    expect(indexHtml).toContain('hreflang="en"');
    expect(indexHtml).toContain('hreflang="es"');
    expect(indexHtml).toContain('hreflang="x-default"');
    expect(indexHtml).toContain(
      '<meta property="og:locale:alternate" content="de_DE" />'
    );
    expect(indexHtml).toContain('"inLanguage": ["fr", "en", "es", "de"]');
  });

  it('sitemap lists home ?lang=de (+ en/es intact); fiche de unlocked 1.68', () => {
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=de');
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=en');
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=es');
    expect(sitemap).toContain('fiche-seance.html?lang=de'); /* unlocked vague 1.68 */
  });

  it('regress: 11 guides keep hreflang="de" + ?lang=de twins; ES home intact', () => {
    expect(articleDePages).toHaveLength(11);
    for (const [name, html, base] of articleDePages) {
      expect(html, name).toContain('<article class="de">');
      expect(html, name).toContain(
        `<link rel="alternate" hreflang="de" href="${base}?lang=de" />`
      );
    }
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/?lang=de');
    expect(indexHtml).toContain(
      '<link rel="alternate" hreflang="es" href="https://quiz.pixfan.fr/?lang=es" />'
    );
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=es');
  });

  it('no path-locale; ops through 1.67; fiche DE unlocked in 1.68 (historical)', () => {
    expect(fiche).toContain('<article class="de">'); /* unlocked vague 1.68 */
    expect(fiche).toContain('hreflang="de"');
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.67/);
  });
});
