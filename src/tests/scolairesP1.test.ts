import { describe, expect, it } from 'vitest';
import { isScolairesHash } from '../utils/routing';
import {
  SCOLAIRES_PARCOURS,
  filterQuizzesByScolairesTag,
  quizHasScolairesTag,
} from '../utils/scolaires';
import { filterQuizzesByPackFilter } from '../utils/packFilter';
import type { Quiz } from '../types/quiz';

function stubQuiz(id: string, tags?: string[]): Quiz {
  return {
    id,
    title: { en: id, fr: id },
    description: { en: '', fr: '' },
    questions: [
      {
        id: 'q1',
        type: 'single',
        text: { en: 'Q', fr: 'Q' },
        answers: [{ id: 'a', text: { en: 'A', fr: 'A' } }],
        correctAnswers: ['a'],
      },
    ],
    difficulty: 'easy',
    ...(tags ? { tags } : {}),
  };
}

describe('scolaires P1 routing & tags', () => {
  it('recognizes #/scolaires hash', () => {
    expect(isScolairesHash('#/scolaires')).toBe(true);
    expect(isScolairesHash('#/scolaires?x=1')).toBe(true);
    expect(isScolairesHash('#/quiz/genres')).toBe(false);
    expect(isScolairesHash('#/daily')).toBe(false);
  });

  it('lists 5 curated parcours with cycle 4 first (vague 1.22)', () => {
    expect(SCOLAIRES_PARCOURS.map((p) => p.id)).toEqual([
      'c4-regard',
      'c4-lumiere',
      'c4-emi-droits',
      'c3-decouvrir',
      'lycee-pratique',
    ]);
    expect(SCOLAIRES_PARCOURS[0]?.startQuizId).toBe('photo-reading');
    expect(SCOLAIRES_PARCOURS[0]?.recommended).toBe(true);
    expect(SCOLAIRES_PARCOURS[4]?.startQuizId).toBe('portrait-light');
  });

  it('filters packs by scolaires tag without dropping untagged ones from all', () => {
    const quizzes = [
      stubQuiz('genres', ['scolaires', 'c3']),
      stubQuiz('gear-lenses'),
      stubQuiz('composition', ['scolaires', 'c4']),
    ];
    expect(filterQuizzesByPackFilter(quizzes, 'all')).toHaveLength(3);
    expect(filterQuizzesByScolairesTag(quizzes).map((q) => q.id)).toEqual([
      'genres',
      'composition',
    ]);
    expect(filterQuizzesByPackFilter(quizzes, 'scolaires').map((q) => q.id)).toEqual([
      'genres',
      'composition',
    ]);
    expect(quizHasScolairesTag(quizzes[1]!)).toBe(false);
  });
});
