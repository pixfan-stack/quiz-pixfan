import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Quiz, QuizResult } from '../types/quiz';
import { exportResultAsImage } from '../utils/exportResult';

const quiz: Quiz = {
  id: 'composition',
  title: { en: 'Composition', fr: 'Composition' },
  description: { en: '', fr: '' },
  questions: [],
};

const result: QuizResult = {
  quizId: 'composition',
  correctCount: 16,
  totalQuestions: 20,
  percentage: 80,
  timeTakenSeconds: 42,
  maxStreak: 5,
  isNewHighScore: true,
  previousBest: 70,
  mistakes: [],
};

describe('exportResult', () => {
  beforeEach(() => {
    class FakeCtx {
      fillStyle = '';
      strokeStyle = '';
      lineWidth = 0;
      lineCap = '';
      font = '';
      textAlign = '';
      textBaseline = '';
      createLinearGradient() {
        return { addColorStop() {} };
      }
      createRadialGradient() {
        return { addColorStop() {} };
      }
      fillRect() {}
      beginPath() {}
      arc() {}
      stroke() {}
      fillText() {}
      measureText(text: string) {
        return { width: text.length * 10 };
      }
    }

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      new FakeCtx() as unknown as CanvasRenderingContext2D
    );
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(
      function (this: HTMLCanvasElement, cb: BlobCallback) {
        cb(new Blob(['png'], { type: 'image/png' }));
      }
    );
  });

  it('exports a square image blob', async () => {
    const blob = await exportResultAsImage(result, quiz, 'en', 'square');
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/png');
  });

  it('exports a story-format image blob', async () => {
    const blob = await exportResultAsImage(result, quiz, 'fr', 'story');
    expect(blob).toBeInstanceOf(Blob);
  });

  it('exports a daily-challenge result image', async () => {
    const dailyResult: QuizResult = {
      ...result,
      quizId: 'daily-2026-07-25',
    };
    const dailyQuiz: Quiz = {
      ...quiz,
      id: 'daily-2026-07-25',
      title: { en: 'Daily challenge', fr: 'Défi du jour' },
    };
    const blob = await exportResultAsImage(dailyResult, dailyQuiz, 'en', 'square');
    expect(blob).toBeInstanceOf(Blob);
  });
});
