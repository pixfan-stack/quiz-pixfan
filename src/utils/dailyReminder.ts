/**
 * Soft local daily-challenge reminders for installed PWAs.
 * Uses Notification API + service worker showNotification — no push server.
 */

import { trackHabitEvent } from './analyticsApi';
import { hasPlayedDailyToday, isStandalonePwa } from './reengage';

const ENABLED_KEY = 'quiz-pixfan-daily-reminder';
const LAST_SHOWN_KEY = 'quiz-pixfan-daily-reminder-shown';
const PROMPT_DISMISS_KEY = 'quiz-pixfan-reminder-prompt-day';

export function isDailyReminderEnabled(): boolean {
  try {
    return localStorage.getItem(ENABLED_KEY) === '1';
  } catch {
    return false;
  }
}

export function setDailyReminderEnabled(enabled: boolean): void {
  const prev = isDailyReminderEnabled();
  try {
    if (enabled) localStorage.setItem(ENABLED_KEY, '1');
    else localStorage.removeItem(ENABLED_KEY);
  } catch {
    // ignore
  }
  if (prev !== enabled) {
    void trackHabitEvent(enabled ? 'reminder_on' : 'reminder_off');
  }
}

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

function utcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Soft post-daily prompt: offer local reminder + .ics when reminder is off
 * and the banner was not dismissed for the UTC day.
 */
export function shouldShowDailyReminderPrompt(): boolean {
  if (isDailyReminderEnabled()) return false;
  try {
    return localStorage.getItem(PROMPT_DISMISS_KEY) !== utcDayKey();
  } catch {
    return true;
  }
}

export function dismissDailyReminderPrompt(now = new Date()): void {
  try {
    localStorage.setItem(PROMPT_DISMISS_KEY, utcDayKey(now));
  } catch {
    // ignore
  }
}

export async function requestDailyReminderPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  const result = await Notification.requestPermission();
  const ok = result === 'granted';
  setDailyReminderEnabled(ok);
  return ok;
}

function alreadyShownToday(): boolean {
  try {
    return localStorage.getItem(LAST_SHOWN_KEY) === utcDayKey();
  } catch {
    return false;
  }
}

function markShownToday(): void {
  try {
    localStorage.setItem(LAST_SHOWN_KEY, utcDayKey());
  } catch {
    // ignore
  }
}

/** Show a one-shot local notification if conditions match. */
export async function maybeNotifyDailyReminder(opts: {
  title: string;
  body: string;
  dailyQuizId: string;
}): Promise<boolean> {
  if (!isDailyReminderEnabled()) return false;
  if (!notificationsSupported() || Notification.permission !== 'granted') {
    return false;
  }
  // Avoid nagging while the tab is already open and focused (unless PWA).
  if (!isStandalonePwa() && document.visibilityState === 'visible') {
    return false;
  }
  if (hasPlayedDailyToday()) return false;
  if (alreadyShownToday()) return false;

  let shown = false;
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(opts.title, {
        body: opts.body,
        icon: '/icon-192.png',
        badge: '/favicon.png',
        tag: 'quiz-pixfan-daily',
        data: { url: `/#/quiz/${opts.dailyQuizId}` },
      });
      shown = true;
    } catch {
      shown = false;
    }
  }

  if (!shown) {
    try {
      new Notification(opts.title, {
        body: opts.body,
        icon: '/icon-192.png',
        tag: 'quiz-pixfan-daily',
      });
      shown = true;
    } catch {
      return false;
    }
  }

  markShownToday();
  return true;
}
