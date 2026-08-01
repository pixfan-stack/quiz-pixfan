import { parseScoreParam } from './duelOutcome';

export function quizHashPath(quizId: string, opts?: { score?: number }): string {
  let path = `#/quiz/${encodeURIComponent(quizId)}`;
  if (opts?.score != null && Number.isFinite(opts.score)) {
    path += `?score=${Math.round(opts.score)}`;
  }
  return path;
}

export function parseQuizIdFromHash(hash: string): string | null {
  const match = hash.match(/^#\/quiz\/([a-zA-Z0-9-]+)(?:\?.*)?$/);
  return match ? decodeURIComponent(match[1]) : null;
}

/** Read `score` from hash query (`#/quiz/id?score=80`) or location search. */
export function parseScoreFromLocation(
  hash = typeof window !== 'undefined' ? window.location.hash : '',
  search = typeof window !== 'undefined' ? window.location.search : ''
): number | null {
  const qIndex = hash.indexOf('?');
  if (qIndex !== -1) {
    const fromHash = parseScoreParam(
      new URLSearchParams(hash.slice(qIndex + 1)).get('score')
    );
    if (fromHash != null) return fromHash;
  }
  if (search) {
    return parseScoreParam(new URLSearchParams(search).get('score'));
  }
  return null;
}

export function clearQuizHash(): void {
  const url = new URL(window.location.href);
  url.hash = '';
  window.history.replaceState(null, '', url.pathname + url.search);
}

export function setQuizHash(quizId: string, opts?: { score?: number }): void {
  const url = new URL(window.location.href);
  // Keep `?score=` in the hash fragment (not location.search).
  window.history.pushState(
    null,
    '',
    url.pathname + url.search + quizHashPath(quizId, opts)
  );
}
