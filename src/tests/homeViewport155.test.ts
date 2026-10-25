import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import materiel from '../../public/guides/materiel-photo.html?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.55 — docs v1.54.0 + droits/histoire article.es expand (9/9)', () => {
  it('docs headline cites v1.54.0; vague 1.54 listed; no-go through 1.55', () => {
    expect(readme).toContain('v1.54.0');
    expect(nextSteps).toContain('**v1.54.0**');
    expect(nextSteps).toContain('Vague **1.54**');
    expect(nextSteps).toMatch(/no-go.*1\.55/);
  });

  it('droits ships real article.es (not EN stub)', () => {
    expect(droits).toContain('<article class="es">');
    expect(droits).toContain('Derechos y ética foto: saber qué se puede publicar');
    expect(droits).toContain('href="/s/photo-rights?lang=es"');
    expect(droits).not.toMatch(
      /<article class="es">[\s\S]*Photo rights & ethics: what you can publish/
    );
  });

  it('histoire ships real article.es (not EN stub)', () => {
    expect(histoire).toContain('<article class="es">');
    expect(histoire).toContain('Historia e iconos: leer una imagen en su tiempo');
    expect(histoire).toContain('href="/s/history-icons?lang=es"');
    expect(histoire).not.toMatch(
      /<article class="es">[\s\S]*History & icons: reading a photo in its time/
    );
  });

  it('droits + histoire sniff set Spanish share meta for ?lang=es', () => {
    for (const html of [droits, histoire]) {
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
      expect(html).toMatch(/p === 'en' \|\| p === 'de'/);
    }
    expect(droits).toContain('Derechos y ética foto — guía + quiz');
    expect(histoire).toContain('Historia e iconos foto — guía + quiz');
  });

  it('full topic cluster 9/9 has article.es; hub still lacks', () => {
    for (const html of [
      composition,
      triangle,
      smartphone,
      lumiere,
      genres,
      retouche,
      materiel,
      droits,
      histoire,
    ]) {
      expect(html).toContain('<article class="es">');
    }
    expect(guidesIndex).not.toContain('<article class="es">');
  });

  it('still no hreflang es/de (topics 9/9 but hub/scolaires EN — product rule)', () => {
    for (const html of [
      droits,
      histoire,
      composition,
      triangle,
      smartphone,
      lumiere,
      genres,
      retouche,
      materiel,
      guidesIndex,
    ]) {
      expect(html).not.toContain('hreflang="es"');
      expect(html).not.toContain('hreflang="de"');
    }
  });

  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});
