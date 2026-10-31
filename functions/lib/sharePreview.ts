/** Shared helpers for crawlable share pages + OG images. */

export const QUIZ_ID_RE =
  /^(?:[a-z0-9][a-z0-9-]{0,62}|daily-\d{4}-\d{2}-\d{2}|duel-[a-z0-9]{6,16}|random(?:-mix)?|weak-spots|photo-reading|mix-(?:easy|medium|hard))$/;

const LABELS: Record<string, { en: string; fr: string; es: string; de: string }> = {
  'exposure-basics': {
    en: 'Exposure basics',
    fr: 'Bases de l’exposition',
    es: 'Bases de exposición',
    de: 'Belichtungsgrundlagen',
  },
  composition: {
    en: 'Composition',
    fr: 'Composition',
    es: 'Composición',
    de: 'Komposition',
  },
  'light-color': {
    en: 'Light & color',
    fr: 'Lumière & couleur',
    es: 'Luz y color',
    de: 'Licht & Farbe',
  },
  'gear-lenses': {
    en: 'Gear & lenses',
    fr: 'Matériel & objectifs',
    es: 'Material y objetivos',
    de: 'Ausrüstung & Objektive',
  },
  'history-icons': {
    en: 'History & icons',
    fr: 'Histoire & icônes',
    es: 'Historia e iconos',
    de: 'Geschichte & Ikonen',
  },
  'public-domain': {
    en: 'Public domain gallery',
    fr: 'Galerie domaine public',
    es: 'Galería de dominio público',
    de: 'Gemeinfreie Galerie',
  },
  genres: {
    en: 'Photo genres',
    fr: 'Genres photo',
    es: 'Géneros fotográficos',
    de: 'Fotogenres',
  },
  smartphone: {
    en: 'Smartphone',
    fr: 'Smartphone',
    es: 'Smartphone',
    de: 'Smartphone',
  },
  'photo-rights': {
    en: 'Photo rights',
    fr: 'Droits photo',
    es: 'Derechos foto',
    de: 'Fotorechte',
  },
  retouching: {
    en: 'Retouching',
    fr: 'Retouche',
    es: 'Retoque',
    de: 'Retusche',
  },
  'lightroom-workflow': {
    en: 'Lightroom workflow',
    fr: 'Workflow Lightroom',
    es: 'Workflow Lightroom',
    de: 'Lightroom-Workflow',
  },
  'portrait-light': {
    en: 'Portrait & light',
    fr: 'Portrait & lumière',
    es: 'Retrato y luz',
    de: 'Porträt & Licht',
  },
  'marques-photo': {
    en: 'Brand history',
    fr: 'Histoire des marques',
    es: 'Historia de marcas',
    de: 'Markengeschichte',
  },
  'flash-studio': {
    en: 'Flash & studio',
    fr: 'Flash & studio',
    es: 'Flash y estudio',
    de: 'Blitz & Studio',
  },
  'lexique-image-fixe': {
    en: 'Still-image lexicon',
    fr: 'Lexique image fixe',
    es: 'Léxico de imagen fija',
    de: 'Standbild-Lexikon',
  },
  random: {
    en: 'Random mix',
    fr: 'Mix aléatoire',
    es: 'Mix aleatorio',
    de: 'Zufallsmix',
  },
  'random-mix': {
    en: 'Random mix',
    fr: 'Mix aléatoire',
    es: 'Mix aleatorio',
    de: 'Zufallsmix',
  },
  'weak-spots': {
    en: 'Weak spots',
    fr: 'Points faibles',
    es: 'Puntos débiles',
    de: 'Schwachstellen',
  },
  'photo-reading': {
    en: 'Photos to analyze',
    fr: 'Photos à analyser',
    es: 'Fotos para analizar',
    de: 'Fotos zum Analysieren',
  },
  'mix-easy': {
    en: 'Easy mix',
    fr: 'Mix facile',
    es: 'Mix fácil',
    de: 'Einfacher Mix',
  },
  'mix-medium': {
    en: 'Medium mix',
    fr: 'Mix intermédiaire',
    es: 'Mix intermedio',
    de: 'Mittlerer Mix',
  },
  'mix-hard': {
    en: 'Hard mix',
    fr: 'Mix difficile',
    es: 'Mix difícil',
    de: 'Schwerer Mix',
  },
};

