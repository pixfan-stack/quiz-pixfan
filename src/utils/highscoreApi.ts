/**
 * Backend-enabled high-score client for Cloudflare Pages Functions + D1.
 */

import { getPlayerId } from './player';
import { isRemoteScoresEnabled } from './remoteScores';

export interface LeaderboardEntry {
  quizId: string;
  playerId: string;
  displayName: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string;
}

export interface LeaderboardViewer {
  rank: number;
  entry: LeaderboardEntry;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  total: number;
  viewer?: LeaderboardViewer | null;
}

interface FetchLeaderboardParams {
  limit?: number;
  quizId?: string;
  playerId?: string;
}

export async function fetchRemoteHighScore(
  quizId: string
): Promise<LeaderboardEntry | null> {
  if (!isRemoteScoresEnabled()) return null;
  try {
    const playerId = getPlayerId();
    const res = await fetch(
      `/api/highscore?quizId=${encodeURIComponent(quizId)}&playerId=${encodeURIComponent(playerId)}`
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { score: LeaderboardEntry | null };
    return data.score;
  } catch {
    return null;
  }
}

export async function submitRemoteHighScore(payload: {
  quizId: string;
  playerId: string;
  displayName: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
}): Promise<boolean> {
  if (!isRemoteScoresEnabled()) return false;
  try {
    const res = await fetch('/api/highscore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchLeaderboard(
  params: FetchLeaderboardParams = {}
): Promise<LeaderboardResponse> {
  if (!isRemoteScoresEnabled()) {
    return { leaderboard: [], total: 0, viewer: null };
  }
  try {
    const { limit = 10, quizId, playerId = getPlayerId() } = params;
    const url = new URL('/api/leaderboard', window.location.origin);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('playerId', playerId);
    if (quizId) {
      url.searchParams.set('quizId', quizId);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      return { leaderboard: [], total: 0, viewer: null };
    }

    return (await res.json()) as LeaderboardResponse;
  } catch {
    return { leaderboard: [], total: 0, viewer: null };
  }
}
