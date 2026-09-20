import { describe, expect, it } from 'vitest';
import questionsData from '../../public/data/questions.json';
import {
  parseAndValidateQuizzesJson,
  validateQuizzesData,
} from '../utils/quizzesSchema';

describe('quizzesSchema', () => {
  it('accepts the shipped questions.json', () => {
    const result = validateQuizzesData(questionsData);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.quizzes.length).toBeGreaterThanOrEqual(11);
    }
  });

  it('rejects invalid JSON text', () => {
    const result = parseAndValidateQuizzesJson('{not json');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.issues[0]?.message).toMatch(/invalid JSON/i);
    }
  });

  it('rejects missing quizzes array', () => {
    const result = validateQuizzesData({});
    expect(result.ok).toBe(false);
  });

  it('rejects single-choice with multiple correct answers', () => {
    const result = validateQuizzesData({
      quizzes: [
        {
          id: 'demo',
          title: { en: 'Demo', fr: 'Démo' },
          description: { en: 'Desc', fr: 'Desc' },
          questions: [
            {
              id: 'q1',
              type: 'single',
              text: { en: 'Q?', fr: 'Q ?' },
              answers: [
                { id: 'a', text: { en: 'A', fr: 'A' } },
                { id: 'b', text: { en: 'B', fr: 'B' } },
              ],
              correctAnswers: ['a', 'b'],
            },
          ],
        },
      ],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.issues.some((i) => i.path.includes('correctAnswers'))
      ).toBe(true);
    }
  });

  it('rejects unknown correctAnswers ids', () => {
    const result = validateQuizzesData({
      quizzes: [
        {
          id: 'demo',
          title: { en: 'Demo', fr: 'Démo' },
          description: { en: 'Desc', fr: 'Desc' },
          questions: [
            {
              id: 'q1',
              type: 'single',
              text: { en: 'Q?', fr: 'Q ?' },
              answers: [{ id: 'a', text: { en: 'A', fr: 'A' } }],
              correctAnswers: ['missing'],
            },
          ],
        },
      ],
    });
    expect(result.ok).toBe(false);
  });
});
