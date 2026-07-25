import type { Question, Quiz } from '../types/quiz';

export const DAILY_QUESTION_COUNT = 10;

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

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic PRNG (mulberry32). */
function seededRandom(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Same 10 questions for every player on a given UTC day. */
export function buildDailyQuiz(quizzes: Quiz[], date = new Date()): Quiz {
  const quizId = getDailyQuizId(date);
  const rand = seededRandom(hashSeed(quizId));
  const pool: Question[] = [];

  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      pool.push({
        ...q,
        id: `${quiz.id}__${q.id}`,
      });
    }
  }

  const picked = seededShuffle(pool, rand).slice(
    0,
    Math.min(DAILY_QUESTION_COUNT, pool.length)
  );

  return {
    id: quizId,
    title: {
      en: 'Daily challenge',
      fr: 'Défi du jour',
    },
    description: {
      en: '10 questions shared by everyone today. Beat today’s pack!',
      fr: '10 questions communes à tous aujourd’hui. Battez le pack du jour !',
    },
    questions: picked,
  };
}
