import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import guidesCssMirror from '../../public/guides/i18n-display.css.txt?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import smartphone from '../../public/guides/photo-smartphone.html?raw';
import lumiere from '../../public/guides/lumiere-photo.html?raw';
import genres from '../../public/guides/genres-photo.html?raw';
import retouche from '../../public/guides/retouche-lightroom.html?raw';
import materiel from '../../public/guides/materiel-photo.html?raw';
import droits from '../../public/guides/droits-ethique-photo.html?raw';
import histoire from '../../public/guides/histoire-photo.html?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import scolairesHub from '../../public/guides/scolaires/index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import homeSpa from '../../index.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.65 — docs v1.64.0 + hub/scolaires article.de expand', () => {
  it('docs still mention vague 1.64; no-go through 1.65; headline may be v1.65.0', () => {
    /* Docs headline moved to v1.65.0 in vague 1.66 — keep historical Livré lock. */
    expect(readme).toMatch(/v1\.(64|65|66|67|68)\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.(64|65|66|67|68)\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.64**');
    expect(nextSteps).toMatch(/no-go.*1\.65/);
  });

  it('guides hub ships real article.de (DE strings, not EN stub)', () => {
    expect(guidesIndex).toContain('<article class="de">');
    expect(guidesIndex).toContain('Fotoguides für schnelle Fortschritte');
    expect(guidesIndex).toContain('Schulpfade — Foto im Unterricht');
    expect(guidesIndex).toContain('Leitfäden');
    expect(guidesIndex).toContain('href="/guides/composition-photo?lang=de"');
    expect(guidesIndex).toContain('href="/guides/scolaires/?lang=de"');
    expect(guidesIndex).not.toMatch(
      /<article class="de">[\s\S]*Photography guides that lead to practice/
    );
  });

  it('scolaires hub ships real article.de (DE strings, not EN stub)', () => {
    expect(scolairesHub).toContain('<article class="de">');
    expect(scolairesHub).toContain('Schulpfade — Foto im Unterricht');
    expect(scolairesHub).toContain('Sitzung starten (empfohlen)');
    expect(scolairesHub).toContain('href="/s/photo-reading?classe=1&amp;lang=de"');
    expect(scolairesHub).toContain('id="c4-regard-de"');
    expect(scolairesHub).not.toMatch(
      /<article class="de">[\s\S]*Schools — photo in class[\s\S]*Collège cycle&nbsp;4 first/
    );
  });

  it('hub + scolaires sniff set German share meta for ?lang=de', () => {
    for (const html of [guidesIndex, scolairesHub]) {
      expect(html).toContain("p === 'de'");
      expect(html).toContain("setLocales('de_DE', 'fr_FR')");
      expect(html).toContain("p === 'en'");
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
      expect(html).not.toMatch(/p === 'en' \|\| p === 'de'/);
    }
    expect(guidesIndex).toContain('Foto-Leitfäden | Quiz PixFan');
    expect(scolairesHub).toContain('Schulpfade — Foto im Unterricht | Quiz PixFan');
    expect(scolairesHub).toContain('applyJsonLdDe');
    expect(scolairesHub).toContain("crumb.name = 'Schulpfade'");
  });

  it('topics 9/9 still ship article.de + sniff DE + CSS :has (regress)', () => {
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
      expect(html).toContain('<article class="de">');
      expect(html).toContain("p === 'de'");
      expect(html).toContain("setLocales('de_DE', 'fr_FR')");
    }
    expect(composition).toContain('Fotokomposition: den Blick führen');
    expect(guidesCssMirror).toContain('html[lang="de"]:has(article.de) .en');
    expect(guidesCssMirror).toContain('html[lang="de"] article.de');
  });

  it('hubs still ship article.es + hreflang="es" (ES regress)', () => {
    for (const html of [guidesIndex, scolairesHub]) {
      expect(html).toContain('<article class="es">');
      expect(html).toContain('hreflang="es"');
    }
    expect(guidesIndex).toContain('Guías de fotografía para progresar rápido');
    expect(scolairesHub).toContain('Escolares — foto en clase');
    expect(scolairesHub).toContain('applyJsonLdEs');
  });

  it('fiche still lacks hreflang de (home unlocked 1.67) + article.de; guides de unlocked 1.66', () => {
    /* Hreflang de unlocked in 1.66 on article.de pages — keep fiche negative. */
    expect(fiche).toContain('hreflang="de"'); /* unlocked vague 1.68 */
    /* home hreflang de unlocked in vague 1.67 — keep fiche negative */
    expect(fiche).toContain('<article class="de">'); /* unlocked vague 1.68 */
    expect(homeSpa).not.toContain('<article class="de">');
    /* home ?lang=de unlocked in vague 1.67 — keep fiche negative */
    expect(sitemap).toContain('fiche-seance.html?lang=de'); /* unlocked vague 1.68 */
    expect(guidesIndex).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/" />'
    );
    expect(scolairesHub).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/scolaires/" />'
    );
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.65', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.65/);
  });
});
