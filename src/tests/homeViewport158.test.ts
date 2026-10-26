import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import indexHtml from '../../index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.58 — docs v1.57.0 + home SPA ES SEO unlock', () => {
  it('docs headline cites v1.57.0; vague 1.57 listed; no-go through 1.58', () => {
    expect(readme).toContain('v1.57.0');
    expect(nextSteps).toContain('**v1.57.0**');
    expect(nextSteps).toContain('Vague **1.57**');
    expect(nextSteps).toMatch(/no-go.*1\.58/);
  });

  it('home sniff sets Spanish share meta for ?lang=es (real ES, not EN stub)', () => {
    expect(indexHtml).toContain("p === 'es'");
    expect(indexHtml).toContain("setLocales('es_ES', 'fr_FR')");
    expect(indexHtml).toContain('Quiz de fotografía gratis — 386 preguntas | Quiz PixFan');
    expect(indexHtml).toContain(
      'Pon a prueba tus conocimientos de fotografía gratis: 386 preguntas (268 ilustradas), 15 categorías'
    );
    expect(indexHtml).toMatch(/p === 'en' \|\| p === 'de'/);
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
    expect(indexHtml).toContain('"inLanguage": ["fr", "en", "es"]');
    expect(indexHtml).not.toContain('hreflang="de"');
    expect(indexHtml).toContain('<link rel="canonical" href="https://quiz.pixfan.fr/" />');
  });

  it('sitemap lists home ?lang=en and ?lang=es; no de / no fiche es', () => {
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=en');
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=es');
    expect(sitemap).not.toContain('?lang=de');
    expect(sitemap).not.toContain('fiche-seance.html?lang=es');
  });

  it('fiche still lacks article.es / hreflang es; no path-locale; ops no-gos through 1.58', () => {
    expect(fiche).not.toContain('<article class="es">');
    expect(fiche).not.toContain('hreflang="es"');
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.58/);
  });
});
