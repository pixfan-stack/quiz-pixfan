import { describe, expect, it } from 'vitest';
import nextSteps from '../../NEXT_STEPS.md?raw';
import { handleShareLanding } from '../../functions/lib/shareLanding';
import {
  buildShareHtml,
  escapeXml,
  LABELS,
  parseLang,
  quizLabel,
} from '../../functions/lib/sharePreview';

/** Packs with distinct FR vs EN share labels (spot-check recent + classic). */
const BARE_FR_PACKS = [
  'nikon-histoire',
  'tamron-histoire',
  'lexique-image-fixe',
  'flash-studio',
  'marques-photo',
  'composition',
] as const;

function sharePageTitle(quizId: string, lang: 'fr' | 'en' | 'es' | 'de'): string {
  return escapeXml(`${quizLabel(quizId, lang)} · Quiz PixFan`);
}

describe('vague 1.107 — bare /s/:id FR share titles (QP-296)', () => {
  it('NEXT_STEPS cites v1.106.0 + vague 1.107; no-go through 1.107', () => {
    expect(nextSteps).toContain('**v1.106.0**');
    expect(nextSteps).toContain('Vague **1.107**');
    expect(nextSteps).toMatch(/no-go.*1\.107/);
  });

  it('parseLang defaults to FR when lang/path missing; en|es|de stay explicit', () => {
    expect(parseLang(null)).toBe('fr');
    expect(parseLang('')).toBe('fr');
    expect(parseLang('fr')).toBe('fr');
    expect(parseLang('fr-FR')).toBe('fr');
    expect(parseLang('en')).toBe('en');
    expect(parseLang('en-US')).toBe('en');
    expect(parseLang('es')).toBe('es');
    expect(parseLang('de')).toBe('de');
  });

  it('bare /s/:id serves French title + og/twitter for all labeled packs', async () => {
    for (const id of Object.keys(LABELS)) {
      const res = await handleShareLanding({
        request: new Request(`https://quiz.pixfan.fr/s/${id}`),
        params: { id },
      });
      expect(res.status, id).toBe(200);
      const html = await res.text();
      const frTitle = sharePageTitle(id, 'fr');
      const enTitle = sharePageTitle(id, 'en');
      expect(html, id).toMatch(/<html[^>]*lang="fr"/i);
      expect(html, id).toContain(`<title>${frTitle}</title>`);
      expect(html, id).toContain(`property="og:title" content="${frTitle}"`);
      expect(html, id).toContain(`name="twitter:title" content="${frTitle}"`);
      if (frTitle !== enTitle) {
        expect(html, id).not.toContain(`<title>${enTitle}</title>`);
      }
    }
  });

  it('spot-checks recent packs; /en /es /de and ?lang= stay correct', async () => {
    for (const id of BARE_FR_PACKS) {
      const bare = await handleShareLanding({
        request: new Request(`https://quiz.pixfan.fr/s/${id}`),
        params: { id },
      });
      const bareHtml = await bare.text();
      expect(bareHtml).toContain(sharePageTitle(id, 'fr'));
      expect(bareHtml).toMatch(/lang="fr"/i);

      const withFr = await handleShareLanding({
        request: new Request(`https://quiz.pixfan.fr/s/${id}?lang=fr`),
        params: { id },
      });
      expect(await withFr.text()).toContain(sharePageTitle(id, 'fr'));
    }

    const en = await handleShareLanding(
      {
        request: new Request('https://quiz.pixfan.fr/en/s/nikon-histoire'),
        params: { id: 'nikon-histoire' },
      },
      { pathLang: 'en' }
    );
    const enHtml = await en.text();
    expect(enHtml).toMatch(/lang="en"/i);
    expect(enHtml).toContain('Nikon history · Quiz PixFan');

    const de = await handleShareLanding(
      {
        request: new Request('https://quiz.pixfan.fr/de/s/tamron-histoire'),
        params: { id: 'tamron-histoire' },
      },
      { pathLang: 'de' }
    );
    const deHtml = await de.text();
    expect(deHtml).toMatch(/lang="de"/i);
    expect(deHtml).toContain('Tamron-Geschichte · Quiz PixFan');

    const es = await handleShareLanding(
      {
        request: new Request('https://quiz.pixfan.fr/es/s/flash-studio'),
        params: { id: 'flash-studio' },
      },
      { pathLang: 'es' }
    );
    expect(await es.text()).toMatch(/lang="es"/i);

    const queryWins = await handleShareLanding(
      {
        request: new Request(
          'https://quiz.pixfan.fr/en/s/tamron-histoire?lang=fr'
        ),
        params: { id: 'tamron-histoire' },
      },
      { pathLang: 'en' }
    );
    const qHtml = await queryWins.text();
    expect(qHtml).toMatch(/lang="fr"/i);
    expect(qHtml).toContain('Histoire de Tamron · Quiz PixFan');
  });

  it('buildShareHtml FR default matches bare landing meta', () => {
    const html = buildShareHtml({
      quizId: 'nikon-histoire',
      score: null,
      lang: 'fr',
      pageUrl: 'https://quiz.pixfan.fr/s/nikon-histoire',
      ogImageUrl: 'https://quiz.pixfan.fr/og/themes/nikon-histoire.png?v1',
      appOrigin: 'https://quiz.pixfan.fr',
    });
    expect(html).toContain('<title>Histoire de Nikon · Quiz PixFan</title>');
    expect(html).toContain('og:title');
    expect(html).toContain('twitter:title');
  });
});
