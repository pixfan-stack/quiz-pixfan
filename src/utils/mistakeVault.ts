import type { AnswerReviewItem, Question, Quiz } from '../types/quiz';

export const WEAK_SPOTS_QUIZ_ID = 'weak-spots';
export const WEAK_SPOTS_QUESTION_COUNT = 10;
const STORAGE_KEY = 'quiz-pixfan-mistake-vault';
const MAX_ENTRIES = 80;

export interface MistakeVaultEntry {
  questionId: string;
  /** Source category id when known (prefix before __). */
  sourceQuizId: string | null;
  missCount: number;
  lastMissedAt: string;
}

function readVault(): MistakeVaultEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MistakeVaultEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e) => e && typeof e.questionId === 'string' && e.questionId.length > 0
    );
  } catch {
    return [];
  }
}

function writeVault(entries: MistakeVaultEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // ignore
  }
}

function sourceQuizIdFromQuestionId(questionId: string): string | null {
  const idx = questionId.indexOf('__');
  return idx > 0 ? questionId.slice(0, idx) : null;
}

export function getMistakeVault(): MistakeVaultEntry[] {
  return readVault();
}

export function getMistakeVaultCount(): number {
  return readVault().length;
}

/** Merge incorrect answers into the local vault. Returns how many were recorded. */
export function recordMistakes(mistakes: AnswerReviewItem[]): number {
  const wrong = mistakes.filter((m) => !m.wasCorrect);
  if (wrong.length === 0) return 0;

  const vault = readVault();
  const byId = new Map(vault.map((e) => [e.questionId, e]));
  const now = new Date().toISOString();

  for (const item of wrong) {
    const questionId = item.question.id;
    const existing = byId.get(questionId);
    if (existing) {
      existing.missCount += 1;
      existing.lastMissedAt = now;
    } else {
      byId.set(questionId, {
        questionId,
        sourceQuizId: sourceQuizIdFromQuestionId(questionId),
        missCount: 1,
        lastMissedAt: now,
      });
    }
  }

  const next = [...byId.values()].sort(
    (a, b) =>
      b.missCount - a.missCount ||
      Date.parse(b.lastMissedAt) - Date.parse(a.lastMissedAt)
  );
  writeVault(next);
  return wrong.length;
}

export function clearMistakeVault(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isWeakSpotsQuizId(quizId: string): boolean {
  return quizId === WEAK_SPOTS_QUIZ_ID;
}

/** Build a practice pack from vaulted question ids still present in the catalog. */
export function buildWeakSpotsQuiz(
  quizzes: Quiz[],
  count = WEAK_SPOTS_QUESTION_COUNT
): Quiz | null {
  const vault = readVault();
  if (vault.length === 0 || quizzes.length === 0) return null;

  const pool = new Map<string, Question>();
  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      const compoundId = `${quiz.id}__${q.id}`;
      pool.set(compoundId, { ...q, id: compoundId });
      // Also index raw id for category-quiz mistakes
      if (!pool.has(q.id)) {
        pool.set(q.id, { ...q, id: compoundId });
      }
    }
  }

  const picked: Question[] = [];
  for (const entry of vault) {
    const q = pool.get(entry.questionId);
    if (q) picked.push(q);
    if (picked.length >= count) break;
  }

  if (picked.length === 0) return null;

  return {
    id: WEAK_SPOTS_QUIZ_ID,
    title: {
      en: 'Weak spots',
      fr: 'Points faibles',
    },
    description: {
      en: 'Practice the questions you missed recently.',
      fr: 'Révisez les questions que vous avez manquées récemment.',
    },
    questions: picked,
  };
}
