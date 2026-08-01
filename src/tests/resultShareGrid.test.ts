import { describe, it, expect } from 'vitest';
import {
  buildDailyResultShareBlock,
  formatResultShareGrid,
} from '../utils/resultShareGrid';

describe('resultShareGrid', () => {
  it('formats a 5-column emoji grid', () => {
    const marks = [true, false, true, true, false, true, false, true, true, true];
    expect(formatResultShareGrid(marks)).toBe('🟩🟥🟩🟩🟥\n🟩🟥🟩🟩🟩');
  });

  it('builds a daily clipboard block', () => {
    const block = buildDailyResultShareBlock({
      dateLabel: '2026-08-01',
      percent: 80,
      marks: [true, true, false, true, true],
      url: 'https://quiz.pixfan.fr/s/daily-2026-08-01',
      lang: 'en',
    });
    expect(block).toContain('Daily 2026-08-01');
    expect(block).toContain('80%');
    expect(block).toContain('🟩🟩🟥🟩🟩');
    expect(block).toContain('https://quiz.pixfan.fr/s/daily-2026-08-01');
  });
});
