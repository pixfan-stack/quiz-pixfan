import { describe, it, expect } from 'vitest';
import questionsData from '../data/questions.json';
import type { QuizzesData, Quiz } from '../types/quiz';

describe('questions.json', () => {
  const data = questionsData as QuizzesData;

  it('has exactly 6 quizzes', () => {
    expect(data.quizzes.length).toBe(6);
  });

  it('has exactly 20 questions per quiz', () => {
    for (const quiz of data.quizzes) {
      expect(quiz.questions.length).toBe(20);
    }
  });

  it('has total of 120 questions', () => {
    const total = data.quizzes.reduce((sum, q) => sum + q.questions.length, 0);
    expect(total).toBe(120);
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
    const quiz = data.quizzes.find((q) => q.id === 'exposure-basics');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('composition quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q) => q.id === 'composition');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('light-color quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q) => q.id === 'light-color');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('gear-lenses quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q) => q.id === 'gear-lenses');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('history-icons quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q) => q.id === 'history-icons');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });

  it('genres quiz exists and has 20 questions', () => {
    const quiz = data.quizzes.find((q) => q.id === 'genres');
    expect(quiz).toBeDefined();
    expect(quiz?.questions.length).toBe(20);
  });
});
