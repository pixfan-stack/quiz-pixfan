import { describe, expect, it } from 'vitest';
import questionsData from '../../public/data/questions.json';
import {
  LATEST_PACK_COUNT,
  NEWEST_PACK_IDS,
  getLatestPacks,
  latestPackIdSet,
} from '../utils/latestPacks';
import latestSource from '../utils/latestPacks.ts?raw';
import type { Quiz } from '../types/quiz';

const data = questionsData as { quizzes: Quiz[] };

describe('vague 1.110 — Nouveautés pin Nikon + Tamron (QP-302)', () => {
  it('pins nikon-histoire then tamron-histoire via NEWEST_PACK_IDS (not catalog tail)', () => {
    expect([...NEWEST_PACK_IDS]).toEqual([
      'nikon-histoire',
      'tamron-histoire',
    ]);
    expect(LATEST_PACK_COUNT).toBe(2);
    expect(latestSource).toContain('NEWEST_PACK_IDS');
    expect(latestSource).not.toMatch(/quizzes\.slice\s*\(/);

    const latest = getLatestPacks(data.quizzes);
    expect(latest.map((q) => q.id)).toEqual([
      'nikon-histoire',
      'tamron-histoire',
    ]);
    expect([...latestPackIdSet(data.quizzes)].sort()).toEqual(
      ['nikon-histoire', 'tamron-histoire'].sort()
    );

    // Catalog tail must NOT drive the encart (Flash / Lexique stay in Autres quiz).
    const tail = data.quizzes.slice(-2).map((q) => q.id);
    expect(tail).toEqual(['flash-studio', 'lexique-image-fixe']);
    expect(latest.map((q) => q.id)).not.toEqual(tail);
  });
});
