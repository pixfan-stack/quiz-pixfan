/** Remote high scores / leaderboard API (Cloudflare D1). */
export function isRemoteScoresEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_REMOTE_SCORES !== 'false';
}
