export type DuelOutcome = 'win' | 'lose' | 'tie';

/** Compare your score to the challenger's target percentage. */
export function compareDuelScores(
  myPercentage: number,
  targetPercentage: number
): DuelOutcome {
  if (myPercentage > targetPercentage) return 'win';
  if (myPercentage < targetPercentage) return 'lose';
  return 'tie';
}

export function clampScore(value: number): number {
  return Math.round(Math.min(100, Math.max(0, value)));
}

export function parseScoreParam(raw: string | null | undefined): number | null {
  if (raw == null || raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) return null;
  return clampScore(n);
}
