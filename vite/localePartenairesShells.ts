/**
 * Build-time partenaires path-locale shells (vague 1.104 / QP-291).
 * Writes dist/{en,es,de}/partenaires/index.html so CF Pages serves BreadcrumbList
 * instead of SPA catch-all homepage FAQ JSON-LD.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';
import {
  bakeLocalePartenairesHtml,
  type PartenairesPathLocale,
} from '../src/utils/localePartenairesShellBake';

export { bakeLocalePartenairesHtml } from '../src/utils/localePartenairesShellBake';

function writeShell(outPath: string, html: string): void {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html, 'utf8');
}

export function writeLocalePartenairesShells(
  outDir: string
): PartenairesPathLocale[] {
  const src = join(outDir, 'partenaires', 'index.html');
  const source = readFileSync(src, 'utf8');
  const written: PartenairesPathLocale[] = [];
  for (const lang of ['en', 'es', 'de'] as PartenairesPathLocale[]) {
    writeShell(
      join(outDir, lang, 'partenaires', 'index.html'),
      bakeLocalePartenairesHtml(source, lang)
    );
    written.push(lang);
  }
  return written;
}

export function localePartenairesShellsPlugin(): Plugin {
  return {
    name: 'locale-partenaires-shells',
    apply: 'build',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist');
      writeLocalePartenairesShells(outDir);
    },
  };
}
