/**
 * Cloudflare Pages Function — light account sync + recovery codes
 *
 * Route: /api/account
 *
 * GET  ?playerId=…           → progress + high scores for that player
 * POST { action: 'sync', … } → upsert streak + achievements
 * POST { action: 'create_code', playerId } → one plaintext recovery code
 * POST { action: 'redeem', code } → playerId + progress + high scores
 */

import { json } from './utils';

export interface Env {
  DB: D1Database;
}

const MAX_PLAYER_ID = 64;
const MAX_DISPLAY_NAME = 24;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_TTL_DAYS = 365;
/** Mirror report.ts (10 s) — one create_code burst per player. */
const CREATE_CODE_COOLDOWN_MS = 10_000;
/** Mirror highscore.ts-ish spacing — slow redeem brute-force per client IP. */
const REDEEM_COOLDOWN_MS = 3_000;

interface StreakPayload {
  lastDailyId: string | null;
  currentStreak: number;
  bestStreak: number;
  freezesAvailable: number;
  freezeWeekKey: string | null;
}

interface HighScoreRow {
  quizId: string;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  updatedAt: string;
  displayName?: string;
}

function sanitizePlayerId(raw: string): string | null {
  const id = raw.trim();
  if (!id || id.length > MAX_PLAYER_ID) return null;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) return null;
  return id;
}

function sanitizeDisplayName(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().replace(/[\u0000-\u001F\u007F]/g, '');
  const collapsed = trimmed.replace(/\s+/g, ' ').slice(0, MAX_DISPLAY_NAME);
  return collapsed || null;
}

function normalizeRecoveryCode(raw: string): string | null {
  const compact = raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (compact.length !== 12) return null;
  if (![...compact].every((ch) => CODE_ALPHABET.includes(ch))) return null;
  return `${compact.slice(0, 4)}-${compact.slice(4, 8)}-${compact.slice(8, 12)}`;
}

function formatRecoveryCode(compact: string): string {
  return `${compact.slice(0, 4)}-${compact.slice(4, 8)}-${compact.slice(8, 12)}`;
}

function generateRecoveryCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  let compact = '';
  for (let i = 0; i < 12; i++) {
    compact += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length]!;
  }
  return formatRecoveryCode(compact);
}

function clientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP')?.trim() ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/**
 * Cache-API cooldown keyed by action + IP (no schema change).
 * Fails open if cache is unavailable (e.g. some local runtimes).
 */
async function isIpRateLimited(
  request: Request,
  action: string,
  cooldownMs: number
): Promise<boolean> {
  const ip = clientIp(request);
  const cacheKey = new Request(
    `https://rate-limit.quiz-pixfan.internal/account/${action}/${encodeURIComponent(ip)}`
  );
  try {
    const cache = caches.default;
    const hit = await cache.match(cacheKey);
    if (hit) {
      const last = Number(await hit.text());
      if (!Number.isNaN(last) && Date.now() - last < cooldownMs) {
        return true;
      }
    }
    await cache.put(
      cacheKey,
      new Response(String(Date.now()), {
        headers: {
          'Cache-Control': `max-age=${Math.ceil(cooldownMs / 1000) + 1}`,
        },
      })
    );
    return false;
  } catch {
    return false;
  }
}

