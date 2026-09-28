import { parseScoreParam } from './duelOutcome';

export interface QuizHashOpts {
  score?: number;
  /** School / classroom mode — no public leaderboard. */
  classe?: boolean;
}

function appendQuizHashQuery(path: string, opts?: QuizHashOpts): string {
  const params = new URLSearchParams();
  if (opts?.score != null && Number.isFinite(opts.score)) {
    params.set('score', String(Math.round(opts.score)));
  }
  if (opts?.classe) {
    params.set('classe', '1');
  }
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}

export function quizHashPath(quizId: string, opts?: QuizHashOpts): string {
  return appendQuizHashQuery(`#/quiz/${encodeURIComponent(quizId)}`, opts);
}

export function parseQuizIdFromHash(hash: string): string | null {
  const match = hash.match(/^#\/quiz\/([a-zA-Z0-9-]+)(?:\?.*)?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** True for `#/daily` (stable daily shortcut used in guides / sitemap). */
export function isDailyShortcutHash(hash: string): boolean {
  return /^#\/daily(?:\?.*)?$/.test(hash);
}

function hashQuery(hash: string): string | null {
  const qIndex = hash.indexOf('?');
  return qIndex !== -1 ? hash.slice(qIndex + 1) : null;
}

function isClasseParam(value: string | null): boolean {
  return value === '1' || value === 'true';
}

/** Read `score` from hash query (`#/quiz/id?score=80`) or location search. */
export function parseScoreFromLocation(
  hash = typeof window !== 'undefined' ? window.location.hash : '',
  search = typeof window !== 'undefined' ? window.location.search : ''
): number | null {
  const fromHash = hashQuery(hash);
  if (fromHash) {
    const score = parseScoreParam(
      new URLSearchParams(fromHash).get('score')
    );
    if (score != null) return score;
  }
  if (search) {
    return parseScoreParam(new URLSearchParams(search).get('score'));
  }
  return null;
}

/**
 * School session mode from hash (`#/quiz/id?classe=1`) or search (`?classe=1`).
 */
export function parseClasseModeFromLocation(
  hash = typeof window !== 'undefined' ? window.location.hash : '',
  search = typeof window !== 'undefined' ? window.location.search : ''
): boolean {
  const fromHash = hashQuery(hash);
  if (fromHash && isClasseParam(new URLSearchParams(fromHash).get('classe'))) {
    return true;
  }
  if (search) {
    return isClasseParam(new URLSearchParams(search).get('classe'));
  }
  return false;
}

/** Persist `?classe=1` on location.search so home / hash clears keep mode. */
export function ensureClasseSearchParam(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (url.searchParams.get('classe') === '1') return;
  url.searchParams.set('classe', '1');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
}

export function clearQuizHash(): void {
  const url = new URL(window.location.href);
  url.hash = '';
  window.history.replaceState(null, '', url.pathname + url.search);
}

export function setQuizHash(quizId: string, opts?: QuizHashOpts): void {
  const url = new URL(window.location.href);
  // Keep score / classe in the hash fragment (search may also hold classe=1).
  window.history.pushState(
    null,
    '',
    url.pathname + url.search + quizHashPath(quizId, opts)
  );
}
