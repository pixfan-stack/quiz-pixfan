import { describe, expect, it } from 'vitest';
import { buildDailyChallengeIcs } from '../utils/dailyChallengeCalendar';

describe('dailyChallengeCalendar', () => {
  it('builds a recurring daily VEVENT with quiz URL', () => {
    const ics = buildDailyChallengeIcs({
      title: 'Quiz PixFan — Daily',
      description: 'Play today’s challenge',
      hour: 9,
      lang: 'en',
    });
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('RRULE:FREQ=DAILY');
    expect(ics).toMatch(/SUMMARY:Quiz PixFan/);
    expect(ics).toMatch(/#\/quiz\/daily-\d{4}-\d{2}-\d{2}/);
  });
});
