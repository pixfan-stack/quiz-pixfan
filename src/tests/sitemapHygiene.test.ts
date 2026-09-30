import { describe, expect, it } from 'vitest';
import sitemap from '../../public/sitemap.xml?raw';
import redirects from '../../public/_redirects?raw';
import headers from '../../public/_headers?raw';

/** Floor: home / hub scolaires must not lag behind the last catalog vague. */
const LASTMOD_FLOOR = '2026-09-30';

function lastmodForLoc(loc: string): string | null {
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = sitemap.match(
    new RegExp(
      `<loc>${escaped}</loc>\\s*<lastmod>(\\d{4}-\\d{2}-\\d{2})</lastmod>`
    )
  );
  return match?.[1] ?? null;
}

describe('sitemap / SEO hygiene', () => {
  it('lists lexique + scolaires and keeps home/hub lastmod ≥ floor', () => {
    expect(sitemap.startsWith('<?xml')).toBe(true);
    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('https://quiz.pixfan.fr/s/marques-photo');
    expect(sitemap).toContain('https://quiz.pixfan.fr/s/flash-studio');
    expect(sitemap).toContain('https://quiz.pixfan.fr/s/lexique-image-fixe');
    expect(sitemap).toContain('https://quiz.pixfan.fr/guides/scolaires/');
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html'
    );

    const home = lastmodForLoc('https://quiz.pixfan.fr/');
    const hub = lastmodForLoc('https://quiz.pixfan.fr/guides/scolaires/');
    const fiche = lastmodForLoc(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html'
    );
    expect(home).toBeTruthy();
    expect(hub).toBeTruthy();
    expect(fiche).toBeTruthy();
    expect(home! >= LASTMOD_FLOOR).toBe(true);
    expect(hub! >= LASTMOD_FLOOR).toBe(true);
    expect(fiche! >= LASTMOD_FLOOR).toBe(true);

    // Guard against accidental rollback to pre-lexique dates.
    expect(sitemap).not.toContain('<lastmod>2026-09-24</lastmod>');
  });

  it('excludes sitemap and robots from bare SPA catch-all precedence', () => {
    expect(redirects).toMatch(/\/sitemap\.xml\s+\/sitemap\.xml\s+200/);
    expect(redirects).toMatch(/\/robots\.txt\s+\/robots\.txt\s+200/);
    const sitemapIdx = redirects.indexOf('/sitemap.xml');
    const spaIdx = redirects.indexOf('/*');
    expect(sitemapIdx).toBeGreaterThanOrEqual(0);
    expect(spaIdx).toBeGreaterThan(sitemapIdx);
  });

  it('declares application/xml for sitemap via _headers', () => {
    expect(headers).toMatch(
      /\/sitemap\.xml[\s\S]*Content-Type:\s*application\/xml/
    );
    expect(headers).toMatch(/\/robots\.txt[\s\S]*Content-Type:\s*text\/plain/);
  });
});
