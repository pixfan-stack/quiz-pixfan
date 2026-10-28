import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import materiel from '../../public/guides/materiel-photo.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.54 — docs v1.53.0 + retouche/matériel article.es expand', () => {
  it('docs still mention vague 1.53; no-go line covers 1.54+', () => {
    /* Docs headline moved to v1.54.0 in vague 1.55 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.53**');
    expect(nextSteps).toMatch(/no-go.*1\.54/);
    expect(readme).toMatch(/v1\.(53|54|55|56|57|58|59|60|61|62|63)\.0/);
  });

  it('retouche ships real article.es (not EN stub)', () => {
    expect(retouche).toContain('<article class="es">');
    expect(retouche).toContain('Retoque y Lightroom: un flujo claro');
    expect(retouche).toContain('href="/s/retouching?lang=es"');
    expect(retouche).not.toMatch(
      /<article class="es">[\s\S]*Retouching & Lightroom: a clear workflow/
    );
  });

  it('matériel ships real article.es (not EN stub)', () => {
    expect(materiel).toContain('<article class="es">');
    expect(materiel).toContain('Material foto: elegir por la intención, no por la ficha técnica');
    expect(materiel).toContain('href="/s/gear-lenses?lang=es"');
    expect(materiel).not.toMatch(
      /<article class="es">[\s\S]*Photo gear: choose for intent, not the spec sheet/
    );
  });

  it('retouche + matériel sniff set Spanish share meta for ?lang=es', () => {
    for (const html of [retouche, materiel]) {
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
      /* de got real meta in vague 1.63 on retouche/matériel — EN stays its own branch */
      expect(html).toContain("p === 'en'");
    }
    expect(retouche).toContain('Retoque y Lightroom — guía + quiz');
    expect(materiel).toContain('Material foto — guía + quiz');
  });

  it('retouche + matériel remain the 1.54 expand anchors', () => {
    expect(retouche).toContain('<article class="es">');
    expect(materiel).toContain('<article class="es">');
    for (const html of [composition, triangle, smartphone, lumiere, genres]) {
      expect(html).toContain('<article class="es">');
    }
  });

  it('still no hreflang de (es unlocked in 1.57 — historical)', () => {
    for (const html of [retouche, materiel, composition, triangle, smartphone, lumiere, genres, droits]) {
      /* hreflang es unlocked in vague 1.57 on article.es pages */
      expect(html).not.toContain('hreflang="de"');
    }
  });

  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});
