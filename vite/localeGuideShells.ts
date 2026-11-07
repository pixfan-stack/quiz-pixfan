/**
 * Build-time guides hub (+ scolaires) locale shells (vague 1.103).
 * Copies dist/guides/{index,scolaires/index}.html →
 * dist/{en,es,de}/guides/... with baked lang/meta/canonical (not FR SPA rewrite).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';
import {
  bakeLocaleGuidesHubHtml,
  bakeLocaleScolairesHubHtml,
  type GuidePathLocale,
} from '../src/utils/localeGuideShellBake';

export {
  bakeLocaleGuidesHubHtml,
  bakeLocaleScolairesHubHtml,
} from '../src/utils/localeGuideShellBake';

function writeShell(outPath: string, html: string): void {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
}

export function writeLocaleGuideShells(outDir: string): GuidePathLocale[] {
  const guidesSrc = join(outDir, 'guides', 'index.html');
  const scolairesSrc = join(outDir, 'guides', 'scolaires', 'index.html');
  const guidesHtml = readFileSync(guidesSrc, 'utf8');
  const scolairesHtml = readFileSync(scolairesSrc, 'utf8');
  const written: GuidePathLocale[] = [];
  for (const lang of ['en', 'es', 'de'] as GuidePathLocale[]) {
    writeShell(
      join(outDir, lang, 'guides', 'index.html'),
      bakeLocaleGuidesHubHtml(guidesHtml, lang)
    );
    writeShell(
      join(outDir, lang, 'guides', 'scolaires', 'index.html'),
      bakeLocaleScolairesHubHtml(scolairesHtml, lang)
    );
    written.push(lang);
  }
  return written;
}

export function localeGuideShellsPlugin(): Plugin {
  return {
    name: 'locale-guide-shells',
    apply: 'build',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist');
      writeLocaleGuideShells(outDir);
    },
  };
}
