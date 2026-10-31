import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import indexHtml from '../../index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.58 — docs v1.57.0 + home SPA ES SEO unlock', () => {
  it('docs still mention vague 1.57; no-go line covers 1.58+', () => {
    /* Docs headline moved to v1.58.0 in vague 1.59 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.57**');
    expect(nextSteps).toMatch(/no-go.*1\.58/);
    expect(readme).toMatch(/v1\.(57|58|59|60|61|62|63|64|65|66|67)\.0/);
  });

  it('home sniff sets Spanish share meta for ?lang=es (real ES, not EN stub)', () => {
    expect(indexHtml).toContain("p === 'es'");
    expect(indexHtml).toContain("setLocales('es_ES', 'fr_FR')");
    expect(indexHtml).toContain('Quiz de fotografía gratis — 386 preguntas | Quiz PixFan');
    expect(indexHtml).toContain(
      'Pon a prueba tus conocimientos de fotografía gratis: 386 preguntas (268 ilustradas), 15 categorías'
    );
    /* DE sniff separated from EN in vague 1.67 — keep EN parity lock */
    expect(indexHtml).toContain("} else if (p === 'en') {");
    expect(indexHtml).toContain('Free photography quiz — 386 questions | Quiz PixFan');
    expect(indexHtml).toContain("setLocales('fr_FR', 'en_US')");
  });

  it('home exposes hreflang="es" + og:locale:alternate es_ES + JSON-LD inLanguage es', () => {
    expect(indexHtml).toContain(
      '<link rel="alternate" hreflang="es" href="https://quiz.pixfan.fr/?lang=es" />'
    );
    expect(indexHtml).toContain('hreflang="fr"');
    expect(indexHtml).toContain('hreflang="en"');
    expect(indexHtml).toContain('hreflang="x-default"');
    expect(indexHtml).toContain(
      '<meta property="og:locale:alternate" content="es_ES" />'
    );
    /* inLanguage +de / hreflang de unlocked on home in vague 1.67 */
    expect(indexHtml).toMatch(/"inLanguage": \["fr", "en", "es"(, "de")?\]/);
    expect(indexHtml).toContain('<link rel="canonical" href="https://quiz.pixfan.fr/" />');
  });

  it('sitemap lists home ?lang=en and ?lang=es; no fiche de (home de in 1.67)', () => {
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=en');
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=es');
    /* guides ?lang=de unlocked in 1.66; home in 1.67 — fiche still forbidden */
    expect(sitemap).toContain('fiche-seance.html?lang=de'); /* unlocked vague 1.68 */
  });

  it('no path-locale; ops no-gos through 1.58+; fiche es unlocked in 1.59 (historical)', () => {
    /* fiche gained article.es + hreflang es in vague 1.59 — keep no-de / path locks */
    expect(fiche).toContain('hreflang="de"'); /* unlocked vague 1.68 */
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.58/);
  });
});
