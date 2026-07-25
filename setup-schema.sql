/**
 * Cloudflare D1 Database setup for Quiz PixFan high scores
 *
 * This file contains the SQL schema and setup instructions for enabling
 * cross-device high scores with Cloudflare D1 (serverless SQL database).
 *
 * ============================================================================
 * SETUP INSTRUCTIONS
 * ============================================================================
 *
 * 1. Create a D1 database in Cloudflare Dashboard or via Wrangler:
 *
 *    npx wrangler d1 create quiz-pixfan-scores
 *
 *    This will output a DATABASE_ID (e.g., "abc123-def456-ghi789")
 *
 * 2. Initialize the schema (run once):
 *
 *    npx wrangler d1 execute quiz-pixfan-scores --file=setup-schema.sql
 *
 *    Or paste this SQL into the Cloudflare Dashboard > D1 > SQL tab:
 *
 *    CREATE TABLE IF NOT EXISTS highscores (
 *      quiz_id TEXT PRIMARY KEY,
 *      percentage INTEGER NOT NULL,
 *      correct_count INTEGER NOT NULL,
 *      total_questions INTEGER NOT NULL,
 *      updated_at TEXT NOT NULL,
 *      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
 *    );
 *
 *    CREATE INDEX IF NOT EXISTS idx_percentage ON highscores(percentage DESC);
 *    CREATE INDEX IF NOT EXISTS idx_updated ON highscores(updated_at DESC);
 *
 * 3. Bind the database in wrangler.toml (add to your existing config):
 *
 *    [[d1_databases]]
 *    binding = "DB"
 *    database_name = "quiz-pixfan-scores"
 *    database_id = "<YOUR_DATABASE_ID>"
 *
 * 4. Deploy and test:
 *
 *    npx wrangler deploy
 *    curl https://your-site.pages.dev/api/highscore?quizId=exposure-basics
 *
 * ============================================================================
 * MIGRATION FROM KV (optional)
 * ============================================================================
 *
 * If you previously used KV, migrate existing scores:
 *
 *    npx wrangler d1 execute quiz-pixfan-scores --remote --sql="
 *      INSERT OR IGNORE INTO highscores (quiz_id, percentage, correct_count, total_questions, updated_at)
 *      SELECT key, CAST(value->>'percentage' AS INTEGER),
 *             CAST(value->>'correctCount' AS INTEGER),
 *             CAST(value->>'totalQuestions' AS INTEGER),
 *             value->>'updatedAt'
 *      FROM kv_namespace
 *      WHERE key LIKE 'highscore:%';
 *    "
 *
 * ============================================================================
 * EXAMPLE QUERIES
 * ============================================================================
 *
 * Get best score for a quiz:
 *   SELECT * FROM highscores WHERE quiz_id = 'exposure-basics';
 *
 * Get top 10 scores across all quizzes:
 *   SELECT quiz_id, percentage, correct_count, total_questions, updated_at
 *   FROM highscores
 *   ORDER BY percentage DESC
 *   LIMIT 10;
 *
 * Get average score per quiz:
 *   SELECT quiz_id, AVG(percentage) as avg_score, COUNT(*) as attempts
 *   FROM highscores
 *   GROUP BY quiz_id;
 *
 * ============================================================================
 */

-- Schema initialization (run once)
CREATE TABLE IF NOT EXISTS highscores (
  quiz_id TEXT PRIMARY KEY,
  percentage INTEGER NOT NULL CHECK(percentage >= 0 AND percentage <= 100),
  correct_count INTEGER NOT NULL CHECK(correct_count >= 0),
  total_questions INTEGER NOT NULL CHECK(total_questions > 0),
  updated_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_percentage ON highscores(percentage DESC);
CREATE INDEX IF NOT EXISTS idx_updated ON highscores(updated_at DESC);

-- Per-player leaderboard (multi-player scores per quiz)
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

-- Anonymous attempt analytics
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

-- Optional: leaderboard view (top scores per quiz)
CREATE VIEW IF NOT EXISTS leaderboard AS
SELECT
  h.quiz_id,
  h.percentage,
  h.correct_count,
  h.total_questions,
  h.updated_at,
  h.created_at,
  ROW_NUMBER() OVER (PARTITION BY h.quiz_id ORDER BY h.percentage DESC) as rank
FROM highscores h;

-- Optional: analytics view (statistics per quiz)
CREATE VIEW IF NOT EXISTS quiz_analytics AS
SELECT
  quiz_id,
  COUNT(*) as total_attempts,
  AVG(percentage) as avg_score,
  MAX(percentage) as best_score,
  MIN(percentage) as worst_score,
  AVG(correct_count) as avg_correct,
  MAX(updated_at) as last_attempt
FROM highscores
GROUP BY quiz_id;
