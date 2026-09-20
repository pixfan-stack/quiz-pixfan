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

function normalizeVaultEntry(raw: unknown): MistakeVaultEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const e = raw as Partial<MistakeVaultEntry>;
  if (typeof e.questionId !== 'string' || !e.questionId || e.questionId.length > 128) {
    return null;
  }
  const missCount = Math.max(1, Math.min(10000, Number(e.missCount) || 1));
  const lastMissedAt =
    typeof e.lastMissedAt === 'string' && !Number.isNaN(Date.parse(e.lastMissedAt))
      ? e.lastMissedAt
      : new Date(0).toISOString();
  const sourceQuizId =
    typeof e.sourceQuizId === 'string' && e.sourceQuizId.length > 0
      ? e.sourceQuizId.slice(0, 64)
      : sourceQuizIdFromQuestionId(e.questionId);
  return {
    questionId: e.questionId,
    sourceQuizId,
    missCount,
    lastMissedAt,
  };
}

/** Sanitize an unknown vault payload (API / storage). */
export function parseMistakeVault(raw: unknown): MistakeVaultEntry[] {
  if (!Array.isArray(raw)) return [];
  const byId = new Map<string, MistakeVaultEntry>();
  for (const item of raw) {
    const entry = normalizeVaultEntry(item);
    if (!entry) continue;
    const existing = byId.get(entry.questionId);
    if (!existing) {
      byId.set(entry.questionId, entry);
      continue;
    }
    byId.set(entry.questionId, mergeVaultEntryPair(existing, entry));
  }
  return sortVaultEntries([...byId.values()]).slice(0, MAX_ENTRIES);
}

function mergeVaultEntryPair(
  a: MistakeVaultEntry,
  b: MistakeVaultEntry
): MistakeVaultEntry {
  const aLast = Date.parse(a.lastMissedAt) || 0;
  const bLast = Date.parse(b.lastMissedAt) || 0;
  return {
    questionId: a.questionId,
    sourceQuizId: a.sourceQuizId ?? b.sourceQuizId,
    missCount: Math.max(a.missCount, b.missCount),
    lastMissedAt: bLast >= aLast ? b.lastMissedAt : a.lastMissedAt,
  };
}

function sortVaultEntries(entries: MistakeVaultEntry[]): MistakeVaultEntry[] {
  return [...entries].sort(
    (a, b) =>
      b.missCount - a.missCount ||
      Date.parse(b.lastMissedAt) - Date.parse(a.lastMissedAt)
  );
}

/**
 * Union two vaults by questionId (max missCount / newer lastMissedAt), capped.
 * Used for multi-device account sync.
 */
export function mergeMistakeVaultEntries(
  a: MistakeVaultEntry[],
  b: MistakeVaultEntry[]
): MistakeVaultEntry[] {
  const byId = new Map<string, MistakeVaultEntry>();
  for (const entry of [...a, ...b]) {
    const normalized = normalizeVaultEntry(entry);
    if (!normalized) continue;
    const existing = byId.get(normalized.questionId);
    byId.set(
      normalized.questionId,
      existing ? mergeVaultEntryPair(existing, normalized) : normalized
    );
  }
  return sortVaultEntries([...byId.values()]).slice(0, MAX_ENTRIES);
}

/** Merge remote vault into localStorage (union). Returns merged list. */
export function mergeRemoteMistakeVault(
  remote: MistakeVaultEntry[] | unknown
): MistakeVaultEntry[] {
  const remoteEntries = parseMistakeVault(remote);
  const merged = mergeMistakeVaultEntries(readVault(), remoteEntries);
  writeVault(merged);
  return merged;
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

/** Normalize ids so category (`q1`) and weak-spots (`cat__q1`) match. */
function idVariants(questionId: string): string[] {
  const ids = new Set<string>([questionId]);
  const idx = questionId.indexOf('__');
  if (idx > 0) {
    ids.add(questionId.slice(idx + 2));
  }
  return [...ids];
}

function entryMatches(entryId: string, resolvedIds: Set<string>): boolean {
  const entryVariants = idVariants(entryId);
  for (const variant of entryVariants) {
    if (resolvedIds.has(variant)) return true;
  }
  for (const resolved of resolvedIds) {
    if (entryVariants.includes(resolved)) return true;
    // compound vault id vs raw resolved, or vice versa
    for (const rv of idVariants(resolved)) {
      if (entryVariants.includes(rv)) return true;
    }
  }
  return false;
}

/**
 * Remove vault entries the player just answered correctly.
 * Returns how many entries were cleared.
 */
export function resolveCorrectAnswers(items: AnswerReviewItem[]): number {
  const correct = items.filter((m) => m.wasCorrect);
  if (correct.length === 0) return 0;

  const vault = readVault();
  if (vault.length === 0) return 0;

  const resolvedIds = new Set<string>();
  for (const item of correct) {
    for (const variant of idVariants(item.question.id)) {
      resolvedIds.add(variant);
    }
  }

  const next = vault.filter((e) => !entryMatches(e.questionId, resolvedIds));
  const cleared = vault.length - next.length;
  if (cleared > 0) writeVault(next);
  return cleared;
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
