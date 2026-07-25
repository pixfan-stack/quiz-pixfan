/**
 * Cloudflare Pages Function — report abusive leaderboard display names
 *
 * POST /api/report
 * Body: { reportedPlayerId, reportedDisplayName, reporterPlayerId, reason? }
 *
 * After REPORT_THRESHOLD unique reporters, the name is reset to "Joueur"
 * on all-time and period leaderboards.
 */

import { json } from './utils';

export interface Env {
  DB: D1Database;
}

const MAX_PLAYER_ID = 64;
const MAX_DISPLAY_NAME = 24;
const MAX_REASON = 200;
const REPORT_THRESHOLD = 3;
const MASKED_NAME = 'Joueur';

interface ReportBody {
  reportedPlayerId: string;
  reportedDisplayName: string;
  reporterPlayerId: string;
  reason?: string;
}

function sanitizePlayerId(raw: string): string | null {
  const id = raw.trim();
  if (!id || id.length > MAX_PLAYER_ID) return null;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) return null;
  return id;
}

function sanitizeDisplayName(raw: string): string {
  return raw
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .slice(0, MAX_DISPLAY_NAME);
}

export const onRequestOptions: PagesFunction = async () => {
  return json(null, 204);
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: ReportBody;
  try {
    body = (await context.request.json()) as ReportBody;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const reportedPlayerId = sanitizePlayerId(body.reportedPlayerId ?? '');
  const reporterPlayerId = sanitizePlayerId(body.reporterPlayerId ?? '');
  const reportedDisplayName = sanitizeDisplayName(body.reportedDisplayName ?? '');
  const reason = (body.reason ?? '')
    .trim()
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .slice(0, MAX_REASON);

  if (!reportedPlayerId || !reporterPlayerId || !reportedDisplayName) {
    return json({ error: 'Invalid payload' }, 400);
  }

  if (reportedPlayerId === reporterPlayerId) {
    return json({ error: 'Cannot report yourself' }, 400);
  }

  try {
    if (!context.env.DB) {
      return json({ ok: true, masked: false, reportCount: 1 });
    }

    const recent = await context.env.DB.prepare(
      `SELECT created_at as createdAt FROM name_reports
       WHERE reporter_player_id = ?
       ORDER BY created_at DESC
       LIMIT 1`
    )
      .bind(reporterPlayerId)
      .first<{ createdAt: string }>();

    if (recent?.createdAt) {
      const lastMs = Date.parse(recent.createdAt);
      if (!Number.isNaN(lastMs) && Date.now() - lastMs < 10_000) {
        return json({ error: 'Rate limit: wait before reporting again' }, 429);
      }
    }

    await context.env.DB.prepare(
      `INSERT INTO name_reports
         (reported_player_id, reported_display_name, reporter_player_id, reason)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(reported_player_id, reporter_player_id) DO NOTHING`
    )
      .bind(reportedPlayerId, reportedDisplayName, reporterPlayerId, reason || null)
      .run();

    const countRow = await context.env.DB.prepare(
      `SELECT COUNT(*) as count FROM name_reports WHERE reported_player_id = ?`
    )
      .bind(reportedPlayerId)
      .first<{ count: number }>();

    const reportCount = countRow?.count ?? 1;
    let masked = false;

    if (reportCount >= REPORT_THRESHOLD) {
      await context.env.DB.prepare(
        `UPDATE player_highscores SET display_name = ? WHERE player_id = ?`
      )
        .bind(MASKED_NAME, reportedPlayerId)
        .run();

      try {
        await context.env.DB.prepare(
          `UPDATE period_highscores SET display_name = ? WHERE player_id = ?`
        )
          .bind(MASKED_NAME, reportedPlayerId)
          .run();
      } catch {
        // period table may be missing
      }
      masked = true;
    }

    return json({ ok: true, masked, reportCount });
  } catch (error) {
    console.warn('Report failed (migration 004?):', error);
    return json({ error: 'Report unavailable' }, 503);
  }
};
