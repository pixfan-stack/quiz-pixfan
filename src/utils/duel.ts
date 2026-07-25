import type { Question, Quiz } from '../types/quiz';
import { hashSeed, seededRandom, seededShuffle } from './seededRandom';

export const DUEL_QUESTION_COUNT = 10;
export const DUEL_ID_PREFIX = 'duel-';

const SEED_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

/** Create a short shareable duel seed. */
export function createDuelSeed(length = 8): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let out = '';
  for (let i = 0; i < length; i++) {
    out += SEED_ALPHABET[bytes[i]! % SEED_ALPHABET.length];
  }
  return out;
}

export function duelQuizId(seed: string): string {
  return `${DUEL_ID_PREFIX}${seed}`;
}

export function isDuelQuizId(quizId: string): boolean {
  return /^duel-[a-z0-9]{6,16}$/.test(quizId);
}

export function parseDuelSeed(quizId: string): string | null {
  const match = quizId.match(/^duel-([a-z0-9]{6,16})$/);
  return match?.[1] ?? null;
}

/** Same 10 questions for every player who opens the duel link. */
export function buildDuelQuiz(
  quizzes: Quiz[],
  seed: string,
  count = DUEL_QUESTION_COUNT
): Quiz {
  const quizId = duelQuizId(seed);
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

  const picked = seededShuffle(pool, rand).slice(0, Math.min(count, pool.length));

  return {
    id: quizId,
    title: {
      en: 'Friend duel',
      fr: 'Duel entre amis',
    },
    description: {
      en: 'Same 10 questions for everyone with this link. Compare scores!',
      fr: 'Les mêmes 10 questions pour tous via ce lien. Comparez vos scores !',
    },
    questions: picked,
  };
}
