import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import materiel from '../../public/guides/materiel-photo.html?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';

const topics = [
  ['triangle-exposition', triangle],
  ['composition-photo', composition],
  ['lumiere-photo', lumiere],
  ['retouche-lightroom', retouche],
  ['photo-smartphone', smartphone],
  ['genres-photo', genres],
  ['materiel-photo', materiel],
  ['droits-ethique-photo', droits],
  ['histoire-photo', histoire],
] as const;

describe('vague 1.43 — docs v1.42.0 + topics twitter×9', () => {
  it('docs still mention vague 1.42; no-go line covers 1.43+', () => {
    /* Docs headline moved to v1.43.0 in vague 1.44 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.42**');
    expect(nextSteps).toMatch(/no-go.*1\.43/);
    expect(readme).toMatch(/v1\.4[23456789]\.0/);
  });

  it('nine topic guides ship twitter + og:locale:alternate + EN sniff', () => {
    for (const [name, html] of topics) {
      expect(html, name).toContain('name="twitter:card"');
      expect(html, name).toContain('name="twitter:title"');
      expect(html, name).toContain('name="twitter:description"');
      expect(html, name).toContain('name="twitter:image"');
      expect(html, name).toContain('property="og:locale:alternate"');
      expect(html, name).toContain("setLocales('en_US', 'fr_FR')");
      expect(html, name).toContain("meta[name=\"twitter:title\"]");
      expect(html, name).toContain("twTitle.setAttribute('content'");
      /* Product rule: no es/de hreflang until content is translated */
      expect(html, name).not.toContain('hreflang="es"');
      expect(html, name).not.toContain('hreflang="de"');
    }
  });

  it('EN sniff seeds exist on representative topics', () => {
    expect(composition).toContain('Photo composition — guide + quiz');
    expect(triangle).toContain('Exposure triangle — guide + quiz');
    expect(histoire).toContain('Photo history & icons — guide + quiz');
  });
});
