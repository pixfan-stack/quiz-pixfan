import { describe, expect, it } from 'vitest';
import readme from '../../README.md?raw';
import nextSteps from '../../NEXT_STEPS.md?raw';
import redirects from '../../public/_redirects?raw';
import guidesIndex from '../../public/guides/index.html?raw';
import scolairesHub from '../../public/guides/scolaires/index.html?raw';
import viteConfig from '../../vite.config.ts?raw';
import localeGuideShells from '../../vite/localeGuideShells.ts?raw';
import localeGuideBake from '../utils/localeGuideShellBake.ts?raw';
import {
  bakeLocaleGuidesHubHtml,
  bakeLocaleScolairesHubHtml,
  rewriteLangQueryHrefs,
} from '../utils/localeGuideShellBake';

describe('vague 1.103 — path-locale guides hub (+scolaires) shells', () => {
  it('NEXT_STEPS cites vague 1.103; no-go through 1.103+', () => {
    // README stays on historical armor baseline (v1.98.0); live tip is package.json.
    expect(readme).toMatch(/v1\.98\.0/);
    expect(nextSteps).toMatch(/\*\*v1\.(102|103|104)\.\d+\*\*/);
    expect(nextSteps).toContain('Vague **1.103**');
    expect(nextSteps).toMatch(/no-go.*1\.10[3-5]/);
  });

  it('vite builds locale guide shells for hubs + scolaires', () => {
    expect(viteConfig).toContain('localeGuideShellsPlugin');
    expect(localeGuideShells).toContain('writeLocaleGuideShells');
    expect(localeGuideShells).toContain('bakeLocaleGuidesHubHtml');
    expect(localeGuideBake).toContain('bakeLocaleGuidesHubHtml');
    expect(localeGuideBake).toContain('bakeLocaleScolairesHubHtml');
    expect(localeGuideBake).toContain("lang=\"${lang}\"");
    expect(localeGuideBake).toMatch(/Photo quiz guides/i);
    expect(localeGuideBake).toMatch(/Schools — photo in class/i);
  });

  it('bake guides hub: lang/title/canonical/og differ from FR source', () => {
    const baked = bakeLocaleGuidesHubHtml(guidesIndex, 'en');
    expect(baked).toMatch(/<html\s+lang="en"/i);
    expect(baked).toContain(
      'Photo quiz guides — learn then practice | Quiz PixFan'
    );
    expect(baked).toContain(
      'rel="canonical" href="https://quiz.pixfan.fr/en/guides/"'
    );
    expect(baked).toContain('property="og:locale" content="en_US"');
    expect(baked).toContain('property="og:url" content="https://quiz.pixfan.fr/en/guides/"');
    expect(baked).toContain('hreflang="fr" href="https://quiz.pixfan.fr/guides/"');
    expect(baked).toContain('hreflang="en" href="https://quiz.pixfan.fr/en/guides/"');
    expect(baked).not.toMatch(/rel="canonical" href="https:\/\/quiz\.pixfan\.fr\/guides\/"/);
    expect(baked).toContain('https://quiz.pixfan.fr/en/guides/scolaires/');

    const es = bakeLocaleGuidesHubHtml(guidesIndex, 'es');
    expect(es).toMatch(/<html\s+lang="es"/i);
    expect(es).toContain('Guías quiz foto — aprender luego practicar | Quiz PixFan');
    expect(es).toContain('rel="canonical" href="https://quiz.pixfan.fr/es/guides/"');

    const de = bakeLocaleGuidesHubHtml(guidesIndex, 'de');
    expect(de).toMatch(/<html\s+lang="de"/i);
    expect(de).toContain('Foto-Leitfäden — lernen, dann üben | Quiz PixFan');
    expect(de).toContain('rel="canonical" href="https://quiz.pixfan.fr/de/guides/"');
  });

  it('bake scolaires hub: lang/title/canonical baked', () => {
    const baked = bakeLocaleScolairesHubHtml(scolairesHub, 'en');
    expect(baked).toMatch(/<html\s+lang="en"/i);
    expect(baked).toContain('Schools — photo in class | Quiz PixFan');
    expect(baked).toContain(
      'rel="canonical" href="https://quiz.pixfan.fr/en/guides/scolaires/"'
    );
    expect(baked).toContain('Schools paths Quiz PixFan');
  });

  it('rewriteLangQueryHrefs maps ?lang= body CTAs to path locales', () => {
    const sample =
      '<a href="/guides/scolaires/?lang=en">x</a><a href="/?lang=en">y</a>';
    const out = rewriteLangQueryHrefs(sample, 'en');
    expect(out).toContain('href="/en/guides/scolaires/"');
    expect(out).toContain('href="/en/"');
    expect(out).not.toMatch(/\?lang=en/);
  });

  it('redirects use :slug for topics (not splat); hubs are real files', () => {
    const active = redirects
      .split('\n')
      .filter((l) => l.trim() && !l.trim().startsWith('#'))
      .join('\n');
    // Splat matched the hub itself on CF Pages (#152 live bug) — forbidden.
    expect(active).not.toMatch(/\/en\/guides\/\*\s+/);
    expect(active).toMatch(/\/en\/guides\/:slug\s+\/guides\/:slug\s+200/);
    expect(active).toMatch(
      /\/en\/guides\/scolaires\/fiche-seance\.html\s+\/guides\/scolaires\/fiche-seance\.html\s+200/
    );
    expect(active).not.toMatch(
      /\/en\/guides\/\s+\/guides\/index\.html\s+200/
    );
    expect(active).not.toMatch(/\?lang=/);
  });

  it('ops no-gos through 1.103+; catalogues unchanged', () => {
    expect(nextSteps).toMatch(/Web Push.*salon.*16/);
    expect(nextSteps).toMatch(/no-go.*1\.10[3-5]/);
  });
});