async function isCreateCodeRateLimited(
  db: D1Database,
  playerId: string
): Promise<boolean> {
  const recent = await db
    .prepare(
      `SELECT created_at as createdAt FROM player_recovery_codes
       WHERE player_id = ?
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(playerId)
    .first<{ createdAt: string }>();

  if (!recent?.createdAt) return false;
  const lastMs = Date.parse(recent.createdAt);
  return (
    !Number.isNaN(lastMs) && Date.now() - lastMs < CREATE_CODE_COOLDOWN_MS
  );
}

async function hashRecoveryCode(normalized: string): Promise<string> {
  const data = new TextEncoder().encode(normalized.replace(/-/g, ''));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function parseStreak(raw: unknown): StreakPayload {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<StreakPayload>;
  return {
    lastDailyId:
      typeof s.lastDailyId === 'string' && s.lastDailyId.startsWith('daily-')
        ? s.lastDailyId
        : null,
    currentStreak: Math.max(0, Math.min(10000, Number(s.currentStreak) || 0)),
    bestStreak: Math.max(0, Math.min(10000, Number(s.bestStreak) || 0)),
    freezesAvailable: Math.max(
      0,
      Math.min(1, Number(s.freezesAvailable ?? 1) || 0)
    ),
    freezeWeekKey:
      typeof s.freezeWeekKey === 'string' && /^\d{4}-W\d{2}$/.test(s.freezeWeekKey)
        ? s.freezeWeekKey
        : null,
  };
}

function parseAchievements(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [
    ...new Set(
      raw.filter(
        (id): id is string =>
          typeof id === 'string' && id.length > 0 && id.length <= 64
      )
    ),
  ].slice(0, 64);
}

async function loadHighScores(
  db: D1Database,
  playerId: string
): Promise<HighScoreRow[]> {
  const result = await db
    .prepare(
      `SELECT quiz_id as quizId, percentage,
              correct_count as correctCount,
              total_questions as totalQuestions,
              updated_at as updatedAt,
              display_name as displayName
       FROM player_highscores
       WHERE player_id = ?
       ORDER BY updated_at DESC`
    )
    .bind(playerId)
    .all<HighScoreRow>();
  return result.results ?? [];
}

async function loadProgress(
  db: D1Database,
  playerId: string
): Promise<{
  playerId: string;
  displayName: string | null;
  streak: StreakPayload;
  achievements: string[];
  highscores: HighScoreRow[];
  updatedAt: string | null;
}> {
  const row = await db
    .prepare(
      `SELECT player_id as playerId, display_name as displayName,
              streak_json as streakJson, achievements_json as achievementsJson,
              updated_at as updatedAt
       FROM player_progress
       WHERE player_id = ?`
    )
    .bind(playerId)
    .first<{
      playerId: string;
      displayName: string | null;
      streakJson: string;
      achievementsJson: string;
      updatedAt: string;
    }>();

  let streak: StreakPayload = {
    lastDailyId: null,
    currentStreak: 0,
    bestStreak: 0,
    freezesAvailable: 1,
    freezeWeekKey: null,
  };
  let achievements: string[] = [];
  let displayName: string | null = null;
  let updatedAt: string | null = null;

  if (row) {
    displayName = row.displayName;
    updatedAt = row.updatedAt;
    try {
      streak = parseStreak(JSON.parse(row.streakJson));
    } catch {
      // keep defaults
    }
    try {
      achievements = parseAchievements(JSON.parse(row.achievementsJson));
    } catch {
      // keep defaults
    }
  }

  const highscores = await loadHighScores(db, playerId);
  if (!displayName) {
    displayName =
      highscores.find((h) => h.displayName)?.displayName?.trim() || null;
  }

  return {
    playerId,
    displayName,
    streak,
    achievements,
    highscores,
    updatedAt,
  };
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const playerId = sanitizePlayerId(url.searchParams.get('playerId') ?? '');
  if (!playerId) {
    return json({ error: 'Missing or invalid playerId' }, 400);
  }

  try {
    if (!context.env.DB) {
      return json({ error: 'Database unavailable' }, 503);
    }
    const progress = await loadProgress(context.env.DB, playerId);
    return json({ progress });
  } catch (error) {
    console.warn('Account GET failed:', error);
    return json({ error: 'Failed to load progress' }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: Record<string, unknown>;
  try {
    body = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const action = typeof body.action === 'string' ? body.action : '';
  if (!context.env.DB) {
    return json({ error: 'Database unavailable' }, 503);
  }

  try {
    if (action === 'sync') {
      return await handleSync(context.env.DB, body);
    }
    if (action === 'create_code') {
      return await handleCreateCode(context.env.DB, body);
    }
    if (action === 'redeem') {
      return await handleRedeem(context.env.DB, body, context.request);
    }
    return json({ error: 'Unknown action' }, 400);
  } catch (error) {
    console.warn('Account POST failed:', error);
    return json({ error: 'Account operation failed' }, 500);
  }
};

async function handleSync(
  db: D1Database,
  body: Record<string, unknown>
): Promise<Response> {
  const playerId = sanitizePlayerId(String(body.playerId ?? ''));
  if (!playerId) {
    return json({ error: 'Invalid playerId' }, 400);
  }

  const streak = parseStreak(body.streak);
  const achievements = parseAchievements(body.achievements);
  const displayName = sanitizeDisplayName(body.displayName);
  const updatedAt = new Date().toISOString();

  // Merge with existing remote so a stale client cannot wipe better progress
  const existing = await loadProgress(db, playerId);
  const mergedStreak = mergeStreakServer(existing.streak, streak);
  const mergedAchievements = [
    ...new Set([...existing.achievements, ...achievements]),
  ].slice(0, 64);
  const mergedName = displayName ?? existing.displayName;

  await db
    .prepare(
      `INSERT INTO player_progress
         (player_id, display_name, streak_json, achievements_json, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(player_id) DO UPDATE SET
         display_name = excluded.display_name,
         streak_json = excluded.streak_json,
         achievements_json = excluded.achievements_json,
         updated_at = excluded.updated_at`
    )
    .bind(
      playerId,
      mergedName,
      JSON.stringify(mergedStreak),
      JSON.stringify(mergedAchievements),
      updatedAt
    )
    .run();

  return json({
    ok: true,
    progress: {
      playerId,
      displayName: mergedName,
      streak: mergedStreak,
      achievements: mergedAchievements,
      updatedAt,
    },
  });
}

function mergeStreakServer(
  a: StreakPayload,
  b: StreakPayload
): StreakPayload {
  const aLast = a.lastDailyId ?? '';
  const bLast = b.lastDailyId ?? '';
  const preferB = bLast > aLast;
  const base = preferB ? b : a;
  const other = preferB ? a : b;
  const currentStreak =
    aLast && aLast === bLast
      ? Math.max(a.currentStreak, b.currentStreak)
      : base.currentStreak;
  return {
    lastDailyId: base.lastDailyId ?? other.lastDailyId,
    currentStreak,
    bestStreak: Math.max(a.bestStreak, b.bestStreak),
    freezesAvailable: base.freezesAvailable,
    freezeWeekKey: base.freezeWeekKey,
  };
}

async function handleCreateCode(
  db: D1Database,
  body: Record<string, unknown>
): Promise<Response> {
  const playerId = sanitizePlayerId(String(body.playerId ?? ''));
  if (!playerId) {
    return json({ error: 'Invalid playerId' }, 400);
  }

  if (await isCreateCodeRateLimited(db, playerId)) {
    return json({ error: 'Rate limit: wait before creating another code' }, 429);
  }

  // Ensure progress row exists so redeem always has a target
  const now = new Date();
  const updatedAt = now.toISOString();
  await db
    .prepare(
      `INSERT INTO player_progress
         (player_id, display_name, streak_json, achievements_json, updated_at)
       VALUES (?, NULL, '{}', '[]', ?)
       ON CONFLICT(player_id) DO NOTHING`
    )
    .bind(playerId, updatedAt)
    .run();

  // Optional: sync payload if provided with create
  if (body.streak != null || body.achievements != null) {
    await handleSync(db, body);
  }

  const code = generateRecoveryCode();
  const codeHash = await hashRecoveryCode(code);
  const expiresAt = new Date(
    now.getTime() + CODE_TTL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  // Rotate: one active code per player
  await db
    .prepare(`DELETE FROM player_recovery_codes WHERE player_id = ?`)
    .bind(playerId)
    .run();

  await db
    .prepare(
      `INSERT INTO player_recovery_codes (code_hash, player_id, created_at, expires_at)
       VALUES (?, ?, ?, ?)`
    )
    .bind(codeHash, playerId, updatedAt, expiresAt)
    .run();

  return json({
    ok: true,
    code,
    expiresAt,
    playerId,
  });
}

async function handleRedeem(
  db: D1Database,
  body: Record<string, unknown>,
  request: Request
): Promise<Response> {
  if (await isIpRateLimited(request, 'redeem', REDEEM_COOLDOWN_MS)) {
    return json({ error: 'Rate limit: wait before redeeming again' }, 429);
  }

  const normalized = normalizeRecoveryCode(String(body.code ?? ''));
  if (!normalized) {
    return json({ error: 'Invalid recovery code' }, 400);
  }

  const codeHash = await hashRecoveryCode(normalized);
  const row = await db
    .prepare(
      `SELECT player_id as playerId, expires_at as expiresAt
       FROM player_recovery_codes
       WHERE code_hash = ?`
    )
    .bind(codeHash)
    .first<{ playerId: string; expiresAt: string | null }>();

  if (!row) {
    return json({ error: 'Unknown recovery code' }, 404);
  }

  if (row.expiresAt) {
    const exp = Date.parse(row.expiresAt);
    if (!Number.isNaN(exp) && exp < Date.now()) {
      return json({ error: 'Recovery code expired' }, 410);
    }
  }

  const progress = await loadProgress(db, row.playerId);
  return json({ ok: true, progress });
}
