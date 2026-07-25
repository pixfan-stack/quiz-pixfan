import type { HighScoreRecord } from '../types/quiz';
import { isDailyQuizId } from './dailyChallenge';
import type { DailyStreakState } from './dailyStreak';
import { isDuelQuizId } from './duel';
import { RANDOM_QUIZ_ID } from './randomQuiz';

const STORAGE_KEY = 'quiz-pixfan-achievements';

export const ACHIEVEMENT_IDS = [
  'first-finish',
  'daily-first',
  'streak-3',
  'streak-7',
  'perfect',
  'random-perfect',
  'expert-trio',
  'explorer',
  'duelist',
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
];

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

export interface AchievementEvalInput {
  quizId: string;
  percentage: number;
  /** Category quiz ids from questions.json (excludes special packs). */
  categoryQuizIds: string[];
  highscores: Record<string, HighScoreRecord>;
  streak: DailyStreakState;
}

function qualifies(id: AchievementId, input: AchievementEvalInput): boolean {
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
    case 'perfect':
      return percentage === 100;
    case 'random-perfect':
      return quizId === RANDOM_QUIZ_ID && percentage === 100;
    case 'expert-trio': {
      const expertCount = categoryQuizIds.filter(
        (id) => (highscores[id]?.percentage ?? 0) >= 80
      ).length;
      return expertCount >= 3;
    }
    case 'explorer':
      return categoryQuizIds.every((id) => highscores[id] != null);
    case 'duelist':
      return isDuelQuizId(quizId);
    default:
      return false;
  }
}

/**
 * Unlock any newly earned achievements. Returns only the newly unlocked ids.
 */
export function unlockAchievements(input: AchievementEvalInput): AchievementId[] {
  const unlocked = getUnlockedAchievements();
  const newly: AchievementId[] = [];

  for (const id of ACHIEVEMENT_IDS) {
    if (unlocked.has(id)) continue;
    if (!qualifies(id, input)) continue;
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
