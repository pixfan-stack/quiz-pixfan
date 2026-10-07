import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const guidesDir = join(process.cwd(), 'public/guides');
const appSource = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8');

/** Top-level guide HTML pages (excludes scolaires/ subfolder). */
const guideHtmlFiles = readdirSync(guidesDir)
  .filter((name) => name.endsWith('.html'))
  .map((name) => join(guidesDir, name));

const hubHtml = join(guidesDir, 'scolaires/index.html');

describe('scolaires chrome URL + nav', () => {
  it('app chrome links to real /guides/scolaires/ (not hash-only)', () => {
    expect(appSource).toContain('href="/guides/scolaires/"');
    expect(appSource).toContain('data-testid="footer-scolaires-link"');
    expect(appSource).toContain('data-testid="header-scolaires-link"');
    // Footer must not use hash-only scolaires as the primary chrome URL
    expect(appSource).not.toMatch(
      /href="#\/scolaires"[\s\S]{0,80}data-testid="footer-scolaires-link"/
    );
    expect(appSource).not.toMatch(
      /data-testid="footer-scolaires-link"[\s\S]{0,120}href="#\/scolaires"/
    );
  });

  it('every top-level guide ships Scolaires in header + footer chrome', () => {
    expect(guideHtmlFiles.length).toBeGreaterThanOrEqual(9);
    for (const file of guideHtmlFiles) {
      const html = readFileSync(file, 'utf8');
      expect(
        html,
        `${file} missing header Scolaires → /guides/scolaires/`
      ).toMatch(/class="guide-nav-link[^"]*" href="\/guides\/scolaires\/"/);
      expect(
        html,
        `${file} missing footer Scolaires → /guides/scolaires/`
      ).toContain('href="/guides/scolaires/" class="app-footer__link">Scolaires');
    }
  });

  it('hub keeps Scolaires in chrome', () => {
    const hub = readFileSync(hubHtml, 'utf8');
    expect(hub).toMatch(/href="\/guides\/scolaires\/"/);
    expect(hub).toContain('href="/guides/scolaires/" class="app-footer__link">Scolaires');
  });
});
