import { describe, it, expect } from 'vitest';
import {
  clampScore,
  compareDuelScores,
  parseScoreParam,
} from '../utils/duelOutcome';
import {
  parseQuizIdFromHash,
  parseScoreFromLocation,
  quizHashPath,
} from '../utils/routing';

describe('duelOutcome', () => {
  it('compares scores', () => {
    expect(compareDuelScores(90, 80)).toBe('win');
    expect(compareDuelScores(70, 80)).toBe('lose');
    expect(compareDuelScores(80, 80)).toBe('tie');
  });

  it('parses and clamps score params', () => {
    expect(parseScoreParam('80')).toBe(80);
    expect(parseScoreParam('150')).toBe(100);
    expect(clampScore(-2)).toBe(0);
    expect(parseScoreParam('nope')).toBeNull();
  });
});

describe('routing score in hash', () => {
  it('builds and parses quiz hash with score', () => {
    expect(quizHashPath('duel-abcd2345', { score: 80 })).toBe(
      '#/quiz/duel-abcd2345?score=80'
    );
    expect(parseQuizIdFromHash('#/quiz/duel-abcd2345?score=80')).toBe(
      'duel-abcd2345'
    );
    expect(parseScoreFromLocation('#/quiz/duel-abcd2345?score=80', '')).toBe(
      80
    );
    expect(parseScoreFromLocation('#/quiz/composition', '?score=55')).toBe(55);
  });
});
