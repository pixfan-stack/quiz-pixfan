/**
 * Admin client for name_reports moderation (requires unlocked admin session PIN).
 */

import { getAdminSessionPin } from './adminAuth';

export interface AdminReportRow {
  playerId: string;
  displayName: string;
  reportCount: number;
  lastReportedAt: string;
  reasons: string[];
}

function adminHeaders(): HeadersInit {
  const pin = getAdminSessionPin();
  return {
    'Content-Type': 'application/json',
    'X-Admin-Pin': pin,
  };
}

export async function fetchAdminReports(): Promise<{
  ok: boolean;
  reports: AdminReportRow[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/admin/reports', {
      headers: adminHeaders(),
    });
    if (res.status === 401) {
      return { ok: false, reports: [], error: 'unauthorized' };
    }
    if (res.status === 503) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (body?.error?.includes('not configured')) {
        return { ok: false, reports: [], error: 'pin_unconfigured' };
      }
      return { ok: false, reports: [], error: 'unavailable' };
    }
    if (!res.ok) {
      return { ok: false, reports: [], error: 'unavailable' };
    }
    const data = (await res.json()) as { reports?: AdminReportRow[] };
    return { ok: true, reports: data.reports ?? [] };
  } catch {
    return { ok: false, reports: [], error: 'unavailable' };
  }
}

export async function moderateAdminReport(
  action: 'mask' | 'dismiss',
  playerId: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/reports', {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ action, playerId }),
    });
    if (res.status === 401) return { ok: false, error: 'unauthorized' };
    if (res.status === 503) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      if (body?.error?.includes('not configured')) {
        return { ok: false, error: 'pin_unconfigured' };
      }
      return { ok: false, error: 'unavailable' };
    }
    if (!res.ok) return { ok: false, error: 'unavailable' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'unavailable' };
  }
}
