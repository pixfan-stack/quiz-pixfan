/**
 * Cloudflare Pages Function — admin moderation for name_reports
 *
 * GET  /api/admin/reports          — aggregated open reports
 * POST /api/admin/reports          — { action: 'mask' | 'dismiss', playerId }
 *
 * Auth: header X-Admin-Pin must match runtime ADMIN_PIN (preferred) or VITE_ADMIN_PIN.
 */

import { json } from '../utils';
import { authorizeAdmin, type AdminPinEnv } from './auth';

export interface Env extends AdminPinEnv {
  DB: D1Database;
}

const MAX_PLAYER_ID = 64;
const MASKED_NAME = 'Joueur';

export interface ReportAggregate {
  playerId: string;
  displayName: string;
  reportCount: number;
  lastReportedAt: string;
  reasons: string[];
}

function sanitizePlayerId(raw: string): string | null {
  const id = raw.trim();
  if (!id || id.length > MAX_PLAYER_ID) return null;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) return null;
  return id;
}

async function maskPlayerName(db: D1Database, playerId: string): Promise<void> {
  await db
    .prepare(`UPDATE player_highscores SET display_name = ? WHERE player_id = ?`)
    .bind(MASKED_NAME, playerId)
    .run();
  try {
    await db
      .prepare(`UPDATE period_highscores SET display_name = ? WHERE player_id = ?`)
      .bind(MASKED_NAME, playerId)
      .run();
  } catch {
    // period table may be missing
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const auth = authorizeAdmin(context.request, context.env);
  if (!auth.ok) {
    return json({ error: auth.error }, auth.status);
  }

  if (!context.env.DB) {
    return json({ reports: [] as ReportAggregate[] });
  }

  try {
    const rows = await context.env.DB.prepare(
      `SELECT reported_player_id as playerId,
              reported_display_name as displayName,
              COUNT(*) as reportCount,
              MAX(created_at) as lastReportedAt,
              GROUP_CONCAT(DISTINCT reason) as reasonsRaw
       FROM name_reports
       GROUP BY reported_player_id
       ORDER BY reportCount DESC, lastReportedAt DESC
       LIMIT 100`
    ).all<{
      playerId: string;
      displayName: string;
      reportCount: number;
      lastReportedAt: string;
      reasonsRaw: string | null;
    }>();

    const reports: ReportAggregate[] = (rows.results ?? []).map((row) => ({
      playerId: row.playerId,
      displayName: row.displayName,
      reportCount: Number(row.reportCount) || 0,
      lastReportedAt: row.lastReportedAt,
      reasons: (row.reasonsRaw ?? '')
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean),
    }));

    return json({ reports });
  } catch (error) {
    console.warn('Admin reports list failed:', error);
    return json({ error: 'Reports unavailable' }, 503);
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const auth = authorizeAdmin(context.request, context.env);
  if (!auth.ok) {
    return json({ error: auth.error }, auth.status);
  }

  let body: { action?: string; playerId?: string };
  try {
    body = (await context.request.json()) as { action?: string; playerId?: string };
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const action = body.action === 'mask' || body.action === 'dismiss' ? body.action : null;
  const playerId = sanitizePlayerId(body.playerId ?? '');
  if (!action || !playerId) {
    return json({ error: 'Invalid payload' }, 400);
  }

  if (!context.env.DB) {
    return json({ ok: true, action, playerId });
  }

  try {
    if (action === 'mask') {
      await maskPlayerName(context.env.DB, playerId);
    }

    await context.env.DB.prepare(
      `DELETE FROM name_reports WHERE reported_player_id = ?`
    )
      .bind(playerId)
      .run();

    return json({ ok: true, action, playerId });
  } catch (error) {
    console.warn('Admin report action failed:', error);
    return json({ error: 'Action failed' }, 503);
  }
};
