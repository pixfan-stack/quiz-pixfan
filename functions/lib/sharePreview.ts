/** Shared helpers for crawlable share pages + OG images. */

export const QUIZ_ID_RE =
  /^(?:[a-z0-9][a-z0-9-]{0,62}|daily-\d{4}-\d{2}-\d{2}|duel-[a-z0-9]{6,16}|random(?:-mix)?|weak-spots|photo-reading|mix-(?:easy|medium|hard))$/;

const LABELS: Record<string, { en: string; fr: string }> = {
  'exposure-basics': { en: 'Exposure basics', fr: 'Bases de l’exposition' },
  composition: { en: 'Composition', fr: 'Composition' },
  'light-color': { en: 'Light & color', fr: 'Lumière & couleur' },
  'gear-lenses': { en: 'Gear & lenses', fr: 'Matériel & objectifs' },
  'history-icons': { en: 'History & icons', fr: 'Histoire & icônes' },
  'public-domain': {
    en: 'Public domain gallery',
    fr: 'Galerie domaine public',
  },
  genres: { en: 'Photo genres', fr: 'Genres photo' },
  smartphone: { en: 'Smartphone', fr: 'Smartphone' },
  'photo-rights': { en: 'Photo rights', fr: 'Droits photo' },
  retouching: { en: 'Retouching', fr: 'Retouche' },
  random: { en: 'Random mix', fr: 'Mix aléatoire' },
  'random-mix': { en: 'Random mix', fr: 'Mix aléatoire' },
  'weak-spots': { en: 'Weak spots', fr: 'Points faibles' },
  'photo-reading': { en: 'Read the photo', fr: 'Lis cette photo' },
  'mix-easy': { en: 'Easy mix', fr: 'Mix facile' },
  'mix-medium': { en: 'Medium mix', fr: 'Mix intermédiaire' },
  'mix-hard': { en: 'Hard mix', fr: 'Mix difficile' },
};

export function normalizeQuizId(raw: string): string | null {
  const id = decodeURIComponent(raw).trim();
  if (!QUIZ_ID_RE.test(id)) return null;
  return id;
}

export function parseScore(raw: string | null): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return Math.round(Math.min(100, Math.max(0, n)));
}

export function parseLang(raw: string | null): 'en' | 'fr' {
  return raw?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function quizLabel(quizId: string, lang: 'en' | 'fr'): string {
  if (quizId.startsWith('daily-')) {
    return lang === 'fr' ? 'Défi du jour' : 'Daily challenge';
  }
  if (quizId.startsWith('duel-')) {
    return lang === 'fr' ? 'Duel entre amis' : 'Friend duel';
  }
  return LABELS[quizId]?.[lang] ?? quizId;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 1200×630 SVG Open Graph card. */
export function buildOgSvg(opts: {
  quizId: string;
  score: number | null;
  lang: 'en' | 'fr';
}): string {
  const { score, lang } = opts;
  const title = escapeXml(quizLabel(opts.quizId, lang));
  const brand = 'Quiz PixFan';
  const hook =
    score != null
      ? lang === 'fr'
        ? 'Bats mon score →'
        : 'Beat my score →'
      : lang === 'fr'
        ? 'Teste tes connaissances photo'
        : 'Test your photography knowledge';
  const font = 'font-family="system-ui,-apple-system,sans-serif"';
  const scoreBlock =
    score != null
      ? `<text x="600" y="340" text-anchor="middle" ${font} font-size="120" font-weight="800" fill="#ffffff">${score}%</text>`
      : `<text x="600" y="340" text-anchor="middle" ${font} font-size="64" font-weight="700" fill="#ffffff">${title}</text>`;
  const subtitle =
    score != null
      ? `<text x="600" y="420" text-anchor="middle" ${font} font-size="36" font-weight="600" fill="rgba(255,255,255,0.85)">${title}</text>`
      : `<text x="600" y="420" text-anchor="middle" ${font} font-size="32" font-weight="500" fill="rgba(255,255,255,0.85)">${escapeXml(hook)}</text>`;

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
  <text x="600" y="120" text-anchor="middle" ${font} font-size="34" font-weight="700" fill="#f3538c">${brand}</text>
  ${scoreBlock}
  ${subtitle}
  <text x="600" y="520" text-anchor="middle" ${font} font-size="32" font-weight="700" fill="#ffffff">${escapeXml(hook)}</text>
  <text x="600" y="580" text-anchor="middle" ${font} font-size="26" font-weight="600" fill="rgba(255,255,255,0.7)">quiz.pixfan.fr</text>
</svg>`;
}

export function buildShareHtml(opts: {
  quizId: string;
  score: number | null;
  lang: 'en' | 'fr';
  pageUrl: string;
  ogImageUrl: string;
  appOrigin: string;
}): string {
  const label = quizLabel(opts.quizId, opts.lang);
  const title =
    opts.score != null
      ? opts.lang === 'fr'
        ? `${opts.score} % — ${label} · Quiz PixFan`
        : `${opts.score}% — ${label} · Quiz PixFan`
      : opts.lang === 'fr'
        ? `${label} · Quiz PixFan`
        : `${label} · Quiz PixFan`;
  const description =
    opts.score != null
      ? opts.lang === 'fr'
        ? `J’ai fait ${opts.score} % sur « ${label} ». Tu peux faire mieux ?`
        : `I scored ${opts.score}% on “${label}”. Can you beat me?`
      : opts.lang === 'fr'
        ? `Rejoins le quiz « ${label} » sur Quiz PixFan.`
        : `Join the “${label}” quiz on Quiz PixFan.`;

  const scoreQuery =
    opts.score != null ? `?score=${encodeURIComponent(String(opts.score))}` : '';
  const deepLink = `${opts.appOrigin}/#/quiz/${encodeURIComponent(opts.quizId)}${scoreQuery}`;
  const safeTitle = escapeXml(title);
  const safeDesc = escapeXml(description);

  return `<!doctype html>
<html lang="${opts.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Quiz PixFan" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:url" content="${escapeXml(opts.pageUrl)}" />
  <meta property="og:image" content="${escapeXml(opts.ogImageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${escapeXml(opts.ogImageUrl)}" />
  <meta http-equiv="refresh" content="0;url=${escapeXml(deepLink)}" />
  <link rel="canonical" href="${escapeXml(opts.pageUrl)}" />
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#1a1a2e;color:#fff;text-align:center;padding:2rem}
    a{color:#f3538c;font-weight:700}
    p{opacity:.85}
  </style>
</head>
<body>
  <main>
    <h1>${safeTitle}</h1>
    <p>${safeDesc}</p>
    <p><a href="${escapeXml(deepLink)}">${opts.lang === 'fr' ? 'Ouvrir le quiz' : 'Open the quiz'}</a></p>
  </main>
  <script>location.replace(${JSON.stringify(deepLink)});</script>
</body>
</html>`;
}
