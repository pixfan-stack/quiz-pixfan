import { describe, expect, it } from 'vitest';
import indexHtml from '../../index.html?raw';
import redirects from '../../public/_redirects?raw';
import partenaires from '../../public/partenaires/index.html?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import viteConfig from '../../vite.config.ts?raw';
import localePartenairesShells from '../../vite/localePartenairesShells.ts?raw';
import shareHandler from '../../functions/s/[id].ts?raw';
import {
  bakeLocalePartenairesHtml,
} from '../utils/localePartenairesShellBake';

function extractLdJsonBlocks(html: string): string[] {
  const blocks: string[] = [];
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    blocks.push(m[1]!.trim());
  }
  return blocks;
}

describe('vague 1.104 — homepage JSON-LD syntax + locale injection (QP-291)', () => {
  it('NEXT_STEPS cites v1.103.0 + vague 1.104; no-go through 1.104', () => {
    expect(nextSteps).toContain('**v1.103.0**');
    expect(nextSteps).toContain('Vague **1.104**');
    expect(nextSteps).toMatch(/no-go.*1\.104/);
  });

  it('homepage FAQ JSON-LD parses as valid JSON (no extra ] after mainEntity)', () => {
    const blocks = extractLdJsonBlocks(indexHtml);
    expect(blocks.length).toBeGreaterThanOrEqual(1);
    const faq = blocks.find((b) => b.includes('"@type": "FAQPage"'));
    expect(faq).toBeTruthy();
    expect(() => JSON.parse(faq!)).not.toThrow();
    const parsed = JSON.parse(faq!) as {
      '@graph'?: Array<{ '@type'?: string; mainEntity?: unknown[] }>;
    };
    const faqNode = parsed['@graph']?.find((n) => n['@type'] === 'FAQPage');
    expect(Array.isArray(faqNode?.mainEntity)).toBe(true);
    expect((faqNode?.mainEntity?.length ?? 0)).toBeGreaterThanOrEqual(6);
    // Fingerprint of the live bug: double ] after the FAQ array.
    expect(indexHtml).not.toMatch(/mainEntity[\s\S]*\}\s*\]\s*\]\s*\}/);
    expect(faq).toContain('Ist das PixFan-Fotografie-Quiz kostenlos?');
  });

  it('partenaires FR JSON-LD stays BreadcrumbList-only and parses', () => {
    const blocks = extractLdJsonBlocks(partenaires);
    expect(blocks).toHaveLength(1);
    expect(() => JSON.parse(blocks[0]!)).not.toThrow();
    expect(blocks[0]).toContain('BreadcrumbList');
    expect(blocks[0]).not.toContain('FAQPage');
    expect(blocks[0]).not.toContain(
      'Ist das PixFan-Fotografie-Quiz kostenlos?'
    );
  });

  it('bake partenaires shells: lang/canonical/breadcrumb, still valid JSON-LD', () => {
    const baked = bakeLocalePartenairesHtml(partenaires, 'en');
    expect(baked).toMatch(/<html\s+lang="en"/i);
    expect(baked).toContain(
      'rel="canonical" href="https://quiz.pixfan.fr/en/partenaires/"'
    );
    expect(baked).toContain(
      'property="og:url" content="https://quiz.pixfan.fr/en/partenaires/"'
    );
    expect(baked).toContain('"name": "Partners"');
    expect(baked).toContain(
      '"item": "https://quiz.pixfan.fr/en/partenaires/"'
    );
    expect(baked).not.toContain('FAQPage');
    const blocks = extractLdJsonBlocks(baked);
    expect(blocks).toHaveLength(1);
    expect(() => JSON.parse(blocks[0]!)).not.toThrow();
    expect(bakeLocalePartenairesHtml(partenaires, 'es')).toMatch(
      /lang="es"/i
    );
    expect(bakeLocalePartenairesHtml(partenaires, 'de')).toContain(
      'https://quiz.pixfan.fr/de/partenaires/'
    );
  });

  it('vite bakes partenaires shells; redirects drop broken rewrite + add /xx/s/:id', () => {
    expect(viteConfig).toContain('localePartenairesShellsPlugin');
    expect(localePartenairesShells).toContain('writeLocalePartenairesShells');
    expect(localePartenairesShells).toContain('bakeLocalePartenairesHtml');
    // Broken live rewrite must not ship.
    expect(redirects).not.toMatch(
      /\/en\/partenaires\/\s+\/partenaires\/index\.html\s+200/
    );
    expect(redirects).toMatch(/\/en\/partenaires\s+\/en\/partenaires\/\s+301/);
    expect(redirects).toMatch(/\/en\/s\/:id\s+\/s\/:id\s+200/);
    expect(redirects).toMatch(/\/es\/s\/:id\s+\/s\/:id\s+200/);
    expect(redirects).toMatch(/\/de\/s\/:id\s+\/s\/:id\s+200/);
    expect(shareHandler).toMatch(/pathLang/);
  });
});
