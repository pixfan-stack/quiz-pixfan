import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  buildShareUrl,
  canNativeShare,
  copySharePayload,
  nativeShareScore,
  ogImageUrl,
  quizShareUrl,
  resolveShareKind,
  shareOrCopy,
  shareTextKey,
  socialShareUrl,
} from '../utils/share';

describe('share', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('builds quiz deep links', () => {
    expect(quizShareUrl('composition')).toContain('#/quiz/composition');
    expect(quizShareUrl('duel-abcd2345')).toContain('duel-abcd2345');
  });

  it('builds crawlable social share and OG URLs', () => {
    const share = socialShareUrl('composition', { score: 80, lang: 'fr' });
    expect(share).toContain('/s/composition');
    expect(share).toContain('score=80');
    expect(share).toContain('lang=fr');
    const og = ogImageUrl('duel-abcd2345', { score: 55, lang: 'en' });
    expect(og).toContain('/og/themes/duel-70.png');
    expect(og).not.toContain('/api/og');
    expect(ogImageUrl('composition')).toContain('/og/themes/composition.png');
    expect(ogImageUrl('composition', { score: 88 })).toContain(
      '/og/themes/composition-90.png'
    );
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

  it('shareOrCopy prefers native share and skips clipboard when shared', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', {
      value: share,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const result = await shareOrCopy({
      text: 'Duel',
      url: 'https://quiz.pixfan.fr/s/duel-abcd2345',
    });
    expect(result).toBe('shared');
    expect(share).toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });

  it('shareOrCopy falls back to clipboard when native share is unavailable', async () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const result = await shareOrCopy({
      text: 'Duel',
      url: 'https://quiz.pixfan.fr/s/duel-abcd2345',
    });
    expect(result).toBe('copied');
    expect(writeText).toHaveBeenCalled();
  });
});
