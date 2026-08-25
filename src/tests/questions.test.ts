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
        imageUrl?: string;
        imageCredit?: { en: string; fr: string };
      }>;
    }>;
  };

  const EXPECTED_QUIZ_IDS = [
    'exposure-basics',
    'composition',
    'light-color',
    'gear-lenses',
    'history-icons',
    'public-domain',
    'genres',
    'smartphone',
    'photo-rights',
    'retouching',
  ] as const;

  it('has exactly 10 category quizzes', () => {
    expect(data.quizzes.length).toBe(10);
  });

  it('keeps a solid question count per quiz', () => {
    for (const quiz of data.quizzes) {
      const min = quiz.id === 'public-domain' ? 18 : 20;
      expect(quiz.questions.length).toBeGreaterThanOrEqual(min);
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
          expect(q.correctAnswers.length).toBeLessThan(q.answers.length);
        }
      }
    }
  });

  it('comp-20 is single with all-of-the-above; hist-20 is not all-correct', () => {
    const composition = data.quizzes.find((q) => q.id === 'composition');
    const history = data.quizzes.find((q) => q.id === 'history-icons');
    const comp20 = composition?.questions.find((q) => q.id === 'comp-20');
    const hist20 = history?.questions.find((q) => q.id === 'hist-20');
    expect(comp20?.type).toBe('single');
    expect(comp20?.correctAnswers).toEqual(['d']);
    expect(hist20?.type).toBe('multiple');
    expect(hist20?.correctAnswers.sort()).toEqual(['a', 'b', 'c']);
    expect(hist20?.correctAnswers.length).toBeLessThan(hist20!.answers.length);
  });

  it('single-choice correct answers are not stuck in first display slot', () => {
    let first = 0;
    let total = 0;
    for (const quiz of data.quizzes) {
      for (const q of quiz.questions) {
        if (q.type !== 'single' || q.correctAnswers.length !== 1) continue;
        total += 1;
        if (q.answers[0]?.id === q.correctAnswers[0]) first += 1;
      }
    }
    expect(total).toBeGreaterThan(100);
    // Authoring bias was ~77% on first slot; after shuffle expect < 40%.
    expect(first / total).toBeLessThan(0.4);
  });

  it.each(EXPECTED_QUIZ_IDS)('%s quiz exists with enough questions', (id) => {
    const quiz = data.quizzes.find((q) => q.id === id);
    expect(quiz).toBeDefined();
    const min = id === 'public-domain' ? 18 : 20;
    expect(quiz!.questions.length).toBeGreaterThanOrEqual(min);
  });

  it('public-domain quiz uses local images with credits', () => {
    const quiz = data.quizzes.find((q) => q.id === 'public-domain');
    expect(quiz).toBeDefined();
    for (const q of quiz!.questions) {
      expect(q.imageUrl).toMatch(/^\/images\/public-domain\/.+\.avif$/);
      expect(q.imageCredit?.en).toBeTruthy();
      expect(q.imageCredit?.fr).toBeTruthy();
    }
  });
});
