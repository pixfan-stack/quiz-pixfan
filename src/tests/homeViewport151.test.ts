import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import guidesCssMirror from '../../public/guides/i18n-display.css.txt?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.51 — docs v1.50.0 + composition article.es pilot', () => {
  it('docs still mention vague 1.50; no-go line covers 1.51+', () => {
    /* Docs headline moved to v1.51.0 in vague 1.52 — keep historical Livré lock. */
    expect(nextSteps).toContain('Vague **1.50**');
    expect(nextSteps).toMatch(/no-go.*1\.51/);
    expect(readme).toMatch(/v1\.(50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68)\.0/);
  });

  it('composition ships real article.es (not EN stub)', () => {
    expect(composition).toContain('<article class="es">');
    expect(composition).toContain('Composición fotográfica: guiar la mirada');
    expect(composition).toContain('href="/s/composition?lang=es"');
    expect(composition).not.toMatch(
      /<article class="es">[\s\S]*Photo composition: guide the eye/
    );
  });

  it('composition sniff sets Spanish share meta for ?lang=es', () => {
    expect(composition).toContain("p === 'es'");
    expect(composition).toContain('Composición fotográfica — guía + quiz');
    expect(composition).toContain("setLocales('es_ES', 'fr_FR')");
    /* de got real meta in vague 1.60 on composition — EN stays its own branch */
    expect(composition).toContain("p === 'en'");
  });

  it('i18n-display mirror documents article.es preference (synced into guides.css)', () => {
    /* Vite empties .css?raw in vitest — armor the .txt mirror kept in sync with guides.css */
    expect(guidesCssMirror).toContain('html[lang="es"]:has(article.es) .en');
    expect(guidesCssMirror).toContain('html[lang="es"] article.es');
    expect(guidesCssMirror).toContain('html[lang="es"] .en');
  });

  it('composition remains the 1.51 pilot article.es anchor', () => {
    expect(composition).toContain('<article class="es">');
    expect(composition).toContain('Composición fotográfica: guiar la mirada');
  });


  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});
