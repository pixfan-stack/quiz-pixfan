import { describe, expect, it } from 'vitest';
import sitemap from '../../public/sitemap.xml?raw';
import redirects from '../../public/_redirects?raw';
import headers from '../../public/_headers?raw';
import questionsData from '../../public/data/questions.json';

/** Floor: must track catalogue-complete SEO refresh (vague 1.98+). */
const LASTMOD_FLOOR = '2026-11-05';

const GUIDE_TOPICS = [
  'triangle-exposition',
  'composition-photo',
  'photo-smartphone',
  'lumiere-photo',
  'retouche-lightroom',
  'genres-photo',
  'materiel-photo',
  'droits-ethique-photo',
  'histoire-photo',
] as const;

const GUIDE_BASES = [
  'https://quiz.pixfan.fr/',
  'https://quiz.pixfan.fr/guides/',
  'https://quiz.pixfan.fr/guides/scolaires/',
  'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html',
  ...GUIDE_TOPICS.map((slug) => `https://quiz.pixfan.fr/guides/${slug}`),
] as const;

const SHARE_MODES = [
  'daily',
  'photo-reading',
  'weak-spots',
  'random',
  'mix-easy',
  'mix-medium',
  'mix-hard',
] as const;

const PATH_LANGS = ['en', 'es', 'de'] as const;

const data = questionsData as { quizzes: Array<{ id: string }> };

function lastmodForLoc(loc: string): string | null {
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = sitemap.match(
    new RegExp(
      `<loc>${escaped}</loc>\\s*<lastmod>(\\d{4}-\\d{2}-\\d{2})</lastmod>`
    )
  );
  return match?.[1] ?? null;
}

function allLocs(): string[] {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
}

function pathTwin(base: string, lang: string): string {
  const u = new URL(base);
  if (u.pathname === '/') return `https://quiz.pixfan.fr/${lang}/`;
  return `https://quiz.pixfan.fr/${lang}${u.pathname}`;
}

describe('sitemap / SEO hygiene', () => {
  it('lists expected inventory (74 locs) with path locales + lastmod ≥ floor', () => {
    expect(sitemap.startsWith('<?xml')).toBe(true);
    expect(sitemap).toContain('<urlset');

    const locs = allLocs();
    expect(locs).toHaveLength(74);
    // No legacy ?lang= twins in sitemap (vague 1.99 path product).
    expect(sitemap).not.toMatch(/\?lang=/);

    // Home + guides + fiche: bare FR + /en|/es|/de path twins.
    for (const base of GUIDE_BASES) {
      expect(locs, base).toContain(base);
      for (const lang of PATH_LANGS) {
        const twin = pathTwin(base, lang);
        expect(locs, twin).toContain(twin);
      }
    }

    // Pack deep-links must match questions.json 1:1.
    const packIds = data.quizzes.map((q) => q.id);
    expect(packIds).toHaveLength(15);
    for (const id of packIds) {
      const loc = `https://quiz.pixfan.fr/s/${id}`;
      expect(locs, loc).toContain(loc);
    }

    for (const mode of SHARE_MODES) {
      const loc = `https://quiz.pixfan.fr/s/${mode}`;
      expect(locs, loc).toContain(loc);
    }

    for (const loc of locs) {
      const mod = lastmodForLoc(loc);
      expect(mod, loc).toBeTruthy();
      expect(mod! >= LASTMOD_FLOOR, `${loc} lastmod ${mod}`).toBe(true);
    }

    expect(sitemap).not.toContain('<lastmod>2026-10-22</lastmod>');
    expect(sitemap).not.toContain('<lastmod>2026-10-28</lastmod>');
    expect(sitemap).not.toContain('<lastmod>2026-10-31</lastmod>');
    expect(sitemap).not.toMatch(/<lastmod>2026-09-\d{2}<\/lastmod>/);
    expect(sitemap).not.toMatch(/<lastmod>2026-10-\d{2}<\/lastmod>/);
  });

  it('excludes sitemap/robots from SPA catch-all; path-locale redirects before catch-all', () => {
    expect(redirects).toMatch(/\/sitemap\.xml\s+\/sitemap\.xml\s+200/);
    expect(redirects).toMatch(/\/robots\.txt\s+\/robots\.txt\s+200/);
    // No `/?lang=` rules — CF Pages would treat them as `/` → locale (home break).
    expect(redirects).not.toMatch(/\/\?lang=/);
    expect(redirects).toMatch(/\/en\s+\/en\/\s+301/);
    expect(redirects).toMatch(/\/en\/guides\/\s+\/guides\/index\.html\s+200/);
    expect(redirects).toMatch(/\/es\/guides\/\*\s+\/guides\/:splat\s+200/);
    const sitemapIdx = redirects.indexOf('/sitemap.xml');
    const spaIdx = redirects.indexOf('/*');
    expect(sitemapIdx).toBeGreaterThanOrEqual(0);
    expect(spaIdx).toBeGreaterThan(sitemapIdx);
    expect(redirects.indexOf('/en/guides/')).toBeGreaterThan(sitemapIdx);
    expect(redirects.indexOf('/en/guides/')).toBeLessThan(spaIdx);
  });

  it('declares application/xml for sitemap via _headers', () => {
    expect(headers).toMatch(
      /\/sitemap\.xml[\s\S]*Content-Type:\s*application\/xml/
    );
    expect(headers).toMatch(/\/robots\.txt[\s\S]*Content-Type:\s*text\/plain/);
  });
});
