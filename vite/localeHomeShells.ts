/**
 * Build-time home locale shells (vague 1.99).
 * Copies dist/index.html → dist/{en,es,de}/index.html with baked lang/meta/noscript.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

export type HomePathLocale = 'en' | 'es' | 'de';

const META: Record<
  HomePathLocale,
  {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogLocale: string;
    twitterTitle: string;
    twitterDescription: string;
    noscriptH1: string;
    noscriptLead: string;
    guidesLabel: string;
    schoolsLabel: string;
    dailyLabel: string;
    photoReadingLabel: string;
  }
> = {
  en: {
    title: 'Free photography quiz — 386 questions FR/EN/ES/DE | Quiz PixFan',
    description:
      'Test your photography knowledge for free: 386 questions including 268 illustrated, 15 categories, photo-reading mode, daily challenge, light account and seasons. UI FR/EN/ES/DE — full catalogs.',
    ogTitle: 'Free photography quiz — 386 questions | Quiz PixFan',
    ogDescription:
      '386 photography questions (268 illustrated), photo-reading, daily challenge, light account. Free, FR/EN/ES/DE. Share your score!',
    ogLocale: 'en_US',
    twitterTitle: 'Free photography quiz — 386 questions | Quiz PixFan',
    twitterDescription:
      '386 photography questions (268 illustrated), photo-reading, daily challenge. Free, FR/EN/ES/DE.',
    noscriptH1: 'Quiz PixFan — free photography quiz',
    noscriptLead:
      '386 photography questions (268 illustrated), 15 categories, photo-reading, daily challenge. UI and catalogs FR / EN / ES / DE.',
    guidesLabel: 'Photo guides',
    schoolsLabel: 'School paths',
    dailyLabel: 'Daily challenge',
    photoReadingLabel: 'Photo-reading',
  },
  es: {
    title: 'Quiz de fotografía gratis — 386 preguntas | Quiz PixFan',
    description:
      'Pon a prueba tus conocimientos de fotografía gratis: 386 preguntas (268 ilustradas), 15 categorías, modo photo-reading, reto del día, cuenta ligera y temporadas. Interfaz ES/FR/EN/DE.',
    ogTitle: 'Quiz de fotografía gratis — 386 preguntas | Quiz PixFan',
    ogDescription:
      '386 preguntas de fotografía (268 ilustradas), photo-reading, reto del día, cuenta ligera. Gratis. ¡Comparte tu puntuación!',
    ogLocale: 'es_ES',
    twitterTitle: 'Quiz de fotografía gratis — 386 preguntas | Quiz PixFan',
    twitterDescription:
      '386 preguntas de fotografía (268 ilustradas), photo-reading, reto del día. Gratis.',
    noscriptH1: 'Quiz PixFan — quiz de fotografía gratis',
    noscriptLead:
      '386 preguntas de fotografía (268 ilustradas), 15 categorías, photo-reading, reto del día. Interfaz y catálogos FR / EN / ES / DE.',
    guidesLabel: 'Guías de foto',
    schoolsLabel: 'Recorridos escolares',
    dailyLabel: 'Reto del día',
    photoReadingLabel: 'Photo-reading',
  },
  de: {
    title: 'Kostenloses Fotografie-Quiz — 386 Fragen | Quiz PixFan',
    description:
      'Teste dein Fotografie-Wissen kostenlos: 386 Fragen (268 illustriert), 15 Kategorien, Photo-Reading-Modus, Tageschallenge, leichtes Konto und Saisons. Oberfläche DE/FR/EN/ES.',
    ogTitle: 'Kostenloses Fotografie-Quiz — 386 Fragen | Quiz PixFan',
    ogDescription:
      '386 Fotografie-Fragen (268 illustriert), Photo-Reading, Tageschallenge, leichtes Konto. Kostenlos. Teile deinen Score!',
    ogLocale: 'de_DE',
    twitterTitle: 'Kostenloses Fotografie-Quiz — 386 Fragen | Quiz PixFan',
    twitterDescription:
      '386 Fotografie-Fragen (268 illustriert), Photo-Reading, Tageschallenge. Kostenlos.',
    noscriptH1: 'Quiz PixFan — kostenloses Fotografie-Quiz',
    noscriptLead:
      '386 Fotografie-Fragen (268 illustriert), 15 Kategorien, Photo-Reading, Tageschallenge. Oberfläche und Kataloge FR / EN / ES / DE.',
    guidesLabel: 'Foto-Leitfäden',
    schoolsLabel: 'Schulpfade',
    dailyLabel: 'Tageschallenge',
    photoReadingLabel: 'Photo-Reading',
  },
};

function replaceAttr(html: string, attr: string, name: string, value: string): string {
  const re = new RegExp(
    `(<meta[^>]*${attr}=["']${name}["'][^>]*content=["'])([^"']*)(["'])`,
    'i'
  );
  if (re.test(html)) return html.replace(re, `$1${value}$3`);
  const re2 = new RegExp(
    `(<meta[^>]*content=["'])([^"']*)(["'][^>]*${attr}=["']${name}["'])`,
    'i'
  );
  return html.replace(re2, `$1${value}$3`);
}

/** Pure transform used by the Vite plugin and unit tests. */
export function bakeLocaleHomeHtml(
  sourceHtml: string,
  lang: HomePathLocale
): string {
  const m = META[lang];
  const origin = 'https://quiz.pixfan.fr';
  const pathUrl = `${origin}/${lang}/`;

  let html = sourceHtml;
  html = html.replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`);
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${m.title}</title>`);
  html = replaceAttr(html, 'name', 'description', m.description);
  html = replaceAttr(html, 'property', 'og:title', m.ogTitle);
  html = replaceAttr(html, 'property', 'og:description', m.ogDescription);
  html = replaceAttr(html, 'property', 'og:locale', m.ogLocale);
  html = replaceAttr(html, 'property', 'og:url', pathUrl);
  html = replaceAttr(html, 'name', 'twitter:title', m.twitterTitle);
  html = replaceAttr(html, 'name', 'twitter:description', m.twitterDescription);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i,
    `<link rel="canonical" href="${pathUrl}" />`
  );

  // Noscript block — keep structure, swap copy + locale-aware links
  html = html.replace(
    /<noscript>[\s\S]*?<\/noscript>/i,
    `<noscript>
      <main id="seo-crawl">
        <h1>${m.noscriptH1}</h1>
        <p>
          ${m.noscriptLead}
        </p>
        <p>
          <a href="/${lang}/guides/">${m.guidesLabel}</a>
          ·
          <a href="/${lang}/guides/scolaires/">${m.schoolsLabel}</a>
          ·
          <a href="/s/daily">${m.dailyLabel}</a>
          ·
          <a href="/s/photo-reading">${m.photoReadingLabel}</a>
        </p>
        <p>
          <a href="/">Français</a>
          ·
          <a href="/en/">English</a>
          ·
          <a href="/es/">Español</a>
          ·
          <a href="/de/">Deutsch</a>
        </p>
      </main>
    </noscript>`
  );

  return html;
}

export function writeLocaleHomeShells(outDir: string): HomePathLocale[] {
  const sourcePath = join(outDir, 'index.html');
  const source = readFileSync(sourcePath, 'utf8');
  const written: HomePathLocale[] = [];
  for (const lang of ['en', 'es', 'de'] as HomePathLocale[]) {
    const dir = join(outDir, lang);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), bakeLocaleHomeHtml(source, lang), 'utf8');
    written.push(lang);
  }
  return written;
}

export function localeHomeShellsPlugin(): Plugin {
  return {
    name: 'locale-home-shells',
    apply: 'build',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist');
      writeLocaleHomeShells(outDir);
    },
  };
}
