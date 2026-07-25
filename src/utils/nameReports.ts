const STORAGE_KEY = 'quiz-pixfan-reported-players';

function readReported(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const list = JSON.parse(raw) as string[];
    return new Set(list.filter((id) => typeof id === 'string'));
  } catch {
    return new Set();
  }
}

function writeReported(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

export function hasReportedPlayer(playerId: string): boolean {
  return readReported().has(playerId);
}

export function markPlayerReported(playerId: string): void {
  const ids = readReported();
  ids.add(playerId);
  writeReported(ids);
}
