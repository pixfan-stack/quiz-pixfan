import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.53 — docs v1.52.0 + lumière/genres article.es expand', () => {
  it('docs still mention vague 1.52; no-go line covers 1.53+', () => {
    /* Docs headline moved to v1.53.0 in vague 1.54 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.52**');
    expect(nextSteps).toMatch(/no-go.*1\.53/);
    expect(readme).toMatch(/v1\.(52|53|54|55|56|57)\.0/);
  });

  it('lumière ships real article.es (not EN stub)', () => {
    expect(lumiere).toContain('<article class="es">');
    expect(lumiere).toContain('Luz foto: leer antes de ajustar');
    expect(lumiere).toContain('href="/s/light-color?lang=es"');
    expect(lumiere).not.toMatch(
      /<article class="es">[\s\S]*Photo light: read it before you dial it/
    );
  });

  it('genres ships real article.es (not EN stub)', () => {
    expect(genres).toContain('<article class="es">');
    expect(genres).toContain('Géneros fotográficos: la intención antes del cuerpo');
    expect(genres).toContain('href="/s/genres?lang=es"');
    expect(genres).not.toMatch(
      /<article class="es">[\s\S]*Photography genres: intention before gear/
    );
  });

  it('lumière + genres sniff set Spanish share meta for ?lang=es', () => {
    for (const html of [lumiere, genres]) {
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
      expect(html).toMatch(/p === 'en' \|\| p === 'de'/);
    }
    expect(lumiere).toContain('Luz foto — guía + quiz');
    expect(genres).toContain('Géneros fotográficos — guía + quiz');
  });

  it('lumière + genres remain the 1.53 expand anchors', () => {
    expect(lumiere).toContain('<article class="es">');
    expect(genres).toContain('<article class="es">');
    for (const html of [composition, triangle, smartphone]) {
      expect(html).toContain('<article class="es">');
    }
  });

  it('still no hreflang de (es unlocked in 1.57 — historical)', () => {
    for (const html of [lumiere, genres, composition, triangle, smartphone, retouche]) {
      /* hreflang es unlocked in vague 1.57 on article.es pages */
      expect(html).not.toContain('hreflang="de"');
    }
  });

  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});
