import { describe, it, expect } from 'vitest';
import questionsData from '../../public/data/questions.json';

describe('questions.json', () => {
  const data = questionsData as any;

  it('has exactly 7 quizzes', () => {
    expect(data.quizzes.length).toBe(7);
  });

  it('has exactly 20 questions per quiz', () => {
    for (const quiz of data.quizzes) {
      expect(quiz.questions.length).toBe(20);
    }
  });

  it('has total of 140 questions', () => {
    const total = data.quizzes.reduce((sum: number, q: any) => sum + q.questions.length, 0);
    expect(total).toBe(140);
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
        const answerIds = q.answers.map((a: any) => a.id);
        for (const ca of q.correctAnswers) {
          expect(answerIds).toContain(ca);
        }
      }
    }
  });

  it('quiz IDs are unique', () => {
    const ids = data.quizzes.map((q: any) => q.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
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

  it('exposure-basics quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q: any) => q.id === 'exposure-basics');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('composition quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q: any) => q.id === 'composition');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('light-color quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q: any) => q.id === 'light-color');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('gear-lenses quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q: any) => q.id === 'gear-lenses');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('history-icons quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q: any) => q.id === 'history-icons');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('genres quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q: any) => q.id === 'genres');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('smartphone quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q: any) => q.id === 'smartphone');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });
});
