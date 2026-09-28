import { describe, expect, it } from 'vitest';
import questionsData from '../../public/data/questions.json';
import { SCOLAIRES_PARCOURS } from '../utils/scolaires';
import { HABIT_EVENTS } from '../utils/habitAnalytics';

const data = questionsData as {
  quizzes: Array<{
    id: string;
    tags?: string[];
    questions: Array<{ id: string; imageUrl?: string }>;
  }>;
};

describe('scolaires P2 lycée & lexique', () => {
  it('ships lycee-pratique parcours starting on portrait-light', () => {
    const lycee = SCOLAIRES_PARCOURS.find((p) => p.id === 'lycee-pratique');
    expect(lycee).toEqual({
      id: 'lycee-pratique',
      event: 'scolaires_parcours_lycee_pratique',
      startQuizId: 'portrait-light',
      minutes: 30,
    });
    expect(HABIT_EVENTS).toContain('scolaires_parcours_lycee_pratique');
  });

  it('tags lycée packs portrait / flash / retouche', () => {
    for (const id of ['portrait-light', 'flash-studio', 'retouching'] as const) {
      const quiz = data.quizzes.find((q) => q.id === id);
      expect(quiz?.tags).toEqual(expect.arrayContaining(['scolaires', 'lycee']));
    }
  });

  it('ships original lexique pack ≤15 Q with no risky images', () => {
    const lexique = data.quizzes.find((q) => q.id === 'lexique-image-fixe');
    expect(lexique).toBeDefined();
    expect(lexique!.questions.length).toBeGreaterThanOrEqual(10);
    expect(lexique!.questions.length).toBeLessThanOrEqual(15);
    expect(lexique!.tags).toEqual(expect.arrayContaining(['scolaires', 'lycee']));
    for (const q of lexique!.questions) {
      expect(q.imageUrl).toBeUndefined();
    }
  });
});
