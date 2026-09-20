/**
 * Runtime validation for quizzes JSON (admin import / content checks).
 * Lightweight structural schema — no Zod dependency.
 */

import type {
  Answer,
  Difficulty,
  LocalizedString,
  Question,
  QuestionType,
  Quiz,
  QuizzesData,
} from '../types/quiz';

export interface QuizzesSchemaIssue {
  path: string;
  message: string;
}

export type QuizzesValidationResult =
  | { ok: true; data: QuizzesData }
  | { ok: false; issues: QuizzesSchemaIssue[] };

const DIFFICULTIES = new Set<Difficulty>(['easy', 'medium', 'hard']);
const QUESTION_TYPES = new Set<QuestionType>(['single', 'multiple']);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateLocalized(
  value: unknown,
  path: string,
  issues: QuizzesSchemaIssue[],
  required = true
): value is LocalizedString {
  if (value == null) {
    if (required) {
      issues.push({ path, message: 'missing localized string' });
    }
    return false;
  }
  if (!isPlainObject(value)) {
    issues.push({ path, message: 'expected { en, fr } object' });
    return false;
  }
  let ok = true;
  if (!isNonEmptyString(value.en)) {
    issues.push({ path: `${path}.en`, message: 'non-empty string required' });
    ok = false;
  }
  if (!isNonEmptyString(value.fr)) {
    issues.push({ path: `${path}.fr`, message: 'non-empty string required' });
    ok = false;
  }
  return ok;
}

function validateDifficulty(
  value: unknown,
  path: string,
  issues: QuizzesSchemaIssue[],
  optional = true
): boolean {
  if (value == null) return optional;
  if (typeof value !== 'string' || !DIFFICULTIES.has(value as Difficulty)) {
    issues.push({
      path,
      message: 'must be "easy" | "medium" | "hard"',
    });
    return false;
  }
  return true;
}

function validateAnswer(
  value: unknown,
  path: string,
  issues: QuizzesSchemaIssue[]
): value is Answer {
  if (!isPlainObject(value)) {
    issues.push({ path, message: 'expected answer object' });
    return false;
  }
  let ok = true;
  if (!isNonEmptyString(value.id)) {
    issues.push({ path: `${path}.id`, message: 'non-empty string required' });
    ok = false;
  }
  if (!validateLocalized(value.text, `${path}.text`, issues)) ok = false;
  return ok;
}

function validateQuestion(
  value: unknown,
  path: string,
  issues: QuizzesSchemaIssue[]
): value is Question {
  if (!isPlainObject(value)) {
    issues.push({ path, message: 'expected question object' });
    return false;
  }

  let ok = true;
  if (!isNonEmptyString(value.id)) {
    issues.push({ path: `${path}.id`, message: 'non-empty string required' });
    ok = false;
  }
  if (
    typeof value.type !== 'string' ||
    !QUESTION_TYPES.has(value.type as QuestionType)
  ) {
    issues.push({
      path: `${path}.type`,
      message: 'must be "single" | "multiple"',
    });
    ok = false;
  }
  if (!validateLocalized(value.text, `${path}.text`, issues)) ok = false;

  if (!Array.isArray(value.answers) || value.answers.length === 0) {
    issues.push({
      path: `${path}.answers`,
      message: 'at least one answer required',
    });
    ok = false;
  } else {
    const answerIds = new Set<string>();
    value.answers.forEach((answer, i) => {
      if (!validateAnswer(answer, `${path}.answers[${i}]`, issues)) {
        ok = false;
        return;
      }
      if (answerIds.has(answer.id)) {
        issues.push({
          path: `${path}.answers[${i}].id`,
          message: `duplicate answer id "${answer.id}"`,
        });
        ok = false;
      }
      answerIds.add(answer.id);
    });

    if (!Array.isArray(value.correctAnswers) || value.correctAnswers.length === 0) {
      issues.push({
        path: `${path}.correctAnswers`,
        message: 'at least one correct answer id required',
      });
      ok = false;
    } else {
      for (let i = 0; i < value.correctAnswers.length; i++) {
        const id = value.correctAnswers[i];
        if (typeof id !== 'string' || !answerIds.has(id)) {
          issues.push({
            path: `${path}.correctAnswers[${i}]`,
            message: 'must reference an answer id in this question',
          });
          ok = false;
        }
      }
      if (
        value.type === 'single' &&
        Array.isArray(value.correctAnswers) &&
        value.correctAnswers.length !== 1
      ) {
        issues.push({
          path: `${path}.correctAnswers`,
          message: 'single-choice questions need exactly one correct answer',
        });
        ok = false;
      }
    }
  }

  if (value.explanation != null) {
    if (!validateLocalized(value.explanation, `${path}.explanation`, issues, true)) {
      ok = false;
    }
  }
  if (value.imageUrl != null && typeof value.imageUrl !== 'string') {
    issues.push({ path: `${path}.imageUrl`, message: 'must be a string URL' });
    ok = false;
  }
  if (value.imageAlt != null) {
    if (!validateLocalized(value.imageAlt, `${path}.imageAlt`, issues, true)) {
      ok = false;
    }
  }
  if (value.imageCredit != null) {
    if (
      !validateLocalized(value.imageCredit, `${path}.imageCredit`, issues, true)
    ) {
      ok = false;
    }
  }
  if (!validateDifficulty(value.difficulty, `${path}.difficulty`, issues)) {
    ok = false;
  }

  return ok;
}

