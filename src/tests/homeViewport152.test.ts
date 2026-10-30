import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.52 — docs v1.51.0 + triangle/smartphone article.es expand', () => {
  it('docs still mention vague 1.51; no-go line covers 1.52+', () => {
    /* Docs headline moved forward in later waves — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.51**');
    expect(nextSteps).toMatch(/no-go.*1\.52/);
    expect(readme).toMatch(/v1\.(51|52|53|54|55|56|57|58|59|60|61|62|63|64|65)\.0/);
  });

  it('triangle ships real article.es (not EN stub)', () => {
    expect(triangle).toContain('<article class="es">');
    expect(triangle).toContain('Triángulo de exposición: las 3 palancas de la luz');
    expect(triangle).toContain('href="/s/exposure-basics?lang=es"');
    expect(triangle).not.toMatch(
      /<article class="es">[\s\S]*Exposure triangle: ISO, aperture, shutter/
    );
  });

  it('smartphone ships real article.es (not EN stub)', () => {
    expect(smartphone).toContain('<article class="es">');
    expect(smartphone).toContain('Foto con smartphone: mejores tomas, sin equipo');
    expect(smartphone).toContain('href="/s/smartphone?lang=es"');
    expect(smartphone).not.toMatch(
      /<article class="es">[\s\S]*Smartphone photography: better shots/
    );
  });

  it('triangle + smartphone sniff set Spanish share meta for ?lang=es', () => {
    for (const html of [triangle, smartphone]) {
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
      /* de got real meta in vague 1.61 on triangle/smartphone — EN stays its own branch */
      expect(html).toContain("p === 'en'");
    }
    expect(triangle).toContain('Triángulo de exposición — guía + quiz');
    expect(smartphone).toContain('Foto smartphone — guía + quiz');
  });

  it('triangle + smartphone remain the 1.52 expand anchors', () => {
    expect(triangle).toContain('<article class="es">');
    expect(smartphone).toContain('<article class="es">');
    expect(composition).toContain('<article class="es">');
  });


  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});
