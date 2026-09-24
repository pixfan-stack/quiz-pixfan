/**
 * Contextual Pixfan CTAs shown after a quiz.
 * Prefers a local guide for the failed theme, then newsletter.
 */

export type PixfanTopic =
  | 'exposure'
  | 'composition'
  | 'light'
  | 'gear'
  | 'history'
  | 'genres'
  | 'smartphone'
  | 'rights'
  | 'retouching'
  | 'default';

export type PixfanCtaTarget = 'guide' | 'newsletter' | 'pixfan';

export interface PixfanCta {
  topic: PixfanTopic;
  /** Primary deep link: local guide when available, else pixfan.com. */
  primaryUrl: string;
  /** What the primary button opens (for analytics + copy). */
  primaryTarget: PixfanCtaTarget;
  /**
   * Optional secondary deep link (e.g. pixfan.com retouch hub when primary
   * is already the local Lightroom guide).
   */
  secondaryUrl?: string;
  secondaryTarget?: PixfanCtaTarget;
  newsletterUrl: string;
  /** True when topic came from incorrect answers (failed theme). */
  fromMistakes: boolean;
}

const PIXFAN = 'https://www.pixfan.com';
const NEWSLETTER = `${PIXFAN}/newsletter/`;

/** Local HTML guides (P2-C / P3 cross-links) for themes we cover on-site. */
const LOCAL_GUIDES: Partial<Record<PixfanTopic, string>> = {
  exposure: '/guides/triangle-exposition',
  composition: '/guides/composition-photo',
  smartphone: '/guides/photo-smartphone',
  light: '/guides/lumiere-photo',
  retouching: '/guides/retouche-lightroom',
  genres: '/guides/genres-photo',
};

const TOPIC_URLS: Record<PixfanTopic, string> = {
  exposure: `${PIXFAN}/apprendre-la-photo/bases-et-reglages/`,
  composition: `${PIXFAN}/apprendre-la-photo/`,
  light: `${PIXFAN}/apprendre-la-photo/`,
  gear: `${PIXFAN}/materiel-photo/`,
  history: `${PIXFAN}/inspiration-culture/`,
  genres: `${PIXFAN}/apprendre-la-photo/genres-photo/`,
  smartphone: `${PIXFAN}/apprendre-la-photo/`,
  /** Stable editorial guide (search `?s=droit+auteur` was a weak funnel). */
  rights: `${PIXFAN}/maitriser-la-cession-de-droits-dauteur-en-photographie-guide-pratique/`,
  /** Live category hub (bare `/logiciels-retouche/` 404s → home). */
  retouching: `${PIXFAN}/category/logiciels-retouche/`,
  default: `${PIXFAN}/apprendre-la-photo-guide-complet-debutants-quiz/`,
};

function withUtm(url: string, quizId: string, content: PixfanCtaTarget): string {
  const u = url.startsWith('http')
    ? new URL(url)
    : new URL(url, 'https://quiz.pixfan.fr');
  u.searchParams.set('utm_source', 'quiz');
  u.searchParams.set('utm_medium', 'result_cta');
  u.searchParams.set('utm_campaign', quizId.slice(0, 64));
  u.searchParams.set('utm_content', content);
  if (url.startsWith('http')) return u.toString();
  return `${u.pathname}${u.search}`;
}

/** Map quiz / pack ids to a content topic. */
export function resolvePixfanTopic(quizId: string): PixfanTopic {
  if (quizId === 'exposure-basics' || quizId.startsWith('mix-easy')) {
    return 'exposure';
  }
  if (quizId === 'composition') return 'composition';
  if (quizId === 'light-color' || quizId === 'portrait-light') return 'light';
  if (quizId === 'gear-lenses') return 'gear';
  if (quizId === 'history-icons' || quizId === 'public-domain') return 'history';
  if (quizId === 'genres') return 'genres';
  if (quizId === 'smartphone') return 'smartphone';
  if (quizId === 'photo-rights') return 'rights';
  if (quizId === 'retouching' || quizId === 'lightroom-workflow') {
    return 'retouching';
  }
  if (quizId.startsWith('mix-hard')) return 'history';
  if (quizId.startsWith('mix-medium')) return 'gear';
  // daily / random / duel → beginner hub unless mistakes override
  return 'default';
}

