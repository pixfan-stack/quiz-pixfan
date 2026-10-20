import { describe, it, expect, beforeEach } from 'vitest';
import {
  sanitizeDisplayName,
  MAX_DISPLAY_NAME_LENGTH,
  hasSeenNamePrompt,
  markNamePromptSeen,
} from '../utils/player';

describe('sanitizeDisplayName', () => {
  it('trims whitespace', () => {
    expect(sanitizeDisplayName('  Alice  ')).toBe('Alice');
  });

  it('collapses internal whitespace', () => {
    expect(sanitizeDisplayName('Alice   Bob')).toBe('Alice Bob');
  });

  it('removes control characters', () => {
    expect(sanitizeDisplayName('Al\u0000ice')).toBe('Alice');
  });

  it('caps length at MAX_DISPLAY_NAME_LENGTH', () => {
    const long = 'a'.repeat(MAX_DISPLAY_NAME_LENGTH + 10);
    expect(sanitizeDisplayName(long)).toHaveLength(MAX_DISPLAY_NAME_LENGTH);
  });

  it('returns empty string for whitespace-only input', () => {
    expect(sanitizeDisplayName('   \n\t  ')).toBe('');
  });
});

describe('name prompt seen flag', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts unseen and marks seen', () => {
    expect(hasSeenNamePrompt()).toBe(false);
    markNamePromptSeen();
    expect(hasSeenNamePrompt()).toBe(true);
  });
});
