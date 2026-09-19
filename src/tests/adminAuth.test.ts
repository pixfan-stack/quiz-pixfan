import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAdminSessionPin,
  isAdminHash,
  isAdminUnlocked,
  lockAdmin,
  unlockAdmin,
} from '../utils/adminAuth';

describe('adminAuth', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubEnv('VITE_ADMIN_PIN', 'secret');
  });

  it('detects admin hash routes', () => {
    expect(isAdminHash('#/admin')).toBe(true);
    expect(isAdminHash('#/admin?x=1')).toBe(true);
    expect(isAdminHash('#/quiz/exposure-basics')).toBe(false);
  });

  it('unlocks with the correct PIN for the session', () => {
    expect(unlockAdmin('wrong')).toBe(false);
    expect(isAdminUnlocked()).toBe(false);
    expect(getAdminSessionPin()).toBe('');
    expect(unlockAdmin('secret')).toBe(true);
    expect(isAdminUnlocked()).toBe(true);
    expect(getAdminSessionPin()).toBe('secret');
    lockAdmin();
    expect(isAdminUnlocked()).toBe(false);
    expect(getAdminSessionPin()).toBe('');
  });
});
