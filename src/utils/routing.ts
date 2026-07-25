export function quizHashPath(quizId: string): string {
  return `#/quiz/${encodeURIComponent(quizId)}`;
}

export function parseQuizIdFromHash(hash: string): string | null {
  const match = hash.match(/^#\/quiz\/([a-zA-Z0-9-]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearQuizHash(): void {
  const url = new URL(window.location.href);
  url.hash = '';
  window.history.replaceState(null, '', url.pathname + url.search);
}

export function setQuizHash(quizId: string): void {
  const url = new URL(window.location.href);
  url.hash = `/quiz/${encodeURIComponent(quizId)}`;
  window.history.pushState(null, '', url.pathname + url.search + url.hash);
}
