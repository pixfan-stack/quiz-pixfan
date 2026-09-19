import { describe, expect, it } from 'vitest';
import {
  ctaAnalyticsQuizId,
  getPixfanCta,
  isCtaAnalyticsQuizId,
  localGuideForMistake,
  resolvePixfanTopic,
  resolveTopicFromMistakes,
} from '../utils/pixfanCta';

describe('pixfanCta', () => {
  it('maps category quizzes to topics', () => {
    expect(resolvePixfanTopic('exposure-basics')).toBe('exposure');
    expect(resolvePixfanTopic('gear-lenses')).toBe('gear');
    expect(resolvePixfanTopic('retouching')).toBe('retouching');
    expect(resolvePixfanTopic('lightroom-workflow')).toBe('retouching');
    expect(resolvePixfanTopic('photo-rights')).toBe('rights');
  });

  it('falls back for challenge packs', () => {
    expect(resolvePixfanTopic('random-mix')).toBe('default');
    expect(resolvePixfanTopic('daily-2026-07-25')).toBe('default');
    expect(resolvePixfanTopic('duel-abcd2345')).toBe('default');
  });

  it('targets local guide for exposure / composition / smartphone', () => {
    const cta = getPixfanCta('exposure-basics');
    expect(cta.topic).toBe('exposure');
    expect(cta.primaryTarget).toBe('guide');
    expect(cta.primaryUrl).toContain('/guides/triangle-exposition');
    expect(cta.primaryUrl).toContain('utm_source=quiz');
    expect(cta.primaryUrl).toContain('utm_campaign=exposure-basics');
    expect(cta.primaryUrl).toContain('utm_content=guide');
    expect(cta.newsletterUrl).toContain('/newsletter/');
    expect(cta.newsletterUrl).toContain('utm_content=newsletter');
    expect(cta.fromMistakes).toBe(false);
  });

  it('uses pixfan.com when no local guide exists', () => {
    const cta = getPixfanCta('gear-lenses');
    expect(cta.topic).toBe('gear');
    expect(cta.primaryTarget).toBe('pixfan');
    expect(cta.primaryUrl).toContain('https://www.pixfan.com/materiel-photo/');
    expect(cta.primaryUrl).toContain('utm_content=pixfan');
  });

  it('resolves failed theme from daily-style mistake ids', () => {
    expect(
      resolveTopicFromMistakes([
        'exposure-basics__exp-1',
        'exposure-basics__exp-2',
        'composition__comp-1',
      ])
    ).toBe('exposure');

    const daily = getPixfanCta('daily-2026-09-19', {
      mistakeQuestionIds: [
        'smartphone__sm-1',
        'smartphone__sm-2',
        'gear-lenses__g-1',
      ],
    });
    expect(daily.topic).toBe('smartphone');
    expect(daily.fromMistakes).toBe(true);
    expect(daily.primaryTarget).toBe('guide');
    expect(daily.primaryUrl).toContain('/guides/photo-smartphone');
  });

  it('resolves local guides for mistake themes', () => {
    expect(localGuideForMistake('exp-1', 'exposure-basics')?.path).toContain(
      '/guides/triangle-exposition'
    );
    expect(localGuideForMistake('composition__comp-1')?.path).toContain(
      '/guides/composition-photo'
    );
    expect(localGuideForMistake('gear-1', 'gear-lenses')).toBeNull();
  });

  it('encodes CTA clicks for quiz_attempts analytics', () => {
    const id = ctaAnalyticsQuizId('guide', 'exposure', 'daily-2026-09-19');
    expect(id).toBe('cta:guide:exposure:daily-2026-09-19');
    expect(isCtaAnalyticsQuizId(id)).toBe(true);
    expect(isCtaAnalyticsQuizId('daily-2026-09-19')).toBe(false);
  });
});
