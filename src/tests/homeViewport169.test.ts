import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import sitemap from '../../public/sitemap.xml?raw';
import indexHtml from '../../index.html?raw';
import fiche from '../../public/guides/scolaires/fiche-seance.html?raw';
import switcherSource from '../components/LanguageSwitcher.tsx?raw';
import sharePreviewSource from '../../functions/lib/sharePreview.ts?raw';
import questions from '../../public/data/questions.json';
import { quizLabel, toContentLang } from '../../functions/lib/sharePreview';

describe('vague 1.69 — docs v1.68.0 + FAQ JSON-LD ES/DE + sharePreview LABELS', () => {
  it('docs still mention vague 1.68/1.69; no-go through 1.69; headline may be v1.69.0', () => {
    /* Docs headline moved to v1.69.0 in vague 1.70 — keep historical Livré lock. */
    expect(readme).toMatch(/v1\.(68|69)\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.(68|69)\.0\*\*/);
    expect(nextSteps).toContain('Vague **1.68**');
    expect(nextSteps).toContain('Vague **1.69**');
    expect(nextSteps).toMatch(/no-go.*1\.69/);
  });

  it('FAQPage ships Question entities inLanguage es + de for 6 topics', () => {
    expect(indexHtml).toContain('"@type": "FAQPage"');
    expect(indexHtml).toContain('"inLanguage": ["fr", "en", "es", "de"]');
    const esQs = (indexHtml.match(/"inLanguage": "es"/g) ?? []).length;
    const deQs = (indexHtml.match(/"inLanguage": "de"/g) ?? []).length;
    expect(esQs).toBeGreaterThanOrEqual(6);
    expect(deQs).toBeGreaterThanOrEqual(6);
    expect(indexHtml).toContain('¿El quiz de fotografía PixFan es gratis?');
    expect(indexHtml).toContain('Ist das PixFan-Fotografie-Quiz kostenlos?');
    expect(indexHtml).toContain('Quelles langues sont disponibles ?');
    expect(indexHtml).toContain('Which languages are available?');
    expect(indexHtml).not.toContain('bilingues FR/EN');
    expect(indexHtml).not.toContain('bilingual FR/EN');
    expect(indexHtml).toContain('plusieurs packs ont déjà une version ES');
    expect(indexHtml).toContain('DE catalog is not translated yet');
  });

  it('sharePreview LABELS + ContentLang cover es/de (no collapse)', () => {
    expect(toContentLang('es')).toBe('es');
    expect(toContentLang('de')).toBe('de');
    expect(toContentLang('fr')).toBe('fr');
    expect(quizLabel('composition', 'es')).toBe('Composición');
    expect(quizLabel('composition', 'de')).toBe('Komposition');
    expect(quizLabel('composition', 'es')).not.toBe('Composition');
    expect(quizLabel('composition', 'de')).not.toBe('composition');
    expect(sharePreviewSource).toContain("es: 'Composición'");
    expect(sharePreviewSource).toContain("de: 'Komposition'");
    expect(sharePreviewSource).toContain("es: 'Semana Lightroom'");
    expect(sharePreviewSource).toContain("de: 'Lightroom-Woche'");
  });

  it('regress: home/fiche keep hreflang es+de + sitemap twins', () => {
    expect(indexHtml).toContain(
      '<link rel="alternate" hreflang="es" href="https://quiz.pixfan.fr/?lang=es" />'
    );
    expect(indexHtml).toContain(
      '<link rel="alternate" hreflang="de" href="https://quiz.pixfan.fr/?lang=de" />'
    );
    expect(fiche).toContain(
      '<link rel="alternate" hreflang="es" href="https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=es" />'
    );
    expect(fiche).toContain(
      '<link rel="alternate" hreflang="de" href="https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=de" />'
    );
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=es');
    expect(sitemap).toContain('https://quiz.pixfan.fr/?lang=de');
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=es'
    );
    expect(sitemap).toContain(
      'https://quiz.pixfan.fr/guides/scolaires/fiche-seance.html?lang=de'
    );
  });

  it('still no path-locale /es/|/de/; portrait-light .es unlocked in 1.70; ops no-gos through 1.69', () => {
    expect(switcherSource).not.toContain('/es/');
    expect(switcherSource).not.toContain('/de/');
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.69/);
    const packsWithoutEs = questions.quizzes
      .filter((q) => q.title.es == null || q.title.es === '')
      .map((q) => q.id)
      .sort();
    /* portrait-light gained .es in vague 1.70 — drop from historical without-es lock. */
    expect(packsWithoutEs).toEqual(
      [
        'composition',
        'exposure-basics',
        'gear-lenses',
        'genres',
        'lightroom-workflow',
        'marques-photo',
        'public-domain',
        'smartphone',
      ].sort()
    );
    expect(
      questions.quizzes.every((q) => {
        const title = q.title as { de?: string };
        return title.de == null || title.de === '';
      })
    ).toBe(true);
  });
});
