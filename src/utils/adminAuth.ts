const SESSION_KEY = 'quiz-pixfan-admin-ok';

/** Admin PIN from env; empty disables admin in production builds. */
export function getAdminPin(): string {
  const fromEnv = (import.meta.env.VITE_ADMIN_PIN as string | undefined)?.trim();
  if (fromEnv) return fromEnv;
  return import.meta.env.DEV ? 'pixfan' : '';
}

export function isAdminEnabled(): boolean {
  return getAdminPin().length > 0;
}

export function isAdminUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function unlockAdmin(pin: string): boolean {
  if (!isAdminEnabled()) return false;
  if (pin !== getAdminPin()) return false;
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // ignore
  }
  return true;
}

export function lockAdmin(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export function isAdminHash(hash: string): boolean {
  return hash === '#/admin' || hash.startsWith('#/admin?');
}
