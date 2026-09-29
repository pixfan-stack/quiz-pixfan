import { describe, it, expect } from 'vitest';
import {
  buildAttemptModeCounts,
  buildHabitEventCounts,
  buildScolairesFunnel,
  classifyAttemptMode,
  ctaConversionPct,
  habitEventQuizId,
  isHabitEventQuizId,
  parseHabitEventQuizId,
} from '../utils/habitAnalytics';

describe('habitAnalytics', () => {
  it('encodes and parses habit event quiz_ids', () => {
    expect(habitEventQuizId('reminder_on')).toBe('evt:reminder_on');
    expect(habitEventQuizId('ics_download')).toBe('evt:ics_download');
    expect(habitEventQuizId('scolaires_hub')).toBe('evt:scolaires_hub');
    expect(habitEventQuizId('scolaires_parcours_c3_decouvrir')).toBe(
      'evt:scolaires_parcours_c3_decouvrir'
    );
    expect(isHabitEventQuizId('evt:pwa_install')).toBe(true);
    expect(isHabitEventQuizId('cta:guide:light:x')).toBe(false);
    expect(parseHabitEventQuizId('evt:account_create')).toBe('account_create');
    expect(parseHabitEventQuizId('evt:scolaires_parcours_c4_regard')).toBe(
      'scolaires_parcours_c4_regard'
    );
    expect(parseHabitEventQuizId('evt:unknown')).toBeNull();
    expect(parseHabitEventQuizId('cta:guide:light:x')).toBeNull();
  });

  it('classifies attempt modes', () => {
    expect(classifyAttemptMode('photo-reading')).toBe('photo-reading');
    expect(classifyAttemptMode('weak-spots')).toBe('weak-spots');
    expect(classifyAttemptMode('daily-2026-09-23')).toBe('daily');
    expect(classifyAttemptMode('duel-abcd2345')).toBe('duel');
    expect(classifyAttemptMode('exposure-basics')).toBe('packs');
    expect(classifyAttemptMode('mix-easy')).toBe('mix');
    expect(classifyAttemptMode('mix-medium')).toBe('mix');
    expect(classifyAttemptMode('mix-hard')).toBe('mix');
    expect(classifyAttemptMode('random-mix')).toBe('random');
  });

  it('aggregates mode and habit counts', () => {
    const modes = buildAttemptModeCounts([
      { quizId: 'photo-reading', attempts: 10 },
      { quizId: 'daily-2026-09-20', attempts: 5 },
      { quizId: 'daily-2026-09-21', attempts: 3 },
      { quizId: 'duel-abcd2345', attempts: 2 },
      { quizId: 'weak-spots', attempts: 4 },
      { quizId: 'exposure-basics', attempts: 7 },
      { quizId: 'mix-easy', attempts: 3 },
      { quizId: 'mix-hard', attempts: 2 },
      { quizId: 'random-mix', attempts: 6 },
      { quizId: 'evt:reminder_on', attempts: 99 },
      { quizId: 'cta:guide:light:x', attempts: 50 },
    ]);
    expect(modes).toEqual([
      { mode: 'photo-reading', attempts: 10 },
      { mode: 'daily', attempts: 8 },
      { mode: 'duel', attempts: 2 },
      { mode: 'weak-spots', attempts: 4 },
      { mode: 'mix', attempts: 5 },
      { mode: 'random', attempts: 6 },
      { mode: 'packs', attempts: 7 },
    ]);

    const events = buildHabitEventCounts([
      { quizId: 'evt:reminder_on', count: 12 },
      { quizId: 'evt:reminder_off', count: 3 },
      { quizId: 'evt:ics_download', count: 5 },
      { quizId: 'evt:pwa_install', count: 2 },
      { quizId: 'evt:account_create', count: 4 },
      { quizId: 'evt:account_redeem', count: 1 },
      { quizId: 'evt:weak_spots_cta', count: 6 },
      { quizId: 'evt:share_image_square', count: 8 },
      { quizId: 'evt:share_image_story', count: 11 },
      { quizId: 'evt:share_native', count: 7 },
      { quizId: 'evt:scolaires_hub', count: 4 },
      { quizId: 'evt:scolaires_parcours_c4_regard', count: 2 },
      { quizId: 'evt:bogus', count: 9 },
    ]);
    expect(events).toEqual([
      { event: 'reminder_on', count: 12 },
      { event: 'reminder_off', count: 3 },
      { event: 'ics_download', count: 5 },
      { event: 'pwa_install', count: 2 },
      { event: 'account_create', count: 4 },
      { event: 'account_redeem', count: 1 },
      { event: 'weak_spots_cta', count: 6 },
      { event: 'share_image_square', count: 8 },
      { event: 'share_image_story', count: 11 },
      { event: 'share_native', count: 7 },
      { event: 'scolaires_hub', count: 4 },
      { event: 'scolaires_parcours_c4_regard', count: 2 },
    ]);
  });

  it('computes CTA conversion percentage', () => {
    expect(ctaConversionPct(0, 0)).toBe(0);
    expect(ctaConversionPct(5, 100)).toBe(5);
    expect(ctaConversionPct(1, 3)).toBe(33.3);
  });

  it('builds scolaires mini-funnel from habit events (zeros OK)', () => {
    const empty = buildScolairesFunnel([]);
    expect(empty.hub).toBe(0);
    expect(empty.parcoursTotal).toBe(0);
    expect(empty.hubToParcoursPct).toBe(0);
    expect(empty.parcours).toHaveLength(5);
    expect(empty.parcours.every((p) => p.count === 0)).toBe(true);

    const funnel = buildScolairesFunnel([
      { event: 'scolaires_hub', count: 10 },
      { event: 'scolaires_parcours_c4_regard', count: 3 },
      { event: 'scolaires_parcours_c3_decouvrir', count: 2 },
      { event: 'reminder_on', count: 99 },
    ]);
    expect(funnel.hub).toBe(10);
    expect(funnel.parcoursTotal).toBe(5);
    expect(funnel.hubToParcoursPct).toBe(50);
    expect(funnel.parcours.find((p) => p.event === 'scolaires_parcours_c4_regard')?.count).toBe(3);
    expect(funnel.parcours.find((p) => p.event === 'scolaires_parcours_lycee_pratique')?.count).toBe(0);
  });
});
