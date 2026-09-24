import type { HighScoreRecord } from '../types/quiz';
import { isDailyQuizId } from './dailyChallenge';
import { getDailyStreak, type DailyStreakState } from './dailyStreak';
import { isDuelQuizId } from './duel';
import { isPhotoReadingQuizId } from './photoReading';
import { RANDOM_QUIZ_ID } from './randomQuiz';

const STORAGE_KEY = 'quiz-pixfan-achievements';
const PHOTO_READING_PLAYS_KEY = 'quiz-pixfan-photo-reading-plays';
const VAULT_RESOLVED_KEY = 'quiz-pixfan-vault-resolved-total';

/** Completions of photo-reading required for photo-reader. */
export const PHOTO_READER_THRESHOLD = 3;
/** Lifetime vault resolutions required for vault-clear. */
export const VAULT_CLEAR_THRESHOLD = 10;

export const ACHIEVEMENT_IDS = [
  'first-finish',
  'daily-first',
  'streak-3',
  'streak-7',
  'streak-14',
  'perfect',
  'random-perfect',
  'expert-trio',
  'explorer',
  'duelist',
  'photo-reader',
  'vault-clear',
] as const;

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number];

export interface AchievementDef {
  id: AchievementId;
  /** i18n key under achievements.* */
  titleKey: string;
  descKey: string;
  icon: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first-finish',
    titleKey: 'achievements.firstFinish',
    descKey: 'achievements.firstFinishDesc',
    icon: '🏁',
  },
  {
    id: 'daily-first',
    titleKey: 'achievements.dailyFirst',
    descKey: 'achievements.dailyFirstDesc',
    icon: '🗓️',
  },
  {
    id: 'streak-3',
    titleKey: 'achievements.streak3',
    descKey: 'achievements.streak3Desc',
    icon: '🔥',
  },
  {
    id: 'streak-7',
    titleKey: 'achievements.streak7',
    descKey: 'achievements.streak7Desc',
    icon: '⚡',
  },
  {
    id: 'streak-14',
    titleKey: 'achievements.streak14',
    descKey: 'achievements.streak14Desc',
    icon: '🌟',
  },
  {
    id: 'perfect',
    titleKey: 'achievements.perfect',
    descKey: 'achievements.perfectDesc',
    icon: '💯',
  },
  {
    id: 'random-perfect',
    titleKey: 'achievements.randomPerfect',
    descKey: 'achievements.randomPerfectDesc',
    icon: '🎲',
  },
  {
    id: 'expert-trio',
    titleKey: 'achievements.expertTrio',
    descKey: 'achievements.expertTrioDesc',
    icon: '🎯',
  },
  {
    id: 'explorer',
    titleKey: 'achievements.explorer',
    descKey: 'achievements.explorerDesc',
    icon: '🧭',
  },
  {
    id: 'duelist',
    titleKey: 'achievements.duelist',
    descKey: 'achievements.duelistDesc',
    icon: '⚔️',
  },
  {
    id: 'photo-reader',
    titleKey: 'achievements.photoReader',
    descKey: 'achievements.photoReaderDesc',
    icon: '📷',
  },
  {
    id: 'vault-clear',
    titleKey: 'achievements.vaultClear',
    descKey: 'achievements.vaultClearDesc',
    icon: '🧹',
  },
];

function readCounter(key: string): number {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

function writeCounter(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(Math.max(0, Math.floor(value))));
  } catch {
    // ignore
  }
}

/** Local photo-reading completion count (for photo-reader). */
export function getPhotoReadingPlayCount(): number {
  return readCounter(PHOTO_READING_PLAYS_KEY);
}

/** Lifetime vault resolutions (for vault-clear). */
export function getVaultResolvedTotal(): number {
  return readCounter(VAULT_RESOLVED_KEY);
}

/**
 * Record a finished photo-reading run. Returns the new total.
 */
export function recordPhotoReadingPlay(): number {
  const next = getPhotoReadingPlayCount() + 1;
  writeCounter(PHOTO_READING_PLAYS_KEY, next);
  return next;
}

/**
 * Add resolved vault entries to the lifetime counter. Returns the new total.
 */
export function recordVaultResolutions(count: number): number {
  if (count <= 0) return getVaultResolvedTotal();
  const next = getVaultResolvedTotal() + count;
  writeCounter(VAULT_RESOLVED_KEY, next);
  return next;
}

export function getUnlockedAchievements(): Set<AchievementId> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const list = JSON.parse(raw) as string[];
    return new Set(
      list.filter((id): id is AchievementId =>
        (ACHIEVEMENT_IDS as readonly string[]).includes(id)
      )
    );
  } catch {
    return new Set();
  }
}

