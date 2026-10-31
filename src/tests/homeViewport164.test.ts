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
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import homeSpa from '../../index.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.64 — docs v1.63.0 + droits/histoire article.de expand (9/9)', () => {
  it('docs still mention vague 1.63; no-go line covers 1.64+', () => {
    /* Docs headline moved to v1.64.0 in vague 1.65 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.63**');
    expect(nextSteps).toMatch(/no-go.*1\.64/);
    expect(readme).toMatch(/v1\.(63|64|65|66|67)\.0/);
  });

  it('droits ships real article.de (DE strings, not EN stub)', () => {
    expect(droits).toContain('<article class="de">');
    expect(droits).toContain(
      'Foto-Rechte &amp; Ethik: wissen, was man veröffentlichen darf'
    );
    expect(droits).toContain('Creative-Commons-Lizenzen');
    expect(droits).toContain('href="/s/photo-rights?lang=de"');
    expect(droits).toContain('href="/guides/scolaires/?lang=de#c4-emi-droits"');
    expect(droits).toContain('href="/guides/histoire-photo?lang=de"');
    expect(droits).not.toMatch(
      /<article class="de">[\s\S]*Photo rights & ethics: what you can publish/
    );
  });

  it('histoire ships real article.de (DE strings, not EN stub)', () => {
    expect(histoire).toContain('<article class="de">');
    expect(histoire).toContain(
      'Geschichte &amp; Ikonen: ein Bild in seiner Zeit lesen'
    );
    expect(histoire).toContain('Gemeinfreie Galerie');
    expect(histoire).toContain('href="/s/history-icons?lang=de"');
    expect(histoire).toContain('href="/guides/scolaires/?lang=de#c3-decouvrir"');
    expect(histoire).toContain('href="/guides/droits-ethique-photo?lang=de"');
    expect(histoire).not.toMatch(
      /<article class="de">[\s\S]*History & icons: reading a photo in its time/
    );
  });

  it('droits + histoire sniff set German share meta for ?lang=de', () => {
    for (const html of [droits, histoire]) {
      expect(html).toContain("p === 'de'");
      expect(html).toContain("setLocales('de_DE', 'fr_FR')");
      expect(html).toContain("p === 'en'");
      expect(html).toContain("p === 'es'");
      expect(html).toContain("setLocales('es_ES', 'fr_FR')");
      expect(html).not.toMatch(/p === 'en' \|\| p === 'de'/);
    }
    expect(droits).toContain('Foto-Rechte & Ethik — Leitfaden + Quiz');
    expect(droits).toContain(
      'Urheberrecht, Creative Commons, Model Release und Ethik'
    );
    expect(histoire).toContain('Fotogeschichte & Ikonen — Leitfaden + Quiz');
    expect(histoire).toContain(
      'Niépce, Daguerre, Magnum, HCB, Atget… Meilensteine der Fotogeschichte'
    );
  });

  it('full topic cluster 9/9 still ships article.de + sniff DE + CSS :has (regress)', () => {
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
    expect(triangle).toContain('Belichtungsdreieck: die 3 Hebel des Lichts');
    expect(smartphone).toContain(
      'Smartphone-Fotografie: bessere Aufnahmen, ohne Ausrüstung'
    );
    expect(lumiere).toContain('Fotolicht: lesen, bevor man einstellt');
    expect(genres).toContain('Fotografische Genres: die Absicht vor dem Gehäuse');
    expect(retouche).toContain('Retusche &amp; Lightroom: ein klarer Workflow');
    expect(materiel).toContain(
      'Fotoausrüstung: für die Absicht wählen, nicht für das Datenblatt'
    );
    expect(guidesCssMirror).toContain('html[lang="de"]:has(article.de) .en');
    expect(guidesCssMirror).toContain('html[lang="de"] article.de');
  });

  it('droits/histoire + prior topics still ship article.es + hreflang="es" (ES regress)', () => {
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
      expect(html).toContain('hreflang="es"');
    }
    expect(droits).toContain(
      'Derechos y ética foto: saber qué se puede publicar'
    );
    expect(histoire).toContain(
      'Historia e iconos: leer una imagen en su tiempo'
    );
  });

  it('fiche still lacks hreflang de (home unlocked 1.67) + article.de; guides de unlocked 1.66', () => {
    /* Hreflang de unlocked in 1.66 on article.de pages — keep fiche negative. */
    expect(fiche).toContain('hreflang="de"'); /* unlocked vague 1.68 */
    /* home hreflang de unlocked in vague 1.67 — keep fiche negative */
    expect(fiche).toContain('<article class="de">'); /* unlocked vague 1.68 */
    expect(homeSpa).not.toContain('<article class="de">');
    /* home ?lang=de unlocked in vague 1.67 — keep fiche negative */
    expect(sitemap).toContain('fiche-seance.html?lang=de'); /* unlocked vague 1.68 */
    expect(droits).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/droits-ethique-photo" />'
    );
    expect(histoire).toContain(
      '<link rel="canonical" href="https://quiz.pixfan.fr/guides/histoire-photo" />'
    );
  });

  it('still no path-locale /es/|/de/; ops no-gos through 1.64', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.64/);
  });
});
