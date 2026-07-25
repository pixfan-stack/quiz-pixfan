-- Anonymous quiz attempt analytics (run on existing D1 deployments)
-- npx wrangler d1 execute quiz-pixfan-scores --remote --file=migrations/003-quiz-attempts.sql

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK(percentage >= 0 AND percentage <= 100),
  correct_count INTEGER NOT NULL CHECK(correct_count >= 0),
  total_questions INTEGER NOT NULL CHECK(total_questions > 0),
  time_taken_seconds INTEGER NOT NULL CHECK(time_taken_seconds >= 0),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_attempts_quiz_created
  ON quiz_attempts(quiz_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_attempts_created
  ON quiz_attempts(created_at DESC);
