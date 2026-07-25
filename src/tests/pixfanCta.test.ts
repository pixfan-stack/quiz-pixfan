import { describe, expect, it } from 'vitest';
import { getPixfanCta, resolvePixfanTopic } from '../utils/pixfanCta';

describe('pixfanCta', () => {
  it('maps category quizzes to topics', () => {
    expect(resolvePixfanTopic('exposure-basics')).toBe('exposure');
    expect(resolvePixfanTopic('gear-lenses')).toBe('gear');
    expect(resolvePixfanTopic('retouching')).toBe('retouching');
    expect(resolvePixfanTopic('photo-rights')).toBe('rights');
  });

  it('falls back for challenge packs', () => {
    expect(resolvePixfanTopic('random-mix')).toBe('default');
    expect(resolvePixfanTopic('daily-2026-07-25')).toBe('default');
    expect(resolvePixfanTopic('duel-abcd2345')).toBe('default');
  });

  it('adds UTM tags to pixfan URLs', () => {
    const cta = getPixfanCta('gear-lenses');
    expect(cta.topic).toBe('gear');
    expect(cta.primaryUrl).toContain('https://www.pixfan.com/materiel-photo/');
    expect(cta.primaryUrl).toContain('utm_source=quiz');
    expect(cta.primaryUrl).toContain('utm_campaign=gear-lenses');
    expect(cta.newsletterUrl).toContain('/newsletter/');
    expect(cta.secondaryUrl).toBeTruthy();
  });
});
