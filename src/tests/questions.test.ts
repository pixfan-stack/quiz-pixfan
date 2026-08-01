import { describe, it, expect } from 'vitest';
import questionsData from '../../public/data/questions.json';

describe('questions.json', () => {
  const data = questionsData as {
    quizzes: Array<{
      id: string;
      difficulty?: string;
      title: { en: string; fr: string };
      description: { en: string; fr: string };
      questions: Array<{
        id: string;
        type: string;
        difficulty?: string;
        text: { en: string; fr: string };
        answers: Array<{ id: string; text: { en: string; fr: string } }>;
        correctAnswers: string[];
      }>;
    }>;
  };

  const EXPECTED_QUIZ_IDS = [
    'exposure-basics',
    'composition',
    'light-color',
    'gear-lenses',
    'history-icons',
    'genres',
    'smartphone',
    'photo-rights',
    'retouching',
  ] as const;

  it('has exactly 9 category quizzes', () => {
    expect(data.quizzes.length).toBe(9);
  });

  it('keeps at least 20 questions per quiz', () => {
    for (const quiz of data.quizzes) {
      expect(quiz.questions.length).toBeGreaterThanOrEqual(20);
    }
  });

  it('has at least 180 questions overall', () => {
    const total = data.quizzes.reduce((sum, q) => sum + q.questions.length, 0);
    expect(total).toBeGreaterThanOrEqual(180);
  });

  it('every quiz and question has a difficulty', () => {
    for (const quiz of data.quizzes) {
      expect(quiz.difficulty).toMatch(/^(easy|medium|hard)$/);
      for (const q of quiz.questions) {
        expect(q.difficulty).toMatch(/^(easy|medium|hard)$/);
      }
    }
  });

  it('all questions have required fields', () => {
    for (const quiz of data.quizzes) {
      for (const q of quiz.questions) {
        expect(q.id).toBeDefined();
        expect(q.type).toMatch(/^(single|multiple)$/);
        expect(q.text).toHaveProperty('en');
        expect(q.text).toHaveProperty('fr');
        expect(q.answers).toBeInstanceOf(Array);
        expect(q.answers.length).toBeGreaterThan(0);
        expect(q.correctAnswers).toBeInstanceOf(Array);
      }
    }
  });

  it('all answers have id and localized text', () => {
    for (const quiz of data.quizzes) {
      for (const q of quiz.questions) {
        for (const a of q.answers) {
          expect(a.id).toBeDefined();
          expect(a.text).toHaveProperty('en');
          expect(a.text).toHaveProperty('fr');
        }
      }
    }
  });

  it('correct answers reference valid answer ids', () => {
    for (const quiz of data.quizzes) {
      for (const q of quiz.questions) {
        const answerIds = q.answers.map((a) => a.id);
        for (const ca of q.correctAnswers) {
          expect(answerIds).toContain(ca);
        }
      }
    }
  });

  it('quiz IDs are unique', () => {
    const ids = data.quizzes.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('question IDs are unique within each quiz', () => {
    for (const quiz of data.quizzes) {
      const ids = quiz.questions.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('all quizzes have localized title and description', () => {
    for (const quiz of data.quizzes) {
      expect(quiz.title).toHaveProperty('en');
      expect(quiz.title).toHaveProperty('fr');
      expect(quiz.description).toHaveProperty('en');
      expect(quiz.description).toHaveProperty('fr');
    }
  });

  it('single-choice questions have exactly 1 correct answer', () => {
    for (const quiz of data.quizzes) {
      for (const q of quiz.questions) {
        if (q.type === 'single') {
          expect(q.correctAnswers.length).toBe(1);
        }
      }
    }
  });

  it('multiple-choice questions have 1+ correct answers', () => {
    for (const quiz of data.quizzes) {
      for (const q of quiz.questions) {
        if (q.type === 'multiple') {
          expect(q.correctAnswers.length).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it.each(EXPECTED_QUIZ_IDS)('%s quiz exists with ≥20 questions', (id) => {
    const quiz = data.quizzes.find((q) => q.id === id);
    expect(quiz).toBeDefined();
    expect(quiz!.questions.length).toBeGreaterThanOrEqual(20);
  });
});
