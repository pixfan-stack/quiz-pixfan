import { describe, expect, it } from 'vitest';
import nextSteps from '../../NEXT_STEPS.md?raw';
import redirects from '../../public/_redirects?raw';
import shareLanding from '../../functions/lib/shareLanding.ts?raw';
import bareShare from '../../functions/s/[id].ts?raw';
import enShare from '../../functions/en/s/[id].ts?raw';
import esShare from '../../functions/es/s/[id].ts?raw';
import deShare from '../../functions/de/s/[id].ts?raw';
import { handleShareLanding } from '../../functions/lib/shareLanding';
import { buildShareHtml } from '../../functions/lib/sharePreview';

describe('vague 1.105 — stop locale session FAQ injection (QP-293)', () => {
  it('NEXT_STEPS cites v1.104.0 + vague 1.105; no-go through 1.105', () => {
    expect(nextSteps).toContain('**v1.104.0**');
    expect(nextSteps).toContain('Vague **1.105**');
    expect(nextSteps).toMatch(/no-go.*1\.105/);
  });

  it('drops broken /xx/s/:id → /s/:id 200 proxy (CF static-only)', () => {
    const active = redirects
      .split('\n')
      .filter((l) => l.trim() && !l.trim().startsWith('#'))
      .join('\n');
    expect(active).not.toMatch(/\/en\/s\/:id\s+\/s\/:id\s+200/);
    expect(active).not.toMatch(/\/es\/s\/:id\s+\/s\/:id\s+200/);
    expect(active).not.toMatch(/\/de\/s\/:id\s+\/s\/:id\s+200/);
    // Comment documents the Function-vs-static root cause.
    expect(redirects).toMatch(/static asset/i);
    expect(redirects).toMatch(/functions\/\{en,es,de\}\/s\/\[id\]\.ts/);
  });

  it('ships locale Pages Functions that reuse shared share landing', () => {
    expect(bareShare).toContain('handleShareLanding');
    expect(enShare).toContain("pathLang: 'en'");
    expect(esShare).toContain("pathLang: 'es'");
    expect(deShare).toContain("pathLang: 'de'");
    expect(enShare).toContain('handleShareLanding');
    expect(esShare).toContain('handleShareLanding');
    expect(deShare).toContain('handleShareLanding');
    expect(shareLanding).toContain('handleShareLanding');
    expect(shareLanding).toContain('pathLang');
    expect(shareLanding).toContain('buildShareHtml');
  });

  it('pathLang soft-wires locale into share HTML (no homepage FAQ)', async () => {
    const res = await handleShareLanding(
      {
        request: new Request('https://quiz.pixfan.fr/en/s/daily'),
        params: { id: 'daily' },
      },
      { pathLang: 'en' }
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('max-age=300');
    const html = await res.text();
    expect(html).toMatch(/<html[^>]*lang="en"/i);
    expect(html).toMatch(/Daily challenge/i);
    expect(html).not.toContain('FAQPage');
    expect(html).not.toContain(
      'Ist das PixFan-Fotografie-Quiz kostenlos?'
    );
    expect(html).not.toContain('application/ld+json');

    const es = await handleShareLanding(
      {
        request: new Request('https://quiz.pixfan.fr/es/s/daily'),
        params: { id: 'daily' },
      },
      { pathLang: 'es' }
    );
    const esHtml = await es.text();
    expect(esHtml).toMatch(/lang="es"/i);
    expect(esHtml).not.toContain('FAQPage');

    const de = await handleShareLanding(
      {
        request: new Request('https://quiz.pixfan.fr/de/s/photo-reading'),
        params: { id: 'photo-reading' },
      },
      { pathLang: 'de' }
    );
    const deHtml = await de.text();
    expect(deHtml).toMatch(/lang="de"/i);
    expect(deHtml).not.toContain('FAQPage');
  });

  it('?lang= still wins over pathLang; bare share stays FAQ-free', async () => {
    const res = await handleShareLanding(
      {
        request: new Request(
          'https://quiz.pixfan.fr/en/s/daily?lang=fr'
        ),
        params: { id: 'daily' },
      },
      { pathLang: 'en' }
    );
    const html = await res.text();
    expect(html).toMatch(/lang="fr"/i);
    expect(html).not.toContain('FAQPage');

    const bare = buildShareHtml({
      quizId: 'daily',
      score: null,
      lang: 'en',
      pageUrl: 'https://quiz.pixfan.fr/s/daily',
      ogImageUrl: 'https://quiz.pixfan.fr/api/og?quiz=daily',
      appOrigin: 'https://quiz.pixfan.fr',
      classe: false,
    });
    expect(bare).not.toContain('FAQPage');
    expect(bare).not.toContain('application/ld+json');
  });
});
