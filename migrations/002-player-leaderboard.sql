-- Per-player leaderboard scores (run on existing D1 deployments)
CREATE TABLE IF NOT EXISTS player_highscores (
  quiz_id TEXT NOT NULL,
  player_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK(percentage >= 0 AND percentage <= 100),
  correct_count INTEGER NOT NULL CHECK(correct_count >= 0),
  total_questions INTEGER NOT NULL CHECK(total_questions > 0),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (quiz_id, player_id)
);

CREATE INDEX IF NOT EXISTS idx_player_highscores_quiz_pct
  ON player_highscores(quiz_id, percentage DESC, updated_at ASC);

CREATE INDEX IF NOT EXISTS idx_player_highscores_pct
  ON player_highscores(percentage DESC, updated_at ASC);

CREATE INDEX IF NOT EXISTS idx_player_highscores_player
  ON player_highscores(player_id);
