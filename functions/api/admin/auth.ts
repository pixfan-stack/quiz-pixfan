/**
 * Shared admin PIN check for Pages Functions.
 *
 * Prefer runtime secret `ADMIN_PIN` (Functions-only).
 * `VITE_ADMIN_PIN` is also accepted so a single Pages env var can cover
 * both the SPA build and Functions when set on the project.
 */

export interface AdminPinEnv {
  ADMIN_PIN?: string;
  VITE_ADMIN_PIN?: string;
}

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; status: 503; error: string }
  | { ok: false; status: 401; error: string };

export function expectedAdminPin(env: AdminPinEnv): string {
  return (env.ADMIN_PIN ?? env.VITE_ADMIN_PIN ?? '').trim();
}

export function authorizeAdmin(
  request: Request,
  env: AdminPinEnv
): AdminAuthResult {
  const expected = expectedAdminPin(env);
  if (!expected) {
    return {
      ok: false,
      status: 503,
      error:
        'Admin PIN not configured on Pages Functions (set runtime ADMIN_PIN or VITE_ADMIN_PIN)',
    };
  }
  const provided = request.headers.get('X-Admin-Pin')?.trim() ?? '';
  if (!provided || provided !== expected) {
    return { ok: false, status: 401, error: 'Unauthorized' };
  }
  return { ok: true };
}
