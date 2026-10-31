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
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.63 — docs v1.62.0 + retouche/matériel article.de expand', () => {
  it('docs still mention vague 1.62; no-go line covers 1.63+', () => {
    /* Docs headline moved to v1.63.0 in vague 1.64 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.62**');
    expect(nextSteps).toMatch(/no-go.*1\.63/);
    expect(readme).toMatch(/v1\.(62|63|64|65|66|67|68)\.0/);
  });

  it('retouche ships real article.de (DE strings, not EN stub)', () => {
    expect(retouche).toContain('<article class="de">');
    expect(retouche).toContain('Retusche &amp; Lightroom: ein klarer Workflow');
    expect(retouche).toContain('Tonalität zuerst');
    expect(retouche).toContain('href="/s/retouching?lang=de"');
    expect(retouche).toContain('href="/guides/scolaires/?lang=de#lycee-pratique"');
    expect(retouche).toContain('href="/guides/lumiere-photo?lang=de"');
    expect(retouche).not.toMatch(
      /<article class="de">[\s\S]*Retouching & Lightroom: a clear workflow/
    );
  });

  it('matériel ships real article.de (DE strings, not EN stub)', () => {
    expect(materiel).toContain('<article class="de">');
    expect(materiel).toContain(
      'Fotoausrüstung: für die Absicht wählen, nicht für das Datenblatt'
    );
    expect(materiel).toContain('Vollformat vs APS-C');
    expect(materiel).toContain('href="/s/gear-lenses?lang=de"');
    expect(materiel).toContain('href="/guides/scolaires/?lang=de#lycee-pratique"');
    expect(materiel).not.toMatch(
      /<article class="de">[\s\S]*Photo gear: choose for intent, not the spec sheet/
    );
  });

  it('retouche + matériel sniff set German share meta for ?lang=de', () => {
    for (const html of [retouche, materiel]) {
      expect(html).toContain("p === 'de'");
      expect(html).toContain("setLocales('de_DE', 'fr_FR')");
      expect(html).toContain("p === 'en'");
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
      expect(html).not.toMatch(/p === 'en' \|\| p === 'de'/);
    }
    expect(retouche).toContain('Retusche & Lightroom — Leitfaden + Quiz');
    expect(retouche).toContain(
      'Strukturieren Sie Ihre Retusche (Lightroom-Katalog, Tonalität, Farbe, Export)'
    );
    expect(materiel).toContain('Fotoausrüstung — Leitfaden + Quiz');
    expect(materiel).toContain(
      'Vollformat vs APS-C, Objektive, Filter und Stabilisierung'
    );
  });

  it('composition + triangle + smartphone + lumière + genres still ship article.de + sniff DE + CSS :has (regress)', () => {
    for (const html of [composition, triangle, smartphone, lumiere, genres]) {
      expect(html).toContain('<article class="de">');
      expect(html).toContain("p === 'de'");
      expect(html).toContain("setLocales('de_DE', 'fr_FR')");
    }
    expect(composition).toContain('Fotokomposition: den Blick führen');
    expect(triangle).toContain('Belichtungsdreieck: die 3 Hebel des Lichts');
    expect(smartphone).toContain(
      'Smartphone-Fotografie: bessere Aufnahmen, ohne Ausrüstung'
    );
    expect(lumiere).toContain('Fotolicht: lesen, bevor man einstellt');
    expect(genres).toContain('Fotografische Genres: die Absicht vor dem Gehäuse');
    expect(guidesCssMirror).toContain('html[lang="de"]:has(article.de) .en');
    expect(guidesCssMirror).toContain('html[lang="de"] article.de');
  });

  it('retouche/matériel + prior topics still ship article.es + hreflang="es" (ES regress)', () => {
    for (const html of [
      composition,
      triangle,
      smartphone,
      lumiere,
      genres,
      retouche,
      materiel,
    ]) {
      expect(html).toContain('<article class="es">');
      expect(html).toContain('hreflang="es"');
    }
    expect(retouche).toContain('Retoque y Lightroom: un flujo claro');
    expect(materiel).toContain(
      'Material foto: elegir por la intención, no por la ficha técnica'
    );
  });

  it('canonical bare; hreflang de unlocked 1.66 (historical soften)', () => {
    /* Historical 1.63 lock: retouche/matériel expand. Hreflang de unlocked in 1.66. */
    /* home ?lang=de unlocked in vague 1.67 — keep fiche negative */
    expect(sitemap).toContain('fiche-seance.html?lang=de'); /* unlocked vague 1.68 */
    expect(retouche).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/retouche-lightroom" />'
    );
    expect(materiel).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/materiel-photo" />'
    );
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.63', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.63/);
  });
});
