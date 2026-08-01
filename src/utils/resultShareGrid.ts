/**
 * Wordle-style emoji grids for shareable quiz results.
 */

/** Build a compact emoji grid from per-question correctness marks. */
export function formatResultShareGrid(
  marks: boolean[],
  columns = 5
): string {
  if (marks.length === 0) return '';
  const cells = marks.map((ok) => (ok ? '🟩' : '🟥'));
  const rows: string[] = [];
  for (let i = 0; i < cells.length; i += columns) {
    rows.push(cells.slice(i, i + columns).join(''));
  }
  return rows.join('\n');
}

/** Full clipboard block for the daily challenge (title + score + grid + url). */
export function buildDailyResultShareBlock(opts: {
  dateLabel: string;
  percent: number;
  marks: boolean[];
  url: string;
  lang: 'en' | 'fr';
}): string {
  const grid = formatResultShareGrid(opts.marks);
  const headline =
    opts.lang === 'fr'
      ? `Quiz PixFan — Défi du jour ${opts.dateLabel}`
      : `Quiz PixFan — Daily ${opts.dateLabel}`;
  const scoreLine =
    opts.lang === 'fr'
      ? `${opts.percent} %`
      : `${opts.percent}%`;
  return [headline, scoreLine, grid, '', opts.url].filter(Boolean).join('\n');
}
