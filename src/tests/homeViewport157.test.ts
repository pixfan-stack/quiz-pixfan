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

const articleEsPages: Array<[string, string, string]> = [
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

describe('vague 1.57 — docs v1.56.0 + hreflang es unlock (11 article.es pages)', () => {
  it('docs headline cites v1.56.0; vague 1.56 listed; no-go through 1.57', () => {
    expect(readme).toContain('v1.56.0');
    expect(nextSteps).toContain('**v1.56.0**');
    expect(nextSteps).toContain('Vague **1.56**');
    expect(nextSteps).toMatch(/no-go.*1\.57/);
  });

  it('11 article.es pages expose hreflang="es" + og:locale:alternate es_ES', () => {
    expect(articleEsPages).toHaveLength(11);
    for (const [name, html, base] of articleEsPages) {
      expect(html, name).toContain('<article class="es">');
      expect(html, name).toContain(
        `<link rel="alternate" hreflang="es" href="${base}?lang=es" />`
      );
      expect(html, name).toContain(
        '<meta property="og:locale:alternate" content="es_ES" />'
      );
      expect(html, name).toContain('hreflang="fr"');
      expect(html, name).toContain('hreflang="en"');
      expect(html, name).toContain('hreflang="x-default"');
      expect(html, name).not.toContain('hreflang="de"');
    }
  });

  it('topic JSON-LD inLanguage includes es; fiche + home lack hreflang es', () => {
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
      expect(html).toContain('"inLanguage": ["fr", "en", "es"]');
    }
    expect(fiche).not.toContain('hreflang="es"');
    expect(fiche).not.toContain('<article class="es">');
    expect(indexHtml).not.toContain('hreflang="es"');
    expect(indexHtml).not.toContain('hreflang="de"');
  });

  it('sitemap lists ?lang=en and ?lang=es twins for hubs + topics; no de / no home es / no fiche es', () => {
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/?lang=es');
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/scolaires/?lang=es');
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/composition-photo?lang=es');
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/composition-photo?lang=en');
    expect(sitemap).not.toContain('?lang=de');
    expect(sitemap).not.toContain('https://quiz.pixfan.fr/?lang=es');
    expect(sitemap).not.toContain('fiche-seance.html?lang=es');
  });

  it('still no path-locale /es/|/de/; ops no-gos unchanged', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.57/);
  });
});
