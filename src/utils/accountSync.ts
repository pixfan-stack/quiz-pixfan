/**
 * Light account sync client — recovery code + progress (streak / achievements / vault / season badges).
 * High scores live in D1 `player_highscores`; this pulls/merges them on redeem.
 */

import {
  ACHIEVEMENT_IDS,
  getUnlockedAchievements,
  mergeUnlockedAchievements,
  type AchievementId,
} from './achievements';
import {
  getDailyStreak,
  mergeDailyStreak,
  type DailyStreakState,
} from './dailyStreak';
import {
  getAllHighScores,
  mergeRemoteHighScores,
  type LocalHighScoreInput,
} from './highscore';
import {
  getMistakeVault,
  mergeRemoteMistakeVault,
  type MistakeVaultEntry,
} from './mistakeVault';
import {
  getPlayerDisplayName,
  getPlayerId,
  setPlayerDisplayName,
  setPlayerId,
} from './player';
import { isRemoteScoresEnabled } from './remoteScores';
import { normalizeRecoveryCode } from './recoveryCode';
import {
  getSeasonBadges,
  mergeRemoteSeasonBadges,
} from './seasonEngagement';

export interface SyncedStreak {
  lastDailyId: string | null;
  currentStreak: number;
  bestStreak: number;
  freezesAvailable: number;
  freezeWeekKey: string | null;
}

export interface AccountProgress {
  playerId: string;
  displayName: string | null;
  streak: SyncedStreak;
  achievements: string[];
  vault?: MistakeVaultEntry[];
  seasonBadges?: Record<string, 'participant'>;
  highscores: LocalHighScoreInput[];
  updatedAt?: string | null;
}

function toSyncedStreak(state: DailyStreakState): SyncedStreak {
  return {
    lastDailyId: state.lastDailyId,
    currentStreak: state.currentStreak,
    bestStreak: state.bestStreak,
    freezesAvailable: state.freezesAvailable,
    freezeWeekKey: state.freezeWeekKey,
  };
}

function localSyncPayload() {
  return {
    playerId: getPlayerId(),
    displayName: getPlayerDisplayName() || null,
    streak: toSyncedStreak(getDailyStreak()),
    achievements: [...getUnlockedAchievements()],
    vault: getMistakeVault(),
    seasonBadges: getSeasonBadges(),
  };
}

/** Push local streak + achievements + vault + season badges to D1 (merge-safe on server). */
export async function pushAccountProgress(): Promise<boolean> {
  if (!isRemoteScoresEnabled()) return false;
  try {
    const res = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync',
        ...localSyncPayload(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Create a recovery code (rotates any previous code for this player). */
export async function createRecoveryCode(): Promise<{
  ok: boolean;
  code?: string;
  expiresAt?: string;
  error?: string;
}> {
  if (!isRemoteScoresEnabled()) {
    return { ok: false, error: 'remote_disabled' };
  }
  try {
    // Push latest local progress before issuing the code
    await pushAccountProgress();

    const res = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_code',
        ...localSyncPayload(),
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      code?: string;
      expiresAt?: string;
      error?: string;
    };
    if (!res.ok || !data.code) {
      if (res.status === 429) return { ok: false, error: 'rate_limited' };
      return { ok: false, error: data.error ?? 'create_failed' };
    }
    return { ok: true, code: data.code, expiresAt: data.expiresAt };
  } catch {
    return { ok: false, error: 'network' };
  }
}

function applyProgressLocally(progress: AccountProgress): void {
  setPlayerId(progress.playerId);
  if (progress.displayName) {
    setPlayerDisplayName(progress.displayName);
  }

  const achievementIds = progress.achievements.filter((id): id is AchievementId =>
    (ACHIEVEMENT_IDS as readonly string[]).includes(id)
  );
  mergeUnlockedAchievements(achievementIds);
  mergeDailyStreak(progress.streak);
  mergeRemoteHighScores(progress.highscores ?? []);
  mergeRemoteMistakeVault(progress.vault ?? []);
  mergeRemoteSeasonBadges(progress.seasonBadges ?? {});
}

/** Redeem a recovery code / magic-link token and merge progress into this browser. */
export async function redeemRecoveryCode(rawCode: string): Promise<{
  ok: boolean;
  progress?: AccountProgress;
  error?: string;
}> {
  if (!isRemoteScoresEnabled()) {
    return { ok: false, error: 'remote_disabled' };
  }
  const code = normalizeRecoveryCode(rawCode);
  if (!code) {
    return { ok: false, error: 'invalid_code' };
  }

  try {
    const res = await fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'redeem', code }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      progress?: AccountProgress;
      error?: string;
    };
    if (!res.ok || !data.progress?.playerId) {
      if (res.status === 429) return { ok: false, error: 'rate_limited' };
      if (res.status === 404) return { ok: false, error: 'unknown_code' };
      if (res.status === 410) return { ok: false, error: 'expired_code' };
      return { ok: false, error: data.error ?? 'redeem_failed' };
    }

    applyProgressLocally(data.progress);

    // Push any local extras that beat remote (merge-safe)
    await pushAccountProgress();

    // Also re-submit local high scores that might beat remote all-time
    const displayName =
      getPlayerDisplayName() ||
      data.progress.displayName ||
      `Player-${getPlayerId().slice(0, 6)}`;
    const local = getAllHighScores();
    for (const record of Object.values(local)) {
      void fetch('/api/highscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: record.quizId,
          playerId: getPlayerId(),
          displayName,
          percentage: record.percentage,
          correctCount: record.correctCount,
          totalQuestions: record.totalQuestions,
        }),
      }).catch(() => {});
    }

    return { ok: true, progress: data.progress };
  } catch {
    return { ok: false, error: 'network' };
  }
}

/** Pull remote progress for the current playerId and merge locally. */
export async function pullAndMergeAccountProgress(): Promise<boolean> {
  if (!isRemoteScoresEnabled()) return false;
  try {
    const playerId = getPlayerId();
    const res = await fetch(
      `/api/account?playerId=${encodeURIComponent(playerId)}`
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { progress?: AccountProgress };
    if (!data.progress) return false;

    const achievementIds = (data.progress.achievements ?? []).filter(
      (id): id is AchievementId =>
        (ACHIEVEMENT_IDS as readonly string[]).includes(id)
    );
    mergeUnlockedAchievements(achievementIds);
    mergeDailyStreak(data.progress.streak);
    mergeRemoteHighScores(data.progress.highscores ?? []);
    mergeRemoteMistakeVault(data.progress.vault ?? []);
    mergeRemoteSeasonBadges(data.progress.seasonBadges ?? {});
    if (data.progress.displayName && !getPlayerDisplayName()) {
      setPlayerDisplayName(data.progress.displayName);
    }
    return true;
  } catch {
    return false;
  }
}