function writeUnlocked(ids: Set<AchievementId>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

/** Union remote achievement ids into local unlocks. */
export function mergeUnlockedAchievements(ids: AchievementId[]): void {
  if (!ids.length) return;
  const unlocked = getUnlockedAchievements();
  let changed = false;
  for (const id of ids) {
    if (!(ACHIEVEMENT_IDS as readonly string[]).includes(id)) continue;
    if (unlocked.has(id)) continue;
    unlocked.add(id);
    changed = true;
  }
  if (changed) writeUnlocked(unlocked);
}

export interface AchievementEvalInput {
  quizId: string;
  percentage: number;
  /** Category quiz ids from questions.json (excludes special packs). */
  categoryQuizIds: string[];
  highscores: Record<string, HighScoreRecord>;
  streak: DailyStreakState;
  /**
   * Vault entries cleared this result (from resolveCorrectAnswers).
   * Used to advance vault-clear progress.
   */
  vaultClearedThisRun?: number;
}

function qualifies(
  id: AchievementId,
  input: AchievementEvalInput,
  photoPlays: number,
  vaultResolved: number
): boolean {
  const { quizId, percentage, categoryQuizIds, highscores, streak } = input;

  switch (id) {
    case 'first-finish':
      return true;
    case 'daily-first':
      return isDailyQuizId(quizId);
    case 'streak-3':
      return streak.currentStreak >= 3 || streak.bestStreak >= 3;
    case 'streak-7':
      return streak.currentStreak >= 7 || streak.bestStreak >= 7;
    case 'streak-14':
      return streak.currentStreak >= 14 || streak.bestStreak >= 14;
    case 'perfect':
      return percentage === 100;
    case 'random-perfect':
      return quizId === RANDOM_QUIZ_ID && percentage === 100;
    case 'expert-trio': {
      const expertCount = categoryQuizIds.filter(
        (cid) => (highscores[cid]?.percentage ?? 0) >= 80
      ).length;
      return expertCount >= 3;
    }
    case 'explorer':
      return categoryQuizIds.every((cid) => highscores[cid] != null);
    case 'duelist':
      return isDuelQuizId(quizId);
    case 'photo-reader':
      return photoPlays >= PHOTO_READER_THRESHOLD;
    case 'vault-clear':
      return vaultResolved >= VAULT_CLEAR_THRESHOLD;
    default:
      return false;
  }
}

/**
 * Unlock any newly earned achievements. Returns only the newly unlocked ids.
 * Side effects: increments photo-reading / vault-resolved counters when applicable.
 */
export function unlockAchievements(input: AchievementEvalInput): AchievementId[] {
  const unlocked = getUnlockedAchievements();
  const newly: AchievementId[] = [];

  const photoPlays = isPhotoReadingQuizId(input.quizId)
    ? recordPhotoReadingPlay()
    : getPhotoReadingPlayCount();
  const vaultResolved = recordVaultResolutions(input.vaultClearedThisRun ?? 0);

  for (const id of ACHIEVEMENT_IDS) {
    if (unlocked.has(id)) continue;
    if (!qualifies(id, input, photoPlays, vaultResolved)) continue;
    unlocked.add(id);
    newly.push(id);
  }

  if (newly.length > 0) {
    writeUnlocked(unlocked);
  }
  return newly;
}

export function getAchievementDef(id: AchievementId): AchievementDef {
  return ACHIEVEMENTS.find((a) => a.id === id) ?? ACHIEVEMENTS[0]!;
}

export interface AchievementProgress {
  current: number;
  threshold: number;
}

const STREAK_THRESHOLDS: Partial<Record<AchievementId, number>> = {
  'streak-3': 3,
  'streak-7': 7,
  'streak-14': 14,
};

/**
 * Progress toward a threshold-based achievement (photo-reader, vault-clear, streaks).
 * Returns null for binary achievements.
 */
export function getAchievementProgress(
  id: AchievementId
): AchievementProgress | null {
  if (id === 'photo-reader') {
    return {
      current: Math.min(getPhotoReadingPlayCount(), PHOTO_READER_THRESHOLD),
      threshold: PHOTO_READER_THRESHOLD,
    };
  }
  if (id === 'vault-clear') {
    return {
      current: Math.min(getVaultResolvedTotal(), VAULT_CLEAR_THRESHOLD),
      threshold: VAULT_CLEAR_THRESHOLD,
    };
  }
  const streakThreshold = STREAK_THRESHOLDS[id];
  if (streakThreshold != null) {
    const streak = getDailyStreak();
    const best = Math.max(streak.currentStreak, streak.bestStreak);
    return {
      current: Math.min(best, streakThreshold),
      threshold: streakThreshold,
    };
  }
  return null;
}
