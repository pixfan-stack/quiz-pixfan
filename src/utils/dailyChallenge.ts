import type { Question, Quiz } from '../types/quiz';
import { hashSeed, seededRandom, seededShuffle } from './seededRandom';

export const DAILY_QUESTION_COUNT = 10;
/** Prefer this many illustrated questions in the daily pack when available. */
export const DAILY_IMAGE_TARGET = 4;

/** Editorial week themes for the daily challenge (ISO week rotation). */
export type DailyThemeId =
  | 'lightroom'
  | 'smartphone'
  | 'light'
  | 'composition'
  | 'gear'
  | 'genres'
  | 'rights'
  | 'history'
  | 'mixed';

export interface DailyTheme {
  id: DailyThemeId;
  /** Prefer questions whose compound id starts with these quiz ids. */
  quizIds: string[];
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  /** Short chip label for the home card. */
  chip: { en: string; fr: string };
}

/**
 * Light editorial calendar — not a CMS.
 * ISO week % length picks the theme; `mixed` keeps the classic full-pool day.
 */
export const DAILY_THEME_ROTATION: readonly DailyTheme[] = [
  {
    id: 'lightroom',
    quizIds: ['lightroom-workflow', 'retouching'],
    title: {
      en: 'Daily challenge · Lightroom week',
      fr: 'Défi du jour · semaine Lightroom',
    },
    description: {
      en: '10 shared questions with a Lightroom / retouching bias — Pixfan editing path.',
      fr: '10 questions partagées avec un biais Lightroom / retouche — parcours Pixfan.',
    },
    chip: { en: 'Lightroom week', fr: 'Semaine Lightroom' },
  },
  {
    id: 'smartphone',
    quizIds: ['smartphone'],
    title: {
      en: 'Daily challenge · Smartphone week',
      fr: 'Défi du jour · semaine smartphone',
    },
    description: {
      en: '10 shared questions biased toward phone photography habits.',
      fr: '10 questions partagées orientées photo au téléphone.',
    },
    chip: { en: 'Smartphone week', fr: 'Semaine smartphone' },
  },
  {
    id: 'light',
    quizIds: ['light-color', 'exposure-basics'],
    title: {
      en: 'Daily challenge · Light week',
      fr: 'Défi du jour · semaine lumière',
    },
    description: {
      en: '10 shared questions biased toward light, color, and exposure.',
      fr: '10 questions partagées orientées lumière, couleur et exposition.',
    },
    chip: { en: 'Light week', fr: 'Semaine lumière' },
  },
  {
    id: 'composition',
    quizIds: ['composition'],
    title: {
      en: 'Daily challenge · Composition week',
      fr: 'Défi du jour · semaine composition',
    },
    description: {
      en: '10 shared questions biased toward framing and visual balance.',
      fr: '10 questions partagées orientées cadrage et équilibre visuel.',
    },
    chip: { en: 'Composition week', fr: 'Semaine composition' },
  },
  {
    id: 'gear',
    quizIds: ['gear-lenses'],
    title: {
      en: 'Daily challenge · Gear week',
      fr: 'Défi du jour · semaine matériel',
    },
    description: {
      en: '10 shared questions biased toward cameras, lenses, and accessories.',
      fr: '10 questions partagées orientées boîtiers, optiques et accessoires.',
    },
    chip: { en: 'Gear week', fr: 'Semaine matériel' },
  },
  {
    id: 'genres',
    quizIds: ['genres', 'portrait-light'],
    title: {
      en: 'Daily challenge · Genres week',
      fr: 'Défi du jour · semaine genres',
    },
    description: {
      en: '10 shared questions biased toward photo genres and portrait light.',
      fr: '10 questions partagées orientées genres photo et portrait & lumière.',
    },
    chip: { en: 'Genres week', fr: 'Semaine genres' },
  },
  {
    id: 'rights',
    quizIds: ['photo-rights'],
    title: {
      en: 'Daily challenge · Rights week',
      fr: 'Défi du jour · semaine droits',
    },
    description: {
      en: '10 shared questions biased toward photo rights and ethics.',
      fr: '10 questions partagées orientées droits et éthique photo.',
    },
    chip: { en: 'Rights week', fr: 'Semaine droits' },
  },
  {
    id: 'history',
    quizIds: ['history-icons', 'public-domain'],
    title: {
      en: 'Daily challenge · History week',
      fr: 'Défi du jour · semaine histoire',
    },
    description: {
      en: '10 shared questions biased toward photo history and public-domain icons.',
      fr: '10 questions partagées orientées histoire photo et icônes domaine public.',
    },
    chip: { en: 'History week', fr: 'Semaine histoire' },
  },
  {
    id: 'mixed',
    quizIds: [],
    title: {
      en: 'Daily challenge',
      fr: 'Défi du jour',
    },
    description: {
      en: '10 shared questions today, often with a photo to analyze.',
      fr: '10 questions partagées aujourd’hui, souvent avec une photo à analyser.',
    },
    chip: { en: 'Mixed week', fr: 'Semaine mixte' },
  },
] as const;

