import type { Question } from '../types/quiz';

/**
 * Compare selected answer IDs against the correct set.
 * Order does not matter. For single-choice there is exactly one correct id.
 */
export function isAnswerCorrect(
  question: Question,
  selectedIds: string[]
): boolean {
  const correct = new Set(question.correctAnswers);
  const selected = new Set(selectedIds);

  if (correct.size !== selected.size) return false;
  for (const id of correct) {
    if (!selected.has(id)) return false;
  }
  return true;
}

/** True if the user selected at least one correct answer but not the full set. */
export function isPartiallyCorrect(
  question: Question,
  selectedIds: string[]
): boolean {
  if (question.type !== 'multiple') return false;
  if (isAnswerCorrect(question, selectedIds)) return false;
  if (selectedIds.length === 0) return false;

  const correct = new Set(question.correctAnswers);
  const hasCorrect = selectedIds.some((id) => correct.has(id));
  const hasWrong = selectedIds.some((id) => !correct.has(id));
  // Partial = some correct, no wrong extras, but incomplete
  return hasCorrect && !hasWrong;
}

export function computePercentage(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Performance message key suffix based on percentage.
 * Maps to result.message_* keys in translation files.
 */
export function getPerformanceMessageKey(
  percentage: number
): 'perfect' | 'great' | 'good' | 'ok' | 'low' {
  if (percentage === 100) return 'perfect';
  if (percentage >= 80) return 'great';
  if (percentage >= 60) return 'good';
  if (percentage >= 40) return 'ok';
  return 'low';
}
