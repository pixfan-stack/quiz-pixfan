import { describe, expect, it } from 'vitest';
import {
  ATTEMPT_MODES,
  buildModeCounts,
  classifyAttemptMode,
} from '../../functions/lib/attemptModes';
import {
  ATTEMPT_MODES as CLIENT_ATTEMPT_MODES,
  buildAttemptModeCounts,
  classifyAttemptMode as clientClassify,
} from '../utils/habitAnalytics';

describe('functions/lib/attemptModes', () => {
  it('matches client classifyAttemptMode for known quiz ids', () => {
    const ids = [
      'photo-reading',
      'weak-spots',
      'daily-2026-09-23',
      'duel-abcd2345',
      'exposure-basics',
      'marques-photo',
      'mix-easy',
      'mix-medium',
      'mix-hard',
      'random-mix',
    ];
    for (const id of ids) {
      expect(classifyAttemptMode(id)).toBe(clientClassify(id));
    }
  });

  it('lists the same mode order as the client', () => {
    expect([...ATTEMPT_MODES]).toEqual([...CLIENT_ATTEMPT_MODES]);
  });

  it('ventilates mix and random outside packs', () => {
    const rows = [
      { quizId: 'photo-reading', attempts: 10 },
      { quizId: 'daily-2026-09-20', attempts: 5 },
      { quizId: 'duel-abcd2345', attempts: 2 },
      { quizId: 'weak-spots', attempts: 4 },
      { quizId: 'exposure-basics', attempts: 7 },
      { quizId: 'mix-easy', attempts: 3 },
      { quizId: 'mix-hard', attempts: 2 },
      { quizId: 'random-mix', attempts: 6 },
    ];
    expect(buildModeCounts(rows)).toEqual(buildAttemptModeCounts(rows));
    expect(buildModeCounts(rows)).toEqual([
      { mode: 'photo-reading', attempts: 10 },
      { mode: 'daily', attempts: 5 },
      { mode: 'duel', attempts: 2 },
      { mode: 'weak-spots', attempts: 4 },
      { mode: 'mix', attempts: 5 },
      { mode: 'random', attempts: 6 },
      { mode: 'packs', attempts: 7 },
    ]);
  });
});
