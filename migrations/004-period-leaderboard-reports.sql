-- Period leaderboards (week / month) + abusive display-name reports
-- npx wrangler d1 execute quiz-pixfan-scores --remote --file=migrations/004-period-leaderboard-reports.sql

CREATE TABLE IF NOT EXISTS period_highscores (
  period_type TEXT NOT NULL CHECK(period_type IN ('week', 'month')),
  period_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK(percentage >= 0 AND percentage <= 100),
  correct_count INTEGER NOT NULL CHECK(correct_count >= 0),
  total_questions INTEGER NOT NULL CHECK(total_questions > 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (period_type, period_id, quiz_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_period_highscores_lookup
  ON period_highscores(period_type, period_id, percentage DESC, updated_at ASC);

CREATE INDEX IF NOT EXISTS idx_period_highscores_quiz
  ON period_highscores(period_type, period_id, quiz_id, percentage DESC, updated_at ASC);

CREATE TABLE IF NOT EXISTS name_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reported_player_id TEXT NOT NULL,
  reported_display_name TEXT NOT NULL,
  reporter_player_id TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE(reported_player_id, reporter_player_id)
);

CREATE INDEX IF NOT EXISTS idx_name_reports_reported
  ON name_reports(reported_player_id, created_at DESC);
