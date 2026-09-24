import { describe, expect, it } from 'vitest';
import {
  buildCtaAnalyticsBreakdown,
  ctaAnalyticsQuizId,
  getPixfanCta,
  isCtaAnalyticsQuizId,
  localGuideForMistake,
  localGuideUrlForDailyTheme,
  parseCtaAnalyticsQuizId,
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
    expect(resolvePixfanTopic('light-color')).toBe('light');
    expect(resolvePixfanTopic('portrait-light')).toBe('light');
    expect(resolvePixfanTopic('marques-photo')).toBe('history');
    expect(resolvePixfanTopic('history-icons')).toBe('history');
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
    expect(cta.secondaryTarget).toBe('pixfan');
    expect(cta.secondaryUrl).toContain(
      'https://www.pixfan.com/apprendre-la-photo/bases-et-reglages/'
    );
    expect(cta.secondaryUrl).toContain('utm_content=pixfan');
    expect(cta.newsletterUrl).toContain('/newsletter/');
    expect(cta.newsletterUrl).toContain('utm_content=newsletter');
    expect(cta.fromMistakes).toBe(false);

    const composition = getPixfanCta('composition');
    expect(composition.secondaryTarget).toBe('pixfan');
    expect(composition.secondaryUrl).toContain(
      'https://www.pixfan.com/apprendre-la-photo/'
    );

    const phone = getPixfanCta('smartphone');
    expect(phone.primaryTarget).toBe('guide');
    expect(phone.secondaryTarget).toBe('pixfan');
    expect(phone.secondaryUrl).toContain('utm_content=pixfan');
  });

  it('targets local guides for light, retouching and genres', () => {
    const light = getPixfanCta('light-color');
    expect(light.primaryTarget).toBe('guide');
    expect(light.primaryUrl).toContain('/guides/lumiere-photo');
    expect(light.secondaryTarget).toBe('pixfan');
    expect(light.secondaryUrl).toContain(
      'https://www.pixfan.com/apprendre-la-photo/'
    );

    const retouch = getPixfanCta('retouching');
    expect(retouch.primaryTarget).toBe('guide');
    expect(retouch.primaryUrl).toContain('/guides/retouche-lightroom');
    expect(retouch.secondaryTarget).toBe('pixfan');
    expect(retouch.secondaryUrl).toContain(
      'https://www.pixfan.com/category/logiciels-retouche/'
    );
    expect(retouch.secondaryUrl).toContain('utm_content=pixfan');

    const lr = getPixfanCta('lightroom-workflow');
    expect(lr.topic).toBe('retouching');
    expect(lr.primaryTarget).toBe('guide');
    expect(lr.primaryUrl).toContain('/guides/retouche-lightroom');
    expect(lr.secondaryUrl).toContain('category/logiciels-retouche');

    const genres = getPixfanCta('genres');
    expect(genres.topic).toBe('genres');
    expect(genres.primaryTarget).toBe('guide');
    expect(genres.primaryUrl).toContain('/guides/genres-photo');
    expect(genres.primaryUrl).toContain('utm_content=guide');
    expect(genres.secondaryTarget).toBe('pixfan');
    expect(genres.secondaryUrl).toContain(
      'https://www.pixfan.com/apprendre-la-photo/genres-photo/'
    );
    expect(genres.secondaryUrl).toContain('utm_content=pixfan');

    const portrait = getPixfanCta('portrait-light');
    expect(portrait.topic).toBe('light');
    expect(portrait.primaryTarget).toBe('guide');
    expect(portrait.primaryUrl).toContain('/guides/lumiere-photo');
    expect(portrait.secondaryTarget).toBe('pixfan');
  });

  it('targets local guides for gear, rights and history with Pixfan secondary', () => {
    const gear = getPixfanCta('gear-lenses');
    expect(gear.topic).toBe('gear');
    expect(gear.primaryTarget).toBe('guide');
    expect(gear.primaryUrl).toContain('/guides/materiel-photo');
    expect(gear.primaryUrl).toContain('utm_content=guide');
    expect(gear.secondaryTarget).toBe('pixfan');
    expect(gear.secondaryUrl).toContain('https://www.pixfan.com/materiel-photo/');
    expect(gear.secondaryUrl).toContain('utm_content=pixfan');

    const history = getPixfanCta('history-icons');
    expect(history.primaryTarget).toBe('guide');
    expect(history.primaryUrl).toContain('/guides/histoire-photo');
    expect(history.secondaryTarget).toBe('pixfan');
    expect(history.secondaryUrl).toContain(
      'https://www.pixfan.com/inspiration-culture/'
    );

    const publicDomain = getPixfanCta('public-domain');
    expect(publicDomain.topic).toBe('history');
    expect(publicDomain.primaryTarget).toBe('guide');
    expect(publicDomain.primaryUrl).toContain('/guides/histoire-photo');

    const brands = getPixfanCta('marques-photo');
    expect(brands.topic).toBe('history');
    expect(brands.primaryTarget).toBe('guide');
    expect(brands.primaryUrl).toContain('/guides/histoire-photo');

    const mixHard = getPixfanCta('mix-hard');
    expect(mixHard.topic).toBe('history');
    expect(mixHard.primaryTarget).toBe('guide');

    const rights = getPixfanCta('photo-rights');
    expect(rights.primaryTarget).toBe('guide');
    expect(rights.primaryUrl).toContain('/guides/droits-ethique-photo');
    expect(rights.secondaryTarget).toBe('pixfan');
    expect(rights.secondaryUrl).toContain(
      'maitriser-la-cession-de-droits-dauteur-en-photographie-guide-pratique'
    );
    expect(rights.secondaryUrl).not.toContain('?s=');
  });

  it('resolves daily-theme local guide URLs with UTM', () => {
    const lr = localGuideUrlForDailyTheme('lightroom', 'daily-2026-09-21');
    expect(lr).toContain('/guides/retouche-lightroom');
    expect(lr).toContain('utm_content=daily_theme');
    expect(lr).toContain('utm_medium=daily_card');
    expect(lr).toContain('utm_campaign=daily-2026-09-21');

    expect(localGuideUrlForDailyTheme('composition')).toContain(
      '/guides/composition-photo'
    );
    expect(localGuideUrlForDailyTheme('genres')).toContain(
      '/guides/genres-photo'
    );
    expect(localGuideUrlForDailyTheme('gear')).toContain(
      '/guides/materiel-photo'
    );
    expect(localGuideUrlForDailyTheme('rights')).toContain(
      '/guides/droits-ethique-photo'
    );
    expect(localGuideUrlForDailyTheme('history')).toContain(
      '/guides/histoire-photo'
    );
    expect(localGuideUrlForDailyTheme('mixed')).toBeNull();
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
    expect(localGuideForMistake('light-1', 'light-color')?.path).toContain(
      '/guides/lumiere-photo'
    );
    expect(localGuideForMistake('retouching__r-1')?.path).toContain(
      '/guides/retouche-lightroom'
    );
    expect(localGuideForMistake('gen-1', 'genres')?.path).toContain(
      '/guides/genres-photo'
    );
    expect(localGuideForMistake('gear-1', 'gear-lenses')?.path).toContain(
      '/guides/materiel-photo'
    );
    expect(localGuideForMistake('photo-rights__r-1')?.path).toContain(
      '/guides/droits-ethique-photo'
    );
    expect(localGuideForMistake('hist-1', 'history-icons')?.path).toContain(
      '/guides/histoire-photo'
    );
    expect(localGuideForMistake('public-domain__pd-1')?.path).toContain(
      '/guides/histoire-photo'
    );
  });

  it('encodes and parses CTA clicks for quiz_attempts analytics', () => {
    const id = ctaAnalyticsQuizId('guide', 'exposure', 'daily-2026-09-19');
    expect(id).toBe('cta:guide:exposure:daily-2026-09-19');
    expect(isCtaAnalyticsQuizId(id)).toBe(true);
    expect(isCtaAnalyticsQuizId('daily-2026-09-19')).toBe(false);
    expect(parseCtaAnalyticsQuizId(id)).toEqual({
      target: 'guide',
      topic: 'exposure',
      sourceQuizId: 'daily-2026-09-19',
    });
    expect(parseCtaAnalyticsQuizId('cta:bad')).toBeNull();
  });

  it('aggregates CTA rows by target and topic', () => {
    const breakdown = buildCtaAnalyticsBreakdown([
      { quizId: 'cta:guide:light:light-color', clicks: 5 },
      { quizId: 'cta:newsletter:light:light-color', clicks: 2 },
      { quizId: 'cta:guide:retouching:retouching', clicks: 3 },
      { quizId: 'cta:pixfan:gear:gear-lenses', clicks: 4 },
      { quizId: 'cta:broken', clicks: 9 },
    ]);
    expect(breakdown.byTarget).toEqual([
      { target: 'guide', clicks: 8 },
      { target: 'newsletter', clicks: 2 },
      { target: 'pixfan', clicks: 4 },
    ]);
    expect(breakdown.byTopic).toEqual([
      { topic: 'light', clicks: 7 },
      { topic: 'gear', clicks: 4 },
      { topic: 'retouching', clicks: 3 },
    ]);
    expect(breakdown.rows[0]).toMatchObject({
      target: 'guide',
      topic: 'light',
      clicks: 5,
    });
  });
});