/**
 * Editorial week chips — order must match `DAILY_THEME_ROTATION`
 * in `src/utils/dailyChallenge.ts` (ISO week % length).
 */
export const DAILY_THEME_CHIPS: readonly {
  en: string;
  fr: string;
  es: string;
  de: string;
}[] = [
  {
    en: 'Lightroom week',
    fr: 'Semaine Lightroom',
    es: 'Semana Lightroom',
    de: 'Lightroom-Woche',
  },
  {
    en: 'Smartphone week',
    fr: 'Semaine smartphone',
    es: 'Semana smartphone',
    de: 'Smartphone-Woche',
  },
  {
    en: 'Light week',
    fr: 'Semaine lumière',
    es: 'Semana luz',
    de: 'Licht-Woche',
  },
  {
    en: 'Composition week',
    fr: 'Semaine composition',
    es: 'Semana composición',
    de: 'Kompositions-Woche',
  },
  {
    en: 'Gear week',
    fr: 'Semaine matériel',
    es: 'Semana material',
    de: 'Ausrüstungs-Woche',
  },
  {
    en: 'Genres week',
    fr: 'Semaine genres',
    es: 'Semana géneros',
    de: 'Genres-Woche',
  },
  {
    en: 'Rights week',
    fr: 'Semaine droits',
    es: 'Semana derechos',
    de: 'Rechte-Woche',
  },
  {
    en: 'History week',
    fr: 'Semaine histoire',
    es: 'Semana historia',
    de: 'Geschichte-Woche',
  },
  {
    en: 'Mixed week',
    fr: 'Semaine mixte',
    es: 'Semana mixta',
    de: 'Mix-Woche',
  },
];

/** ISO week number (UTC), 1–53 — mirrored from dailyChallenge for CF functions. */
export function getUtcIsoWeek(date: Date): number {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** UI langs accepted on share / OG URLs (vague 1.40). */
export type ShareLang = 'en' | 'fr' | 'es' | 'de';

/** Locales with dedicated share/OG label strings (vague 1.69). */
export type ContentLang = 'en' | 'fr' | 'es' | 'de';

export function toContentLang(lang: ShareLang | string): ContentLang {
  const s = String(lang).toLowerCase();
  if (s === 'fr' || s.startsWith('fr')) return 'fr';
  if (s === 'es' || s.startsWith('es')) return 'es';
  if (s === 'de' || s.startsWith('de')) return 'de';
  return 'en';
}

export function dailyThemeChipForDate(
  date: Date,
  lang: ShareLang | ContentLang
): string {
  const week = getUtcIsoWeek(date);
  const idx = (week - 1) % DAILY_THEME_CHIPS.length;
  return DAILY_THEME_CHIPS[idx]![toContentLang(lang)];
}

export function parseDailyQuizDate(quizId: string): Date | null {
  const m = /^daily-(\d{4})-(\d{2})-(\d{2})$/.exec(quizId);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return new Date(Date.UTC(y, mo - 1, d));
}

/** Stable alias `daily` → UTC calendar id `daily-YYYY-MM-DD`. */
export function todaysDailyQuizId(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `daily-${y}-${m}-${d}`;
}

export function normalizeQuizId(raw: string): string | null {
  const id = decodeURIComponent(raw).trim();
  if (id === 'daily') return todaysDailyQuizId();
  if (!QUIZ_ID_RE.test(id)) return null;
  return id;
}

export function parseScore(raw: string | null): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return Math.round(Math.min(100, Math.max(0, n)));
}

export function parseLang(raw: string | null): ShareLang {
  const s = (raw ?? '').toLowerCase();
  if (s.startsWith('fr')) return 'fr';
  if (s.startsWith('es')) return 'es';
  if (s.startsWith('de')) return 'de';
  return 'en';
}

const DAILY_PREFIX: Record<ContentLang, string> = {
  fr: 'Défi du jour',
  en: 'Daily challenge',
  es: 'Reto del día',
  de: 'Tageschallenge',
};

const DUEL_LABEL: Record<ContentLang, string> = {
  fr: 'Duel entre amis',
  en: 'Friend duel',
  es: 'Duelo entre amigos',
  de: 'Freundschaftsduell',
};