/** UTC calendar day id, e.g. daily-2026-07-25 */
export function getDailyQuizId(date = new Date()): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `daily-${y}-${m}-${d}`;
}

export function isDailyQuizId(quizId: string): boolean {
  return /^daily-\d{4}-\d{2}-\d{2}$/.test(quizId);
}

/** Parse `daily-YYYY-MM-DD` → UTC Date, or null. */
export function parseDailyQuizDate(quizId: string): Date | null {
  const m = /^daily-(\d{4})-(\d{2})-(\d{2})$/.exec(quizId);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return new Date(Date.UTC(y, mo - 1, d));
}

/** ISO week number (UTC), 1–53. */
export function getUtcIsoWeek(date = new Date()): number {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  // Thursday in current week decides the year.
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Editorial theme for the UTC week containing `date`. */
export function getDailyTheme(date = new Date()): DailyTheme {
  const week = getUtcIsoWeek(date);
  const idx = (week - 1) % DAILY_THEME_ROTATION.length;
  return DAILY_THEME_ROTATION[idx]!;
}

/** Milliseconds until the next UTC midnight (next daily pack). */
export function msUntilNextDaily(now = new Date()): number {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
    0
  );
  return Math.max(0, next - now.getTime());
}

/** Compact countdown like `5h 12m` / `12m 05s`. */
export function formatDailyCountdown(ms: number, lang: 'en' | 'fr' = 'en'): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return lang === 'fr' ? `${h} h ${m} min` : `${h}h ${m}m`;
  }
  return lang === 'fr'
    ? `${m} min ${String(s).padStart(2, '0')} s`
    : `${m}m ${String(s).padStart(2, '0')}s`;
}

function sourceQuizId(questionId: string): string {
  const idx = questionId.indexOf('__');
  return idx > 0 ? questionId.slice(0, idx) : questionId;
}

function flattenPool(quizzes: Quiz[]): Question[] {
  const pool: Question[] = [];
  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      pool.push({
        ...q,
        id: `${quiz.id}__${q.id}`,
      });
    }
  }
  return pool;
}

/**
 * Deterministic pick: fill with illustrated questions first (seeded),
 * then complete with the rest of the pool.
 * When `preferredQuizIds` is set, prefer those packs before the global pool.
 */
export function pickDailyQuestions(
  pool: Question[],
  rand: () => number,
  count = DAILY_QUESTION_COUNT,
  imageTarget = DAILY_IMAGE_TARGET,
  preferredQuizIds: string[] = []
): Question[] {
  const preferred = new Set(preferredQuizIds);
  const isPreferred = (q: Question) =>
    preferred.size === 0 ? true : preferred.has(sourceQuizId(q.id));

  const preferredPool = preferred.size > 0 ? pool.filter(isPreferred) : pool;
  const fallbackPool =
    preferred.size > 0 ? pool.filter((q) => !isPreferred(q)) : [];

  const pickFrom = (candidates: Question[], already: Question[]): Question[] => {
    const taken = new Set(already.map((q) => q.id));
    const withImage = seededShuffle(
      candidates.filter((q) => Boolean(q.imageUrl) && !taken.has(q.id)),
      rand
    );
    const withoutImage = seededShuffle(
      candidates.filter((q) => !q.imageUrl && !taken.has(q.id)),
      rand
    );

    const need = count - already.length;
    if (need <= 0) return already;

    const remainingImageTarget = Math.max(
      0,
      imageTarget - already.filter((q) => q.imageUrl).length
    );
    const imageTake = Math.min(remainingImageTarget, withImage.length, need);
    const picked = [...already, ...withImage.slice(0, imageTake)];
    const pickedIds = new Set(picked.map((q) => q.id));

    for (const q of [...withoutImage, ...withImage.slice(imageTake)]) {
      if (picked.length >= count) break;
      if (pickedIds.has(q.id)) continue;
      picked.push(q);
      pickedIds.add(q.id);
    }
    return picked;
  };

  let picked = pickFrom(preferredPool, []);
  if (picked.length < count && fallbackPool.length > 0) {
    picked = pickFrom(fallbackPool, picked);
  }

  return seededShuffle(picked, rand);
}

/** First illustrated question in today's pack — for home teaser. */
export function getDailyPhotoTeaser(
  quizzes: Quiz[],
  date = new Date()
): Question | null {
  const daily = buildDailyQuiz(quizzes, date);
  return daily.questions.find((q) => Boolean(q.imageUrl)) ?? null;
}

/** Same 10 questions for every player on a given UTC day (theme + image bias). */
export function buildDailyQuiz(quizzes: Quiz[], date = new Date()): Quiz {
  const quizId = getDailyQuizId(date);
  const theme = getDailyTheme(date);
  const rand = seededRandom(hashSeed(quizId));
  const pool = flattenPool(quizzes);
  const picked = pickDailyQuestions(
    pool,
    rand,
    DAILY_QUESTION_COUNT,
    DAILY_IMAGE_TARGET,
    theme.quizIds
  );

  return {
    id: quizId,
    title: { ...theme.title },
    description: { ...theme.description },
    questions: picked,
  };
}
