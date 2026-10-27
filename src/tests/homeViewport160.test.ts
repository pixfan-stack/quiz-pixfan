import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import guidesCssMirror from '../../public/guides/i18n-display.css.txt?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.60 — docs v1.59.0 + composition article.de pilot', () => {
  it('docs still mention vague 1.59; no-go line covers 1.60+', () => {
    /* Docs headline moved to v1.60.0 in vague 1.61 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.59**');
    expect(nextSteps).toMatch(/no-go.*1\.60/);
    expect(readme).toMatch(/v1\.(59|60|61|62)\.0/);
  });

  it('composition ships real article.de (DE strings, not EN stub)', () => {
    expect(composition).toContain('<article class="de">');
    expect(composition).toContain('Fotokomposition: den Blick führen');
    expect(composition).toContain('Drittelregel');
    expect(composition).toContain('Führungslinien');
    expect(composition).toContain('Bildausschnitt und Raum');
    expect(composition).toContain('href="/s/composition?lang=de"');
    expect(composition).toContain('href="/guides/scolaires/?lang=de#c4-regard"');
    expect(composition).toContain('href="/guides/triangle-exposition?lang=de"');
    expect(composition).not.toMatch(
      /<article class="de">[\s\S]*Photo composition: guide the eye/
    );
  });

  it('i18n-display mirror documents article.de preference (synced into guides.css)', () => {
    expect(guidesCssMirror).toContain('html[lang="de"]:has(article.de) .en');
    expect(guidesCssMirror).toContain('html[lang="de"] article.de');
    expect(guidesCssMirror).toContain('.de {');
  });

  it('composition sniff sets German share meta for ?lang=de', () => {
    expect(composition).toContain("p === 'de'");
    expect(composition).toContain('Fotokomposition — Leitfaden + Quiz');
    expect(composition).toContain(
      'Lernen Sie Fotokomposition (Drittelregel, Führungslinien, Bildausschnitt)'
    );
    expect(composition).toContain("setLocales('de_DE', 'fr_FR')");
    /* en stays its own branch; es unchanged */
    expect(composition).toContain("p === 'en'");
    expect(composition).toContain("p === 'es'");
    expect(composition).toContain("setLocales('es_ES', 'fr_FR')");
  });

  it('composition still ships article.es + hreflang="es" (ES regress)', () => {
    expect(composition).toContain('<article class="es">');
    expect(composition).toContain('Composición fotográfica: guiar la mirada');
    expect(composition).toContain(
      '<link rel="alternate" hreflang="es" href="https://quiz.pixfan.fr/guides/composition-photo?lang=es" />'
    );
  });

  it('still no hreflang="de"; no sitemap ?lang=de (triangle expand is 1.61)', () => {
    /* Historical 1.60 lock: composition pilot only. Triangle/smartphone article.de landed in 1.61. */
    expect(composition).not.toContain('hreflang="de"');
    expect(triangle).not.toContain('hreflang="de"');
    expect(sitemap).not.toContain('?lang=de');
    expect(composition).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/composition-photo" />'
    );
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.60+', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.60/);
  });
});
