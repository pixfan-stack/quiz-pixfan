/**
 * Build / download a recurring .ics reminder for the daily challenge.
 */

import { APP_SHARE_URL } from './share';
import { getDailyQuizId } from './dailyChallenge';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Local calendar date as YYYYMMDD. */
function localYmd(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

/** Fold long ICS lines (RFC 5545). */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return parts.join('\r\n');
}

export function buildDailyChallengeIcs(opts: {
  title: string;
  description: string;
  /** Hour in local time (0–23). Default 9. */
  hour?: number;
  lang?: 'en' | 'fr';
}): string {
  const hour = opts.hour ?? 9;
  const start = new Date();
  start.setHours(hour, 0, 0, 0);
  if (start.getTime() < Date.now()) {
    start.setDate(start.getDate() + 1);
  }
  const end = new Date(start.getTime() + 15 * 60 * 1000);
  const stamp = new Date();
  const stampUtc = `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`;
  const dtStart = `${localYmd(start)}T${pad(hour)}0000`;
  const dtEnd = `${localYmd(end)}T${pad(end.getHours())}${pad(end.getMinutes())}00`;
  const url = `${APP_SHARE_URL.replace(/\/$/, '')}/#/quiz/${getDailyQuizId()}`;
  const uid = `daily-challenge@quiz.pixfan.fr`;
  const desc = `${opts.description}\\n${url}`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Quiz PixFan//Daily Challenge//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stampUtc}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'RRULE:FREQ=DAILY',
    fold(`SUMMARY:${opts.title}`),
    fold(`DESCRIPTION:${desc}`),
    fold(`URL:${url}`),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return `${lines.join('\r\n')}\r\n`;
}

export function downloadDailyChallengeIcs(opts: {
  title: string;
  description: string;
  hour?: number;
  lang?: 'en' | 'fr';
}): void {
  const ics = buildDailyChallengeIcs(opts);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = 'quiz-pixfan-daily-challenge.ics';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}
