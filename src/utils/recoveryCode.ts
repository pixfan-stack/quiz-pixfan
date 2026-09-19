/** Recovery code format helpers (client + tests). No secrets. */

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Normalize user input to `XXXX-XXXX-XXXX` or null. */
export function normalizeRecoveryCode(raw: string): string | null {
  const compact = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (compact.length !== 12) return null;
  if (![...compact].every((ch) => CODE_ALPHABET.includes(ch))) return null;
  return `${compact.slice(0, 4)}-${compact.slice(4, 8)}-${compact.slice(8, 12)}`;
}

/** Build shareable magic-link hash for a recovery code. */
export function recoveryMagicHash(code: string): string {
  const normalized = normalizeRecoveryCode(code);
  if (!normalized) return '#/recover';
  return `#/recover?c=${encodeURIComponent(normalized)}`;
}

/**
 * Parse `#/recover?c=…` or `#/recover/XXXX-XXXX-XXXX`.
 */
export function parseRecoveryCodeFromHash(hash: string): string | null {
  if (!hash.startsWith('#/recover')) return null;
  const rest = hash.slice('#/recover'.length);
  if (rest.startsWith('?')) {
    const params = new URLSearchParams(rest.slice(1));
    return normalizeRecoveryCode(params.get('c') ?? params.get('code') ?? '');
  }
  if (rest.startsWith('/')) {
    return normalizeRecoveryCode(decodeURIComponent(rest.slice(1).split(/[?#]/)[0] ?? ''));
  }
  return null;
}

export function isRecoverHash(hash: string): boolean {
  return hash === '#/recover' || hash.startsWith('#/recover?') || hash.startsWith('#/recover/');
}
