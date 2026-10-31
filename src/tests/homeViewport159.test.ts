import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import indexHtml from '../../index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.59 — docs v1.58.0 + fiche séance ES SEO unlock', () => {
  it('docs still mention vague 1.58; no-go line covers 1.59+', () => {
    /* Docs headline moved to v1.59.0 in vague 1.60 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.58**');
    expect(nextSteps).toMatch(/no-go.*1\.59/);
    expect(readme).toMatch(/v1\.(58|59|60|61|62|63|64|65|66|67)\.0/);
  });

  it('fiche ships real article.es (ES strings, not EN stub)', () => {
    expect(fiche).toContain('<article class="es">');
    expect(fiche).toContain('Ficha de sesión — Escolares Quiz PixFan');
    expect(fiche).toContain('Imprimir / PDF');
    expect(fiche).toContain('href="/guides/scolaires/?lang=es"');
    expect(fiche).toContain('classe=1&amp;lang=es');
    expect(fiche).toContain('id="grille-duree-es"');
    expect(fiche).not.toMatch(
      /<article class="es">[\s\S]*Lesson sheet — Schools Quiz PixFan/
    );
  });

  it('fiche sniff sets Spanish share meta for ?lang=es; en separate (de unlocked 1.68)', () => {
    expect(fiche).toContain("p === 'es'");
    expect(fiche).toContain("setLocales('es_ES', 'fr_FR')");
    expect(fiche).toContain('Ficha de sesión Escolares | Quiz PixFan');
    expect(fiche).toContain(
      'Ficha de sesión imprimible Quiz PixFan — recorridos escolares ciclo 3–4'
    );
    /* de own branch landed in vague 1.68 — historical en||de interim dropped. */
    expect(fiche).toContain("} else if (p === 'en') {");
    expect(fiche).toContain('Lesson sheet — Schools | Quiz PixFan');
  });

  it('fiche exposes hreflang="es" + og:locale:alternate es_ES; canonical bare', () => {
    expect(fiche).toContain(
      '<link rel="alternate" hreflang="es" href="https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=es" />'
    );
    expect(fiche).toContain('hreflang="fr"');
    expect(fiche).toContain('hreflang="en"');
    expect(fiche).toContain('hreflang="x-default"');
    expect(fiche).toContain(
      '<meta property="og:locale:alternate" content="es_ES" />'
    );
    expect(fiche).toContain('hreflang="de"'); /* unlocked vague 1.68 */
    expect(fiche).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html" />'
    );
  });

  it('sitemap lists fiche ?lang=es (+ en); home regress; fiche de unlocked 1.68', () => {
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=es'
    );
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=en'
    );
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=es');
    expect(indexHtml).toContain(
      '<link rel="alternate" hreflang="es" href="https://quiz.pixfan.fr/?lang=es" />'
    );
    expect(sitemap).toContain('fiche-seance.html?lang=de'); /* unlocked vague 1.68 */
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.59+', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.59/);
  });
});

