/**
 * Contextual pixfan.com CTAs shown after a quiz.
 * URLs validated against live category/search pages.
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

export interface PixfanCta {
  topic: PixfanTopic;
  /** Main deep link into pixfan.com content. */
  primaryUrl: string;
  /** Optional second link (guides hub / related). */
  secondaryUrl?: string;
  newsletterUrl: string;
}

const PIXFAN = 'https://www.pixfan.com';
const NEWSLETTER = `${PIXFAN}/newsletter/`;

function withUtm(url: string, quizId: string): string {
  const u = new URL(url);
  u.searchParams.set('utm_source', 'quiz');
  u.searchParams.set('utm_medium', 'result_cta');
  u.searchParams.set('utm_campaign', quizId.slice(0, 64));
  return u.toString();
}

/** Map quiz / pack ids to a content topic. */
export function resolvePixfanTopic(quizId: string): PixfanTopic {
  if (quizId === 'exposure-basics' || quizId.startsWith('mix-easy')) {
    return 'exposure';
  }
  if (quizId === 'composition') return 'composition';
  if (quizId === 'light-color') return 'light';
  if (quizId === 'gear-lenses') return 'gear';
  if (quizId === 'history-icons' || quizId === 'public-domain') return 'history';
  if (quizId === 'genres') return 'genres';
  if (quizId === 'smartphone') return 'smartphone';
  if (quizId === 'photo-rights') return 'rights';
  if (quizId === 'retouching') return 'retouching';
  if (quizId.startsWith('mix-hard')) return 'history';
  if (quizId.startsWith('mix-medium')) return 'gear';
  // daily / random / duel → beginner hub
  return 'default';
}

const TOPIC_URLS: Record<
  PixfanTopic,
  { primary: string; secondary?: string }
> = {
  exposure: {
    primary: `${PIXFAN}/apprendre-la-photo/bases-et-reglages/`,
    secondary: `${PIXFAN}/?s=exposition`,
  },
  composition: {
    primary: `${PIXFAN}/apprendre-la-photo/`,
    secondary: `${PIXFAN}/?s=composition`,
  },
  light: {
    primary: `${PIXFAN}/apprendre-la-photo/`,
    secondary: `${PIXFAN}/?s=lumi%C3%A8re`,
  },
  gear: {
    primary: `${PIXFAN}/materiel-photo/`,
    secondary: `${PIXFAN}/?s=objectif`,
  },
  history: {
    primary: `${PIXFAN}/inspiration-culture/`,
    secondary: `${PIXFAN}/actualite-photo/`,
  },
  genres: {
    primary: `${PIXFAN}/apprendre-la-photo/genres-photo/`,
    secondary: `${PIXFAN}/inspiration-culture/`,
  },
  smartphone: {
    primary: `${PIXFAN}/apprendre-la-photo/`,
    secondary: `${PIXFAN}/?s=smartphone`,
  },
  rights: {
    primary: `${PIXFAN}/?s=droit+auteur`,
    secondary: `${PIXFAN}/actualite-photo/`,
  },
  retouching: {
    primary: `${PIXFAN}/logiciels-retouche/`,
    secondary: `${PIXFAN}/?s=lightroom`,
  },
  default: {
    primary: `${PIXFAN}/apprendre-la-photo-guide-complet-debutants-quiz/`,
    secondary: `${PIXFAN}/apprendre-la-photo/`,
  },
};

/** Build UTM-tagged CTA links for a finished quiz. */
export function getPixfanCta(quizId: string): PixfanCta {
  const topic = resolvePixfanTopic(quizId);
  const urls = TOPIC_URLS[topic];
  return {
    topic,
    primaryUrl: withUtm(urls.primary, quizId),
    secondaryUrl: urls.secondary
      ? withUtm(urls.secondary, quizId)
      : undefined,
    newsletterUrl: withUtm(NEWSLETTER, quizId),
  };
}
