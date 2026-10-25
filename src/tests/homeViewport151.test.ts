import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import guidesCssMirror from '../../public/guides/i18n-display.css.txt?raw';
import triangle from '../../public/guides/triangle-exposition.html?raw';
import composition from '../../public/guides/composition-photo.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';

describe('vague 1.51 — docs v1.50.0 + composition article.es pilot', () => {
  it('docs headline cites v1.50.0; vague 1.50 listed; no-go through 1.51', () => {
    expect(readme).toContain('v1.50.0');
    expect(nextSteps).toContain('**v1.50.0**');
    expect(nextSteps).toContain('Vague **1.50**');
    expect(nextSteps).toMatch(/no-go.*1\.51/);
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
    /* de stays interim EN */
    expect(composition).toMatch(/p === 'en' \|\| p === 'de'/);
  });

  it('i18n-display mirror documents article.es preference (synced into guides.css)', () => {
    /* Vite empties .css?raw in vitest — armor the .txt mirror kept in sync with guides.css */
    expect(guidesCssMirror).toContain('html[lang="es"]:has(article.es) .en');
    expect(guidesCssMirror).toContain('html[lang="es"] article.es');
    expect(guidesCssMirror).toContain('html[lang="es"] .en');
  });

  it('triangle (non-pilot) still has no article.es', () => {
    expect(triangle).not.toContain('<article class="es">');
  });

  it('still no hreflang es/de (pilot partial — product rule)', () => {
    for (const html of [triangle, composition]) {
      expect(html).not.toContain('hreflang="es"');
      expect(html).not.toContain('hreflang="de"');
    }
  });

  it('still no path-locale /es/ scheme in LanguageSwitcher', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
  });
});
