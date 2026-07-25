const PLAYER_ID_KEY = 'quiz-pixfan-player-id';
const DISPLAY_NAME_KEY = 'quiz-pixfan-player-display-name';
export const MAX_DISPLAY_NAME_LENGTH = 24;

/** Stable anonymous id for this browser (persisted in localStorage). */
export function getPlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

/** Trim, strip control chars, collapse whitespace, cap length. */
export function sanitizeDisplayName(raw: string): string {
  const trimmed = raw.trim().replace(/[\u0000-\u001F\u007F]/g, '');
  const collapsed = trimmed.replace(/\s+/g, ' ');
  return collapsed.slice(0, MAX_DISPLAY_NAME_LENGTH);
}

export function getPlayerDisplayName(): string {
  const stored = localStorage.getItem(DISPLAY_NAME_KEY);
  return stored ? sanitizeDisplayName(stored) : '';
}

export function setPlayerDisplayName(name: string): void {
  const sanitized = sanitizeDisplayName(name);
  if (sanitized) {
    localStorage.setItem(DISPLAY_NAME_KEY, sanitized);
  } else {
    localStorage.removeItem(DISPLAY_NAME_KEY);
  }
}

/** Name shown on the leaderboard when submitting a score. */
export function resolveDisplayNameForSubmit(lang: string): string {
  const chosen = getPlayerDisplayName();
  if (chosen) return chosen;
  const prefix = lang.startsWith('fr') ? 'Joueur-' : 'Player-';
  return prefix + getPlayerId().slice(0, 6);
}