function sourceQuizIdFromQuestionId(questionId: string): string | null {
  const idx = questionId.indexOf('__');
  return idx > 0 ? questionId.slice(0, idx) : null;
}

/** Local guide path for a topic, when one exists on-site. */
export function localGuidePathForTopic(topic: PixfanTopic): string | null {
  return LOCAL_GUIDES[topic] ?? null;
}

/**
 * Map editorial daily-week theme ids → Pixfan topic with a local guide.
 * Themes without a guide (gear / rights / history / mixed) return null.
 */
const DAILY_THEME_TO_TOPIC: Partial<
  Record<
    | 'lightroom'
    | 'smartphone'
    | 'light'
    | 'composition'
    | 'gear'
    | 'genres'
    | 'rights'
    | 'history'
    | 'mixed',
    PixfanTopic
  >
> = {
  lightroom: 'retouching',
  smartphone: 'smartphone',
  light: 'light',
  composition: 'composition',
  genres: 'genres',
};

/** Local guide URL for the current editorial week, with daily_theme UTM. */
export function localGuideUrlForDailyTheme(
  themeId: string,
  quizId = 'daily'
): string | null {
  const topic = DAILY_THEME_TO_TOPIC[themeId as keyof typeof DAILY_THEME_TO_TOPIC];
  if (!topic) return null;
  const path = LOCAL_GUIDES[topic];
  if (!path) return null;
  const u = new URL(path, 'https://quiz.pixfan.fr');
  u.searchParams.set('utm_source', 'quiz');
  u.searchParams.set('utm_medium', 'daily_card');
  u.searchParams.set('utm_campaign', quizId.slice(0, 64));
  u.searchParams.set('utm_content', 'daily_theme');
  return `${u.pathname}${u.search}`;
}

/**
 * Resolve a local guide for a mistake question (compound id or category quiz).
 * Used by results / error review cross-links (P2-C).
 */
export function localGuideForMistake(
  questionId: string,
  fallbackQuizId?: string
): { topic: PixfanTopic; path: string } | null {
  const source =
    sourceQuizIdFromQuestionId(questionId) ?? fallbackQuizId ?? null;
  if (!source) return null;
  const topic = resolvePixfanTopic(source);
  const path = LOCAL_GUIDES[topic];
  if (!path) return null;
  return { topic, path };
}

/**
 * Pick the dominant failed theme from incorrect answers
 * (daily / mix / duel use `category__question` ids).
 */
export function resolveTopicFromMistakes(
  mistakeQuestionIds: string[]
): PixfanTopic | null {
  if (mistakeQuestionIds.length === 0) return null;

  const counts = new Map<PixfanTopic, number>();
  for (const qid of mistakeQuestionIds) {
    const source = sourceQuizIdFromQuestionId(qid) ?? qid;
    const topic = resolvePixfanTopic(source);
    if (topic === 'default') continue;
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }

  let best: PixfanTopic | null = null;
  let bestCount = 0;
  for (const [topic, count] of counts) {
    if (count > bestCount) {
      best = topic;
      bestCount = count;
    }
  }
  return best;
}

export interface GetPixfanCtaOptions {
  /** Question ids the player got wrong (for failed-theme targeting). */
  mistakeQuestionIds?: string[];
}

/** Build UTM-tagged CTA links for a finished quiz. */
export function getPixfanCta(
  quizId: string,
  options: GetPixfanCtaOptions = {}
): PixfanCta {
  const fromMistakesTopic = resolveTopicFromMistakes(
    options.mistakeQuestionIds ?? []
  );
  const topic = fromMistakesTopic ?? resolvePixfanTopic(quizId);
  const localGuide = LOCAL_GUIDES[topic];
  const primaryTarget: PixfanCtaTarget = localGuide ? 'guide' : 'pixfan';
  const primaryRaw = localGuide ?? TOPIC_URLS[topic];

  const newsletterUrl = withUtm(NEWSLETTER, quizId, 'newsletter');
  const cta: PixfanCta = {
    topic,
    primaryUrl: withUtm(primaryRaw, quizId, primaryTarget),
    primaryTarget,
    newsletterUrl,
    fromMistakes: fromMistakesTopic != null,
  };

  // When primary is a local guide, offer the matching Pixfan hub as secondary
  // (all guided topics — convert without waiting for more local guides).
  if (
    primaryTarget === 'guide' &&
    (topic === 'retouching' ||
      topic === 'genres' ||
      topic === 'exposure' ||
      topic === 'composition' ||
      topic === 'light' ||
      topic === 'smartphone')
  ) {
    cta.secondaryTarget = 'pixfan';
    cta.secondaryUrl = withUtm(TOPIC_URLS[topic], quizId, 'pixfan');
  }

  // Orphan topics (no local guide): primary = Pixfan hub, secondary = newsletter
  // so we don't leave the funnel with only a beginner default path.
  if (
    primaryTarget === 'pixfan' &&
    (topic === 'gear' || topic === 'history' || topic === 'rights')
  ) {
    cta.secondaryTarget = 'newsletter';
    cta.secondaryUrl = newsletterUrl;
  }

  return cta;
}

