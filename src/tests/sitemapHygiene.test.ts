import { describe, expect, it } from 'vitest';
import sitemap from '../../public/sitemap.xml?raw';
import redirects from '../../public/_redirects?raw';
import headers from '../../public/_headers?raw';

describe('sitemap / SEO hygiene', () => {
  it('is well-formed XML with current lastmod and flash-studio', () => {
    expect(sitemap.startsWith('<?xml')).toBe(true);
    expect(sitemap).toContain('<urlset');
    expect(sitemap).toContain('https://quiz.pixfan.fr/s/marques-photo');
    expect(sitemap).toContain('https://quiz.pixfan.fr/s/flash-studio');
    expect(sitemap).toContain('<lastmod>2026-09-28</lastmod>');
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
