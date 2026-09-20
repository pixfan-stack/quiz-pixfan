-- Vault + season badges sync (run on existing D1 deployments)
-- Extends player_progress with mistake vault and season cosmetic badges.
-- npx wrangler d1 execute quiz-pixfan-scores --remote --file=migrations/006-vault-season-sync.sql

ALTER TABLE player_progress ADD COLUMN vault_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE player_progress ADD COLUMN season_badges_json TEXT NOT NULL DEFAULT '{}';