/** Analytics quiz_id marker stored in `quiz_attempts` for CTA clicks. */
export function ctaAnalyticsQuizId(
  target: PixfanCtaTarget,
  topic: PixfanTopic,
  sourceQuizId: string
): string {
  const src = sourceQuizId.slice(0, 48).replace(/[^a-zA-Z0-9._-]/g, '_');
  return `cta:${target}:${topic}:${src}`;
}

export function isCtaAnalyticsQuizId(quizId: string): boolean {
  return quizId.startsWith('cta:');
}

export interface ParsedCtaAnalyticsId {
  target: PixfanCtaTarget;
  topic: string;
  sourceQuizId: string;
}

const CTA_TARGETS = new Set<PixfanCtaTarget>(['guide', 'newsletter', 'pixfan']);

/**
 * Parse `cta:{target}:{topic}:{sourceQuizId}` for admin breakdowns.
 * Returns null when the id is not a CTA marker or is malformed.
 */
export function parseCtaAnalyticsQuizId(
  quizId: string
): ParsedCtaAnalyticsId | null {
  if (!quizId.startsWith('cta:')) return null;
  const parts = quizId.split(':');
  if (parts.length < 4) return null;
  const target = parts[1] as PixfanCtaTarget;
  const topic = parts[2];
  const sourceQuizId = parts.slice(3).join(':');
  if (!CTA_TARGETS.has(target) || !topic || !sourceQuizId) return null;
  return { target, topic, sourceQuizId };
}

export interface CtaClickRow {
  target: PixfanCtaTarget;
  topic: string;
  sourceQuizId: string;
  clicks: number;
}

export interface CtaAnalyticsBreakdown {
  byTarget: Array<{ target: PixfanCtaTarget; clicks: number }>;
  byTopic: Array<{ topic: string; clicks: number }>;
  rows: CtaClickRow[];
}

/** Aggregate raw `cta:…` quiz_id counts into target × topic breakdowns. */
export function buildCtaAnalyticsBreakdown(
  rawRows: Array<{ quizId: string; clicks: number }>
): CtaAnalyticsBreakdown {
  const byTargetMap = new Map<PixfanCtaTarget, number>();
  const byTopicMap = new Map<string, number>();
  const rows: CtaClickRow[] = [];

  for (const raw of rawRows) {
    const clicks = Number(raw.clicks) || 0;
    if (clicks <= 0) continue;
    const parsed = parseCtaAnalyticsQuizId(raw.quizId);
    if (!parsed) continue;
    rows.push({ ...parsed, clicks });
    byTargetMap.set(
      parsed.target,
      (byTargetMap.get(parsed.target) ?? 0) + clicks
    );
    byTopicMap.set(parsed.topic, (byTopicMap.get(parsed.topic) ?? 0) + clicks);
  }

  rows.sort((a, b) => b.clicks - a.clicks || a.topic.localeCompare(b.topic));

  const targetOrder: PixfanCtaTarget[] = ['guide', 'newsletter', 'pixfan'];
  const byTarget = targetOrder
    .filter((t) => (byTargetMap.get(t) ?? 0) > 0)
    .map((target) => ({ target, clicks: byTargetMap.get(target) ?? 0 }));

  const byTopic = [...byTopicMap.entries()]
    .map(([topic, clicks]) => ({ topic, clicks }))
    .sort((a, b) => b.clicks - a.clicks || a.topic.localeCompare(b.topic));

  return { byTarget, byTopic, rows };
}
