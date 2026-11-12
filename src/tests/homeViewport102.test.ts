import { describe, expect, it } from 'vitest';
import partenaires from '../../public/partenaires/index.html?raw';
import redirects from '../../public/_redirects?raw';
import sitemapXml from '../../public/sitemap.xml?raw';
import themeJs from '../../public/guides/theme.js?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import appSource from '../App.tsx?raw';

describe('vague 1.102 armor — partenaires page + reciprocal links', () => {
  it('public /partenaires/ has the two required HTTPS reciprocal anchors', () => {
    expect(partenaires).toContain(
      'href="https://www.photos-provence.fr/annuaire-photo"'
    );
    expect(partenaires).toContain('Provence Mer Montagne : annuaire photo');
    expect(partenaires).toContain('href="https://www.photoliens.eu/"');
    expect(partenaires).toContain(
      'Photoliens.eu — Annuaire photographie / Portail photo'
    );
    expect(partenaires).toContain(
      'rel="canonical" href="https://quiz.pixfan.fr/partenaires/"'
    );
  });

  it('sitemap + redirects cover path-locale partenaires; guides footer links it', () => {
    const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1]!
    );
    expect(locs).toHaveLength(78);
    expect(locs).toContain('https://quiz.pixfan.fr/partenaires/');
    expect(locs).toContain('https://quiz.pixfan.fr/en/partenaires/');
    expect(locs).toContain('https://quiz.pixfan.fr/es/partenaires/');
    expect(locs).toContain('https://quiz.pixfan.fr/de/partenaires/');
    // 1.104: locale partenaires are baked real files (rewrite 200 was ignored live).
    expect(redirects).toMatch(/\/en\/partenaires\s+\/en\/partenaires\/\s+301/);
    expect(redirects).not.toMatch(
      /\/en\/partenaires\/\s+\/partenaires\/index\.html\s+200/
    );
    expect(guidesIndex).toMatch(/href="\/partenaires\/"/);
    expect(themeJs).toContain('isPartenairesHref');
    expect(appSource).not.toContain('/partenaires/');
  });
});
