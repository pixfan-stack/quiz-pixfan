import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import guidesCssMirror from '../../public/guides/i18n-display.css.txt?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.61 — docs v1.60.0 + triangle/smartphone article.de expand', () => {
  it('docs still mention vague 1.60; no-go line covers 1.61+', () => {
    /* Docs headline moved to v1.61.0 in vague 1.62 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.60**');
    expect(nextSteps).toMatch(/no-go.*1\.61/);
    expect(readme).toMatch(/v1\.(60|61|62|63|64)\.0/);
  });

  it('triangle ships real article.de (DE strings, not EN stub)', () => {
    expect(triangle).toContain('<article class="de">');
    expect(triangle).toContain('Belichtungsdreieck: die 3 Hebel des Lichts');
    expect(triangle).toContain('Verschlusszeit');
    expect(triangle).toContain('href="/s/exposure-basics?lang=de"');
    expect(triangle).toContain('href="/guides/scolaires/?lang=de#c4-lumiere"');
    expect(triangle).toContain('href="/guides/composition-photo?lang=de"');
    expect(triangle).not.toMatch(
      /<article class="de">[\s\S]*Exposure triangle: ISO, aperture, shutter/
    );
  });

  it('smartphone ships real article.de (DE strings, not EN stub)', () => {
    expect(smartphone).toContain('<article class="de">');
    expect(smartphone).toContain(
      'Smartphone-Fotografie: bessere Aufnahmen, ohne Ausrüstung'
    );
    expect(smartphone).toContain('Pro- / Manuellmodus');
    expect(smartphone).toContain('href="/s/smartphone?lang=de"');
    expect(smartphone).toContain('href="/guides/scolaires/?lang=de#c3-decouvrir"');
    expect(smartphone).not.toMatch(
      /<article class="de">[\s\S]*Smartphone photography: better shots/
    );
  });

  it('triangle + smartphone sniff set German share meta for ?lang=de', () => {
    for (const html of [triangle, smartphone]) {
      expect(html).toContain("p === 'de'");
      expect(html).toContain("setLocales('de_DE', 'fr_FR')");
      expect(html).toContain("p === 'en'");
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
    }
    expect(triangle).toContain('Belichtungsdreieck — Leitfaden + Quiz');
    expect(triangle).toContain(
      'Verstehen Sie das Belichtungsdreieck (ISO, Blende, Verschlusszeit)'
    );
    expect(smartphone).toContain('Smartphone-Fotografie — Leitfaden + Quiz');
    expect(smartphone).toContain(
      'Verbessern Sie Ihre Smartphone-Fotos (Licht, HDR, Pro-Modus, häufige Fehler)'
    );
  });

  it('composition still ships article.de + sniff DE + CSS :has (regress)', () => {
    expect(composition).toContain('<article class="de">');
    expect(composition).toContain('Fotokomposition: den Blick führen');
    expect(composition).toContain("p === 'de'");
    expect(composition).toContain("setLocales('de_DE', 'fr_FR')");
    expect(guidesCssMirror).toContain('html[lang="de"]:has(article.de) .en');
    expect(guidesCssMirror).toContain('html[lang="de"] article.de');
  });

  it('composition/triangle/smartphone still ship article.es + hreflang="es" (ES regress)', () => {
    for (const html of [composition, triangle, smartphone]) {
      expect(html).toContain('<article class="es">');
      expect(html).toContain('hreflang="es"');
    }
    expect(composition).toContain('Composición fotográfica: guiar la mirada');
    expect(triangle).toContain('Triángulo de exposición: las 3 palancas de la luz');
    expect(smartphone).toContain('Foto con smartphone: mejores tomas, sin equipo');
  });

  it('still no hreflang="de"; no sitemap ?lang=de (lumière expand is 1.62)', () => {
    /* Historical 1.61 lock: triangle/smartphone expand. Lumière/genres article.de landed in 1.62. */
    for (const html of [composition, triangle, smartphone, lumiere]) {
      expect(html).not.toContain('hreflang="de"');
    }
    expect(sitemap).not.toContain('?lang=de');
    expect(triangle).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/triangle-exposition" />'
    );
    expect(smartphone).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/photo-smartphone" />'
    );
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.61', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.61/);
  });
});
