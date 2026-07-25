import { describe, it, expect, vi, afterEach } from 'vitest';
import { isRemoteScoresEnabled } from '../utils/remoteScores';

describe('isRemoteScoresEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('is enabled when env is true', () => {
    vi.stubEnv('VITE_ENABLE_REMOTE_SCORES', 'true');
    expect(isRemoteScoresEnabled()).toBe(true);
  });

  it('is disabled when env is false', () => {
    vi.stubEnv('VITE_ENABLE_REMOTE_SCORES', 'false');
    expect(isRemoteScoresEnabled()).toBe(false);
  });

  it('defaults to enabled when unset', () => {
    vi.stubEnv('VITE_ENABLE_REMOTE_SCORES', undefined);
    expect(isRemoteScoresEnabled()).toBe(true);
  });
});
