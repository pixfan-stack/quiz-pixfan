/**
 * Habit-funnel markers stored in `quiz_attempts` as quiz_id `evt:{name}`
 * (same zeroed-metrics pattern as CTA clicks).
 */

export const HABIT_EVENTS = [
  'reminder_on',
  'reminder_off',
  'ics_download',
  'pwa_install',
  'account_create',
  'account_redeem',
  'weak_spots_cta',
] as const;

export type HabitEventName = (typeof HABIT_EVENTS)[number];

const HABIT_EVENT_SET = new Set<string>(HABIT_EVENTS);

/** Encode a habit event as a quiz_attempts quiz_id marker. */
export function habitEventQuizId(event: HabitEventName): string {
  return `evt:${event}`;
}

export function isHabitEventQuizId(quizId: string): boolean {
  return quizId.startsWith('evt:');
}

/** Parse `evt:{name}` — null if unknown or malformed. */
export function parseHabitEventQuizId(quizId: string): HabitEventName | null {
  if (!quizId.startsWith('evt:')) return null;
  const name = quizId.slice(4);
  if (!HABIT_EVENT_SET.has(name)) return null;
  return name as HabitEventName;
}

/** Play-mode buckets for admin attempt ventilation. */
export const ATTEMPT_MODES = [
  'photo-reading',
  'daily',
  'duel',
  'weak-spots',
  'packs',
] as const;

export type AttemptMode = (typeof ATTEMPT_MODES)[number];

/** Classify a real quiz_id (not cta:/evt:) into an admin mode bucket. */
export function classifyAttemptMode(quizId: string): AttemptMode {
  if (quizId === 'photo-reading') return 'photo-reading';
  if (quizId === 'weak-spots') return 'weak-spots';
  if (quizId.startsWith('daily-')) return 'daily';
  if (quizId.startsWith('duel-')) return 'duel';
  return 'packs';
}

export interface HabitEventCount {
  event: HabitEventName;
  count: number;
}

export interface AttemptModeCount {
  mode: AttemptMode;
  attempts: number;
}

/** Aggregate raw `evt:…` quiz_id counts for the admin panel. */
export function buildHabitEventCounts(
  rawRows: Array<{ quizId: string; count: number }>
): HabitEventCount[] {
  const map = new Map<HabitEventName, number>();
  for (const raw of rawRows) {
    const count = Number(raw.count) || 0;
    if (count <= 0) continue;
    const event = parseHabitEventQuizId(raw.quizId);
    if (!event) continue;
    map.set(event, (map.get(event) ?? 0) + count);
  }
  return HABIT_EVENTS.filter((e) => (map.get(e) ?? 0) > 0).map((event) => ({
    event,
    count: map.get(event) ?? 0,
  }));
}

/** Roll up per-quiz attempt rows into mode buckets. */
export function buildAttemptModeCounts(
  rawRows: Array<{ quizId: string; attempts: number }>
): AttemptModeCount[] {
  const map = new Map<AttemptMode, number>();
  for (const raw of rawRows) {
    const attempts = Number(raw.attempts) || 0;
    if (attempts <= 0) continue;
    if (raw.quizId.startsWith('cta:') || raw.quizId.startsWith('evt:')) continue;
    const mode = classifyAttemptMode(raw.quizId);
    map.set(mode, (map.get(mode) ?? 0) + attempts);
  }
  return ATTEMPT_MODES.filter((m) => (map.get(m) ?? 0) > 0).map((mode) => ({
    mode,
    attempts: map.get(mode) ?? 0,
  }));
}

/** CTA clicks / quiz attempts as a percentage (0–100). */
export function ctaConversionPct(
  ctaClicks: number,
  totalAttempts: number
): number {
  if (totalAttempts <= 0) return 0;
  return Math.round((1000 * ctaClicks) / totalAttempts) / 10;
}
