import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildShareUrl,
  canNativeShare,
  copySharePayload,
  nativeShareScore,
  quizShareUrl,
  resolveShareKind,
  shareTextKey,
} from '../utils/share';

describe('share', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('builds quiz deep links', () => {
    expect(quizShareUrl('composition')).toContain('#/quiz/composition');
    expect(quizShareUrl('duel-abcd2345')).toContain('duel-abcd2345');
  });

  it('resolves share kind from quiz id', () => {
    expect(resolveShareKind('composition')).toBe('default');
    expect(resolveShareKind('duel-abcd2345')).toBe('duel');
    expect(resolveShareKind('daily-2026-07-26')).toBe('daily');
    expect(resolveShareKind('composition', { challengeInvite: true })).toBe(
      'challenge'
    );
  });

  it('maps share kinds to i18n keys', () => {
    expect(shareTextKey('default')).toBe('share.text');
    expect(shareTextKey('duel')).toBe('share.textDuel');
    expect(shareTextKey('daily')).toBe('share.textDaily');
    expect(shareTextKey('challenge')).toBe('share.textChallenge');
  });

  it('builds platform share URLs', () => {
    const payload = {
      text: 'Hello',
      url: 'https://quiz.pixfan.fr/#/quiz/x',
      hashtags: 'quiz,photo',
    };
    expect(buildShareUrl('twitter', payload)).toContain('twitter.com/intent');
    expect(buildShareUrl('whatsapp', payload)).toContain('wa.me');
    expect(buildShareUrl('facebook', payload)).toContain('facebook.com');
  });

  it('detects native share availability', () => {
    expect(canNativeShare()).toBe(true);
  });

  it('nativeShareScore returns shared on success', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: share,
      configurable: true,
      writable: true,
    });

    const result = await nativeShareScore({
      text: 'score',
      url: 'https://quiz.pixfan.fr',
    });
    expect(result).toBe('shared');
    expect(share).toHaveBeenCalled();
  });

  it('nativeShareScore returns aborted on AbortError', async () => {
    Object.defineProperty(navigator, 'share', {
      value: vi.fn().mockRejectedValue(new DOMException('x', 'AbortError')),
      configurable: true,
      writable: true,
    });

    const result = await nativeShareScore({
      text: 'score',
      url: 'https://quiz.pixfan.fr',
    });
    expect(result).toBe('aborted');
  });

  it('copies share payload to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const ok = await copySharePayload({
      text: 'Hello',
      url: 'https://example.com',
    });
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('Hello https://example.com');
  });
});
