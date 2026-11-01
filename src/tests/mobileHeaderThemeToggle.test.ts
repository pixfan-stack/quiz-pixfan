import { describe, expect, it } from 'vitest';
import appSource from '../App.tsx?raw';

/** Vitest empties `.css?raw`; read CSS from disk (no @types/node in tsconfig). */
declare function require(id: string): {
  readFileSync: (path: string, encoding: string) => string;
};

const { readFileSync } = require('node:fs');
const globalCss = readFileSync('src/styles/global.css', 'utf8');

describe('mobile header — theme toggle stays on-screen (CSS-first)', () => {
  it('hides header nav pills under 720px so lang + Nuit/Jour fit', () => {
    const mediaIdx = globalCss.indexOf('@media (max-width: 720px)');
    expect(mediaIdx).toBeGreaterThan(-1);
    const block = globalCss.slice(mediaIdx, mediaIdx + 280);
    expect(block).toContain('.app-header .guide-nav-link');
    expect(block).toContain('.app-header .app-header__pixfan-link');
    expect(block).toContain('display: none');
  });

  it('uses SVG sun/moon icons (no emoji) with accessible short label', () => {
    expect(appSource).toContain('className="dark-mode-toggle"');
    expect(appSource).toContain('dark-mode-toggle__icon');
    expect(appSource).toContain('visually-hidden');
    expect(appSource).toContain('common.darkModeShort');
    expect(appSource).toContain('common.lightModeShort');
    expect(appSource).not.toContain("'🌙'");
    expect(appSource).not.toContain("'☀️'");
    expect(globalCss).toContain('.dark-mode-toggle__icon');
    expect(globalCss).toContain('@media (max-width: 720px)');
  });

  it('footer still carries Guides / Scolaires / pixfan links', () => {
    expect(appSource).toContain('className="app-footer__guides"');
    expect(appSource).toContain('data-testid="footer-scolaires-link"');
    expect(appSource).toMatch(
      /app-footer__link[\s\S]*?https:\/\/www\.pixfan\.com/
    );
  });
});
