import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  dismissDailyReminderPrompt,
  isDailyReminderEnabled,
  maybeNotifyDailyReminder,
  setDailyReminderEnabled,
  shouldShowDailyReminderPrompt,
} from '../utils/dailyReminder';

describe('dailyReminder', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('persists enabled flag', () => {
    expect(isDailyReminderEnabled()).toBe(false);
    setDailyReminderEnabled(true);
    expect(isDailyReminderEnabled()).toBe(true);
    setDailyReminderEnabled(false);
    expect(isDailyReminderEnabled()).toBe(false);
  });

  it('skips notify when disabled', async () => {
    const shown = await maybeNotifyDailyReminder({
      title: 't',
      body: 'b',
      dailyQuizId: 'daily-2026-07-25',
    });
    expect(shown).toBe(false);
  });

  it('shows post-daily reminder prompt when reminder is off', () => {
    expect(shouldShowDailyReminderPrompt()).toBe(true);
    setDailyReminderEnabled(true);
    expect(shouldShowDailyReminderPrompt()).toBe(false);
  });

  it('hides reminder prompt after dismiss for the day', () => {
    dismissDailyReminderPrompt(new Date('2026-09-24T12:00:00Z'));
    expect(shouldShowDailyReminderPrompt()).toBe(false);
  });
});
