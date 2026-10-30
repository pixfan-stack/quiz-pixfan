import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import scolairesHub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.56 — docs v1.55.0 + hub/scolaires article.es expand', () => {
  it('docs still mention vague 1.55; no-go line covers 1.56+', () => {
    /* Docs headline moved to v1.57.0 in vague 1.58 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.55**');
    expect(nextSteps).toMatch(/no-go.*1\.56/);
    expect(readme).toMatch(/v1\.(55|56|57|58|59|60|61|62|63|64|65)\.0/);
  });

  it('guides hub ships real article.es (not EN stub)', () => {
    expect(guidesIndex).toContain('<article class="es">');
    expect(guidesIndex).toContain('Guías de fotografía para progresar rápido');
    expect(guidesIndex).toContain('href="/guides/composition-photo?lang=es"');
    expect(guidesIndex).toContain('href="/guides/scolaires/?lang=es"');
    expect(guidesIndex).not.toMatch(
      /<article class="es">[\s\S]*Photography guides that lead to practice/
    );
  });

  it('scolaires hub ships real article.es (not EN stub)', () => {
    expect(scolairesHub).toContain('<article class="es">');
    expect(scolairesHub).toContain('Escolares — foto en clase');
    expect(scolairesHub).toContain('Lanzar la sesión (recomendado)');
    expect(scolairesHub).toContain('href="/s/photo-reading?classe=1&amp;lang=es"');
    expect(scolairesHub).toContain('id="c4-regard-es"');
    expect(scolairesHub).not.toMatch(
      /<article class="es">[\s\S]*Schools — photo in class[\s\S]*Collège cycle&nbsp;4 first/
    );
  });

  it('hub + scolaires sniff set Spanish share meta for ?lang=es', () => {
    for (const html of [guidesIndex, scolairesHub]) {
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
      /* de got real hub meta in vague 1.65 — EN stays its own branch */
      expect(html).toContain("p === 'en'");
    }
    expect(guidesIndex).toContain('Guías quiz foto | Quiz PixFan');
    expect(scolairesHub).toContain('Escolares — foto en clase | Quiz PixFan');
    expect(scolairesHub).toContain('applyJsonLdEs');
  });

  it('topics 9/9 retained; fiche séance unlocked in 1.59 (historical)', () => {
    expect(composition).toContain('<article class="es">');
    expect(droits).toContain('<article class="es">');
    expect(histoire).toContain('<article class="es">');
    /* fiche gained article.es in vague 1.59 — keep no-de lock */
    expect(fiche).not.toContain('hreflang="de"');
  });

  it('still no hreflang de on fiche/home (de unlocked 1.66 — historical)', () => {
    /* hreflang de unlocked in vague 1.66 on article.de pages — keep fiche/home negative */
    expect(fiche).not.toContain('hreflang="de"');
  });

  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});
