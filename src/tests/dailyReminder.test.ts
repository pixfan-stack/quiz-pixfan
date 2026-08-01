import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isDailyReminderEnabled,
  maybeNotifyDailyReminder,
  setDailyReminderEnabled,
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
});