export function quizLabel(quizId: string, lang: ShareLang | ContentLang): string {
  const content = toContentLang(lang);
  if (quizId.startsWith('daily-')) {
    const date = parseDailyQuizDate(quizId);
    if (date) {
      const chip = dailyThemeChipForDate(date, content);
      return `${DAILY_PREFIX[content]} · ${chip}`;
    }
    return DAILY_PREFIX[content];
  }
  if (quizId.startsWith('duel-')) {
    return DUEL_LABEL[content];
  }
  return LABELS[quizId]?.[content] ?? quizId;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Absolute PNG URL for Open Graph / Twitter cards.
 * Major social crawlers reject SVG (`/api/og`) as og:image.
 * Default brand card (home / guides); share pages prefer theme cards.
 */
export const OG_IMAGE_PATH = '/og-image.png?v=4';
export const OG_THEME_VERSION = 'v1';

/** Score tiers pre-baked under `public/og/themes/{slug}-{score}.png`. */
export const OG_SCORE_TIERS = [70, 80, 90, 100] as const;

/**
 * Map a quiz id to a stable theme slug for pre-baked OG PNGs.
 * Daily / duel / mixes collapse to shared cards.
 */
export function ogThemeSlug(quizId: string): string {
  if (quizId.startsWith('daily-')) return 'daily';
  if (quizId.startsWith('duel-')) return 'duel';
  if (quizId === 'random-mix') return 'random';
  if (LABELS[quizId]) return quizId;
  return 'default';
}

/** Nearest pre-baked score tier, or null when score absent. */
export function ogScoreTier(score: number | null): number | null {
  if (score == null || !Number.isFinite(score)) return null;
  let best: number = OG_SCORE_TIERS[0]!;
  let bestDist = Math.abs(score - best);
  for (const tier of OG_SCORE_TIERS) {
    const d = Math.abs(score - tier);
    if (d < bestDist) {
      best = tier;
      bestDist = d;
    }
  }
  return best;
}

export function staticOgImageUrl(origin: string): string {
  return `${origin.replace(/\/$/, '')}${OG_IMAGE_PATH}`;
}

/**
 * Theme (and optional score-tier) PNG under `/og/themes/`.
 * Falls back to the brand card only when slug is somehow empty.
 */
export function themeOgImageUrl(
  origin: string,
  quizId: string,
  score: number | null = null
): string {
  const base = origin.replace(/\/$/, '');
  const slug = ogThemeSlug(quizId);
  const tier = ogScoreTier(score);
  const file = tier != null ? `${slug}-${tier}.png` : `${slug}.png`;
  return `${base}/og/themes/${file}?${OG_THEME_VERSION}`;
}

/** 1200×630 SVG Open Graph card. */
export function buildOgSvg(opts: {
  quizId: string;
  score: number | null;
  lang: ShareLang | ContentLang;
}): string {
  const { score } = opts;
  const content = toContentLang(opts.lang);
  const title = escapeXml(quizLabel(opts.quizId, content));
  const brand = 'Quiz PixFan';
  const beatScore: Record<ContentLang, string> = {
    fr: 'Bats mon score →',
    en: 'Beat my score →',
    es: 'Supera mi puntuación →',
    de: 'Schlage meinen Score →',
  };
  const tryKnowledge: Record<ContentLang, string> = {
    fr: 'Teste tes connaissances photo',
    en: 'Test your photography knowledge',
    es: 'Pon a prueba tus conocimientos de foto',
    de: 'Teste dein Fotografie-Wissen',
  };
  const hook = score != null ? beatScore[content] : tryKnowledge[content];
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

function deepLinkQuery(score: number | null, classe?: boolean): string {
  const params = new URLSearchParams();
  if (score != null) params.set('score', String(score));
  if (classe) params.set('classe', '1');
  const q = params.toString();
  return q ? `?${q}` : '';
}

export function buildShareHtml(opts: {
  quizId: string;
  score: number | null;
  lang: ShareLang | ContentLang;
  pageUrl: string;
  ogImageUrl: string;
  appOrigin: string;
  /** School session — forwarded into the hash deep link. */
  classe?: boolean;
}): string {
  const content = toContentLang(opts.lang);
  const label = quizLabel(opts.quizId, content);
  const scoredTitle: Record<ContentLang, string> = {
    fr: `${opts.score} % — ${label} · Quiz PixFan`,
    en: `${opts.score}% — ${label} · Quiz PixFan`,
    es: `${opts.score}% — ${label} · Quiz PixFan`,
    de: `${opts.score}% — ${label} · Quiz PixFan`,
  };
  const title =
    opts.score != null ? scoredTitle[content] : `${label} · Quiz PixFan`;
  const scoredDesc: Record<ContentLang, string> = {
    fr: `J’ai fait ${opts.score} % sur « ${label} ». Tu peux faire mieux ?`,
    en: `I scored ${opts.score}% on “${label}”. Can you beat me?`,
    es: `Saqué un ${opts.score}% en « ${label} ». ¿Puedes superarme?`,
    de: `Ich habe ${opts.score}% bei „${label}“ geschafft. Kannst du das toppen?`,
  };
  const plainDesc: Record<ContentLang, string> = {
    fr: `Rejoins le quiz « ${label} » sur Quiz PixFan.`,
    en: `Join the “${label}” quiz on Quiz PixFan.`,
    es: `Únete al quiz « ${label} » en Quiz PixFan.`,
    de: `Mach beim Quiz „${label}“ auf Quiz PixFan mit.`,
  };
  const description =
    opts.score != null ? scoredDesc[content] : plainDesc[content];

  const deepLink = `${opts.appOrigin}/#/quiz/${encodeURIComponent(opts.quizId)}${deepLinkQuery(opts.score, opts.classe)}`;
  const safeTitle = escapeXml(title);
  const safeDesc = escapeXml(description);
  const isDuel = opts.quizId.startsWith('duel-');
  const ctaOpen: Record<ContentLang, string> = {
    fr: 'Ouvrir le quiz',
    en: 'Open the quiz',
    es: 'Abrir el quiz',
    de: 'Quiz öffnen',
  };
  const ctaDuel: Record<ContentLang, string> = {
    fr: 'Relever le duel',
    en: 'Accept the duel',
    es: 'Aceptar el duelo',
    de: 'Duell annehmen',
  };
  const cta = isDuel ? ctaDuel[content] : ctaOpen[content];
  const mobileHintByLang: Record<ContentLang, string> = {
    fr: 'Si le quiz ne s’ouvre pas, touchez le bouton ci-dessous.',
    en: 'If the quiz does not open, tap the button below.',
    es: 'Si el quiz no se abre, toca el botón de abajo.',
    de: 'Wenn sich das Quiz nicht öffnet, tippe auf den Button unten.',
  };
  const mobileHint = mobileHintByLang[content];

  return `<!doctype html>
<html lang="${opts.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDesc}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Quiz PixFan" />
  <meta property="fb:app_id" content="1845182679783128" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:url" content="${escapeXml(opts.pageUrl)}" />
  <meta property="og:image" content="${escapeXml(opts.ogImageUrl)}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
  <meta name="twitter:image" content="${escapeXml(opts.ogImageUrl)}" />
  <meta http-equiv="refresh" content="1;url=${escapeXml(deepLink)}" />
  <link rel="canonical" href="${escapeXml(opts.pageUrl)}" />
  <style>
    body{font-family:system-ui,-apple-system,sans-serif;margin:0;min-height:100vh;display:grid;place-items:center;background:#1a1a2e;color:#fff;text-align:center;padding:2rem}
    main{max-width:28rem}
    h1{font-size:1.35rem;line-height:1.3;margin:0 0 0.75rem}
    p{opacity:.85;margin:0.5rem 0}
    .cta{display:inline-block;margin-top:1.25rem;padding:0.9rem 1.4rem;border-radius:999px;background:#f3538c;color:#fff;font-weight:700;text-decoration:none;font-size:1.05rem;min-width:12rem}
    .hint{font-size:0.85rem;opacity:.7;margin-top:1rem}
  </style>
</head>
<body>
  <main>
    <h1>${safeTitle}</h1>
    <p>${safeDesc}</p>
    <p><a class="cta" href="${escapeXml(deepLink)}">${escapeXml(cta)}</a></p>
    <p class="hint">${escapeXml(mobileHint)}</p>
  </main>
  <script>location.replace(${JSON.stringify(deepLink)});</script>
</body>
</html>`;
}
