-- Account sync / recovery (run on existing D1 deployments)
-- Progress blob (streak + achievements) + hashed recovery codes tied to player_id.
-- npx wrangler d1 execute quiz-pixfan-scores --remote --file=migrations/005-account-sync.sql

CREATE TABLE IF NOT EXISTS player_progress (
  player_id TEXT PRIMARY KEY,
  display_name TEXT,
  streak_json TEXT NOT NULL DEFAULT '{}',
  achievements_json TEXT NOT NULL DEFAULT '[]',
  -- vault_json / season_badges_json added in 006 (ALTER on existing DBs)
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS player_recovery_codes (
  code_hash TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_recovery_codes_player
  ON player_recovery_codes(player_id);
