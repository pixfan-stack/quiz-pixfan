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
  it('docs headline cites v1.52.0; vague 1.52 listed; no-go through 1.53', () => {
    expect(readme).toContain('v1.52.0');
    expect(nextSteps).toContain('**v1.52.0**');
    expect(nextSteps).toContain('Vague **1.52**');
    expect(nextSteps).toMatch(/no-go.*1\.53/);
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

  it('prior ES cluster retained; non-expanded topic still lacks article.es', () => {
    for (const html of [composition, triangle, smartphone]) {
      expect(html).toContain('<article class="es">');
    }
    expect(retouche).not.toContain('<article class="es">');
  });

  it('still no hreflang es/de (cluster 5/9 still partial — product rule)', () => {
    for (const html of [lumiere, genres, composition, triangle, smartphone, retouche]) {
      expect(html).not.toContain('hreflang="es"');
      expect(html).not.toContain('hreflang="de"');
    }
  });

  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});
