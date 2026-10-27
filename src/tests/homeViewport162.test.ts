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
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.62 — docs v1.61.0 + lumière/genres article.de expand', () => {
  it('docs still mention vague 1.61; no-go line covers 1.62+', () => {
    /* Docs headline moved to v1.62.0 in vague 1.63 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.61**');
    expect(nextSteps).toMatch(/no-go.*1\.62/);
    expect(readme).toMatch(/v1\.(61|62)\.0/);
  });

  it('lumière ships real article.de (DE strings, not EN stub)', () => {
    expect(lumiere).toContain('<article class="de">');
    expect(lumiere).toContain('Fotolicht: lesen, bevor man einstellt');
    expect(lumiere).toContain('Weißabgleich');
    expect(lumiere).toContain('href="/s/light-color?lang=de"');
    expect(lumiere).toContain('href="/guides/scolaires/?lang=de#c4-lumiere"');
    expect(lumiere).toContain('href="/guides/triangle-exposition?lang=de"');
    expect(lumiere).not.toMatch(
      /<article class="de">[\s\S]*Photo light: read it before you dial it/
    );
  });

  it('genres ships real article.de (DE strings, not EN stub)', () => {
    expect(genres).toContain('<article class="de">');
    expect(genres).toContain('Fotografische Genres: die Absicht vor dem Gehäuse');
    expect(genres).toContain('Straßenfotografie');
    expect(genres).toContain('href="/s/genres?lang=de"');
    expect(genres).toContain('href="/guides/scolaires/?lang=de#c3-decouvrir"');
    expect(genres).not.toMatch(
      /<article class="de">[\s\S]*Photography genres: intention before gear/
    );
  });

  it('lumière + genres sniff set German share meta for ?lang=de', () => {
    for (const html of [lumiere, genres]) {
      expect(html).toContain("p === 'de'");
      expect(html).toContain("setLocales('de_DE', 'fr_FR')");
      expect(html).toContain("p === 'en'");
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
    }
    expect(lumiere).toContain('Fotolicht — Leitfaden + Quiz');
    expect(lumiere).toContain(
      'Lernen Sie Licht zu lesen (Richtung, Härte, Weißabgleich)'
    );
    expect(genres).toContain('Fotografische Genres — Leitfaden + Quiz');
    expect(genres).toContain(
      'Erkennen Sie die Absichten hinter Porträt, Street, Landschaft, Makro'
    );
  });

  it('composition + triangle + smartphone still ship article.de + sniff DE + CSS :has (regress)', () => {
    for (const html of [composition, triangle, smartphone]) {
      expect(html).toContain('<article class="de">');
      expect(html).toContain("p === 'de'");
      expect(html).toContain("setLocales('de_DE', 'fr_FR')");
    }
    expect(composition).toContain('Fotokomposition: den Blick führen');
    expect(triangle).toContain('Belichtungsdreieck: die 3 Hebel des Lichts');
    expect(smartphone).toContain(
      'Smartphone-Fotografie: bessere Aufnahmen, ohne Ausrüstung'
    );
    expect(guidesCssMirror).toContain('html[lang="de"]:has(article.de) .en');
    expect(guidesCssMirror).toContain('html[lang="de"] article.de');
  });

  it('composition/triangle/smartphone/lumière/genres still ship article.es + hreflang="es" (ES regress)', () => {
    for (const html of [composition, triangle, smartphone, lumiere, genres]) {
      expect(html).toContain('<article class="es">');
      expect(html).toContain('hreflang="es"');
    }
    expect(lumiere).toContain('Luz foto: leer antes de ajustar');
    expect(genres).toContain('Géneros fotográficos: la intención antes del cuerpo');
  });

  it('still no hreflang="de"; no sitemap ?lang=de (retouche expand is 1.63)', () => {
    /* Historical 1.62 lock: lumière/genres expand. Retouche/matériel article.de landed in 1.63. */
    for (const html of [composition, triangle, smartphone, lumiere, genres, retouche]) {
      expect(html).not.toContain('hreflang="de"');
    }
    expect(sitemap).not.toContain('?lang=de');
    expect(lumiere).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/lumiere-photo" />'
    );
    expect(genres).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/genres-photo" />'
    );
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.62', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.62/);
  });
});
