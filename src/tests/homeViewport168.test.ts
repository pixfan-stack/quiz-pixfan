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

describe('vague 1.68 — docs v1.67.0 + fiche séance DE SEO unlock', () => {
  it('docs still mention vague 1.67/1.68; no-go through 1.68; headline may be v1.68.0', () => {
    /* Docs headline moved to v1.68.0 in vague 1.69 — keep historical Livré lock. */
    expect(readme).toMatch(/v1\.(67|68|69)\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.(67|68|69)\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.67**');
    expect(nextSteps).toContain('Vague **1.68**');
    expect(nextSteps).toMatch(/no-go.*1\.68/);
  });

  it('fiche ships real article.de (DE strings, not EN stub)', () => {
    expect(fiche).toContain('<article class="de">');
    expect(fiche).toContain('Sitzungsblatt — Schulen Quiz PixFan');
    expect(fiche).toContain('Drucken / PDF');
    expect(fiche).toContain('href="/guides/scolaires/?lang=de"');
    expect(fiche).toContain('classe=1&amp;lang=de');
    expect(fiche).toContain('id="grille-duree-de"');
    expect(fiche).not.toMatch(
      /<article class="de">[\s\S]*Lesson sheet — Schools Quiz PixFan/
    );
  });

  it('fiche sniff sets German share meta for ?lang=de; en separate', () => {
    expect(fiche).toContain("p === 'de'");
    expect(fiche).toContain("setLocales('de_DE', 'fr_FR')");
    expect(fiche).toContain('Sitzungsblatt Schulen | Quiz PixFan');
    expect(fiche).toContain(
      'Druckbares Quiz-PixFan-Sitzungsblatt — Schulpfade Zyklus 3–4'
    );
    expect(fiche).toContain("} else if (p === 'en') {");
    expect(fiche).not.toMatch(/p === 'en' \|\| p === 'de'/);
    expect(fiche).toContain('Lesson sheet — Schools | Quiz PixFan');
    expect(fiche).toContain("p === 'es'");
    expect(fiche).toContain("setLocales('es_ES', 'fr_FR')");
  });

  it('fiche exposes hreflang="de" + og:locale:alternate de_DE; canonical bare', () => {
    expect(fiche).toContain(
      '<link rel="alternate" hreflang="de" href="https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=de" />'
    );
    expect(fiche).toContain('hreflang="fr"');
    expect(fiche).toContain('hreflang="en"');
    expect(fiche).toContain('hreflang="es"');
    expect(fiche).toContain('hreflang="x-default"');
    expect(fiche).toContain(
      '<meta property="og:locale:alternate" content="de_DE" />'
    );
    expect(fiche).toContain(
      '<meta property="og:locale:alternate" content="es_ES" />'
    );
    expect(fiche).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html" />'
    );
  });

  it('sitemap lists fiche ?lang=de (+ en/es intact); home regress', () => {
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=de'
    );
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=en'
    );
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=es'
    );
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=de');
    expect(indexHtml).toContain(
      '<link rel="alternate" hreflang="de" href="https://quiz.pixfan.fr/?lang=de" />'
    );
  });

  it('regress: 11 guides keep hreflang="de" + ?lang=de twins; ES fiche intact', () => {
    expect(articleDePages).toHaveLength(11);
    for (const [name, html, base] of articleDePages) {
      expect(html, name).toContain('<article class="de">');
      expect(html, name).toContain(
        `<link rel="alternate" hreflang="de" href="${base}?lang=de" />`
      );
    }
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/?lang=de');
    expect(fiche).toContain(
      '<link rel="alternate" hreflang="es" href="https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=es" />'
    );
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=es'
    );
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.68', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.68/);
  });
});
