import { describe, expect, it } from 'vitest';
import sitemap from '../../public/sitemap.xml?raw';
import redirects from '../../public/_redirects?raw';
import headers from '../../public/_headers?raw';

/** Floor: home / hub scolaires must not lag behind the last catalog vague. */
const LASTMOD_FLOOR = '2026-10-22';

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

    // Guides index + topic pages (vague 1.35 armor).
    const guidesIndex = lastmodForLoc('https://quiz.pixfan.fr/guides/');
    expect(guidesIndex).toBeTruthy();
    expect(guidesIndex! >= LASTMOD_FLOOR).toBe(true);
    const guideTopics = [
      'triangle-exposition',
      'composition-photo',
      'photo-smartphone',
      'lumiere-photo',
      'retouche-lightroom',
      'genres-photo',
      'materiel-photo',
      'droits-ethique-photo',
      'histoire-photo',
    ];
    for (const slug of guideTopics) {
      const loc = `https://quiz.pixfan.fr/guides/${slug}`;
      const mod = lastmodForLoc(loc);
      expect(mod, loc).toBeTruthy();
      expect(mod! >= LASTMOD_FLOOR, loc).toBe(true);
    }

    // Pack / mode deep-links must not lag the catalog floor (vague 1.33).
    const packLocs = [...sitemap.matchAll(/<loc>(https:\/\/quiz\.pixfan\.fr\/s\/[^<]+)<\/loc>/g)].map(
      (m) => m[1]
    );
    expect(packLocs.length).toBeGreaterThan(10);
    for (const loc of packLocs) {
      const mod = lastmodForLoc(loc);
      expect(mod, loc).toBeTruthy();
      expect(mod! >= LASTMOD_FLOOR, loc).toBe(true);
    }

    // Guard against accidental rollback to pre-lexique dates.
    expect(sitemap).not.toContain('<lastmod>2026-09-24</lastmod>');
    expect(sitemap).not.toMatch(/<lastmod>2026-09-\d{2}<\/lastmod>/);

    // Vague 1.57–1.59: ?lang= twins for ES-ready guides + home + fiche.
    const esReady = [
      'https://quiz.pixfan.fr/',
      'https://quiz.pixfan.fr/guides/',
      'https://quiz.pixfan.fr/guides/scolaires/',
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html',
      'https://quiz.pixfan.fr/guides/composition-photo',
      'https://quiz.pixfan.fr/guides/triangle-exposition',
      'https://quiz.pixfan.fr/guides/photo-smartphone',
      'https://quiz.pixfan.fr/guides/lumiere-photo',
      'https://quiz.pixfan.fr/guides/retouche-lightroom',
      'https://quiz.pixfan.fr/guides/genres-photo',
      'https://quiz.pixfan.fr/guides/materiel-photo',
      'https://quiz.pixfan.fr/guides/droits-ethique-photo',
      'https://quiz.pixfan.fr/guides/histoire-photo',
    ];
    for (const base of esReady) {
      expect(sitemap, base).toContain(`<loc>${base}?lang=en</loc>`);
      expect(sitemap, base).toContain(`<loc>${base}?lang=es</loc>`);
      const enMod = lastmodForLoc(`${base}?lang=en`);
      const esMod = lastmodForLoc(`${base}?lang=es`);
      expect(enMod, `${base}?lang=en`).toBeTruthy();
      expect(esMod, `${base}?lang=es`).toBeTruthy();
      expect(enMod! >= LASTMOD_FLOOR, `${base}?lang=en`).toBe(true);
      expect(esMod! >= LASTMOD_FLOOR, `${base}?lang=es`).toBe(true);
    }

    // Vague 1.66–1.68: ?lang=de twins for DE-ready guides + home + fiche.
    const deReady = [
      'https://quiz.pixfan.fr/',
      'https://quiz.pixfan.fr/guides/',
      'https://quiz.pixfan.fr/guides/scolaires/',
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html',
      'https://quiz.pixfan.fr/guides/composition-photo',
      'https://quiz.pixfan.fr/guides/triangle-exposition',
      'https://quiz.pixfan.fr/guides/photo-smartphone',
      'https://quiz.pixfan.fr/guides/lumiere-photo',
      'https://quiz.pixfan.fr/guides/retouche-lightroom',
      'https://quiz.pixfan.fr/guides/genres-photo',
      'https://quiz.pixfan.fr/guides/materiel-photo',
      'https://quiz.pixfan.fr/guides/droits-ethique-photo',
      'https://quiz.pixfan.fr/guides/histoire-photo',
    ];
    for (const base of deReady) {
      expect(sitemap, base).toContain(`<loc>${base}?lang=de</loc>`);
      const deMod = lastmodForLoc(`${base}?lang=de`);
      expect(deMod, `${base}?lang=de`).toBeTruthy();
      expect(deMod! >= LASTMOD_FLOOR, `${base}?lang=de`).toBe(true);
    }
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