function validateQuiz(
  value: unknown,
  path: string,
  issues: QuizzesSchemaIssue[]
): value is Quiz {
  if (!isPlainObject(value)) {
    issues.push({ path, message: 'expected quiz object' });
    return false;
  }

  let ok = true;
  if (!isNonEmptyString(value.id)) {
    issues.push({ path: `${path}.id`, message: 'non-empty string required' });
    ok = false;
  }
  if (!validateLocalized(value.title, `${path}.title`, issues)) ok = false;
  if (!validateLocalized(value.description, `${path}.description`, issues)) {
    ok = false;
  }
  if (!validateDifficulty(value.difficulty, `${path}.difficulty`, issues)) {
    ok = false;
  }

  if (!Array.isArray(value.questions) || value.questions.length === 0) {
    issues.push({
      path: `${path}.questions`,
      message: 'at least one question required',
    });
    ok = false;
  } else {
    const questionIds = new Set<string>();
    value.questions.forEach((question, i) => {
      if (!validateQuestion(question, `${path}.questions[${i}]`, issues)) {
        ok = false;
        return;
      }
      if (questionIds.has(question.id)) {
        issues.push({
          path: `${path}.questions[${i}].id`,
          message: `duplicate question id "${question.id}"`,
        });
        ok = false;
      }
      questionIds.add(question.id);
    });
  }

  return ok;
}

/** Validate a parsed JSON value as QuizzesData. */
export function validateQuizzesData(raw: unknown): QuizzesValidationResult {
  const issues: QuizzesSchemaIssue[] = [];

  if (!isPlainObject(raw)) {
    return {
      ok: false,
      issues: [{ path: '', message: 'root must be an object with "quizzes"' }],
    };
  }

  if (!Array.isArray(raw.quizzes)) {
    return {
      ok: false,
      issues: [{ path: 'quizzes', message: 'must be an array' }],
    };
  }

  if (raw.quizzes.length === 0) {
    issues.push({ path: 'quizzes', message: 'at least one quiz required' });
  }

  const quizIds = new Set<string>();
  raw.quizzes.forEach((quiz, i) => {
    if (!validateQuiz(quiz, `quizzes[${i}]`, issues)) return;
    if (quizIds.has(quiz.id)) {
      issues.push({
        path: `quizzes[${i}].id`,
        message: `duplicate quiz id "${quiz.id}"`,
      });
    }
    quizIds.add(quiz.id);
  });

  if (issues.length > 0) {
    return { ok: false, issues };
  }

  return { ok: true, data: raw as QuizzesData };
}

/** Parse a JSON string and validate as QuizzesData. */
export function parseAndValidateQuizzesJson(
  text: string
): QuizzesValidationResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text) as unknown;
  } catch {
    return {
      ok: false,
      issues: [{ path: '', message: 'invalid JSON' }],
    };
  }
  return validateQuizzesData(raw);
}
