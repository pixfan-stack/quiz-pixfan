#!/usr/bin/env node
/**
 * Vague 1.17 P4.D — bake theme OG PNG cards via @resvg/resvg-js.
 * Output: public/og/themes/{slug}.png (+ optional {slug}-{score}.png)
 */
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/og/themes');

const THEMES = [
  ['exposure-basics', 'Exposure basics', 'Bases de l’exposition'],
  ['composition', 'Composition', 'Composition'],
  ['light-color', 'Light & color', 'Lumière & couleur'],
  ['gear-lenses', 'Gear & lenses', 'Matériel & objectifs'],
  ['history-icons', 'History & icons', 'Histoire & icônes'],
  ['public-domain', 'Public domain gallery', 'Galerie domaine public'],
  ['genres', 'Photo genres', 'Genres photo'],
  ['smartphone', 'Smartphone', 'Smartphone'],
  ['photo-rights', 'Photo rights', 'Droits photo'],
  ['retouching', 'Retouching', 'Retouche'],
  ['lightroom-workflow', 'Lightroom workflow', 'Workflow Lightroom'],
  ['portrait-light', 'Portrait & light', 'Portrait & lumière'],
  ['daily', 'Daily challenge', 'Défi du jour'],
  ['duel', 'Friend duel', 'Duel entre amis'],
  ['random', 'Random mix', 'Mix aléatoire'],
  ['weak-spots', 'Weak spots', 'Points faibles'],
  ['photo-reading', 'Photos to analyze', 'Photos à analyser'],
  ['mix-easy', 'Easy mix', 'Mix facile'],
  ['mix-medium', 'Medium mix', 'Mix intermédiaire'],
  ['mix-hard', 'Hard mix', 'Mix difficile'],
  ['default', 'Quiz PixFan', 'Quiz PixFan'],
];

const SCORES = [null, 70, 80, 90, 100];

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSvg(titleFr, titleEn, score) {
  const font = 'font-family="system-ui,-apple-system,sans-serif"';
  const hook =
    score != null ? 'Bats mon score →' : 'Teste tes connaissances photo';
  const scoreBlock =
    score != null
      ? `<text x="600" y="300" text-anchor="middle" ${font} font-size="120" font-weight="800" fill="#ffffff">${score}%</text>
  <text x="600" y="370" text-anchor="middle" ${font} font-size="36" font-weight="600" fill="rgba(255,255,255,0.9)">${esc(titleFr)}</text>`
      : `<text x="600" y="320" text-anchor="middle" ${font} font-size="58" font-weight="800" fill="#ffffff">${esc(titleFr)}</text>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="55%" stop-color="#3a1528"/>
      <stop offset="100%" stop-color="#f3538c"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="rgba(243,83,140,0.45)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <text x="600" y="110" text-anchor="middle" ${font} font-size="34" font-weight="800" fill="#f3538c">Quiz PixFan</text>
  ${scoreBlock}
  <text x="600" y="430" text-anchor="middle" ${font} font-size="26" font-weight="600" fill="rgba(255,255,255,0.7)">${esc(titleEn)}</text>
  <text x="600" y="520" text-anchor="middle" ${font} font-size="32" font-weight="700" fill="#ffffff">${esc(hook)}</text>
  <text x="600" y="580" text-anchor="middle" ${font} font-size="26" font-weight="600" fill="rgba(255,255,255,0.7)">quiz.pixfan.fr</text>
</svg>`;
}

mkdirSync(OUT, { recursive: true });
const files = [];
for (const [slug, en, fr] of THEMES) {
  for (const score of SCORES) {
    const name = score == null ? `${slug}.png` : `${slug}-${score}.png`;
    const svg = buildSvg(fr, en, score);
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const png = resvg.render().asPng();
    writeFileSync(join(OUT, name), png);
    files.push(name);
    process.stdout.write(`wrote ${name} (${png.length} bytes)\n`);
  }
}
writeFileSync(
  join(OUT, 'manifest.json'),
  JSON.stringify(
    {
      version: 1,
      themes: THEMES.map((t) => t[0]),
      scores: SCORES.filter((s) => s != null),
      files,
    },
    null,
    2
  ) + '\n'
);
console.log(`done: ${files.length} cards → ${OUT}`);
