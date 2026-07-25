/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public site URL used in social share links (optional). */
  readonly VITE_APP_URL?: string;
  /** Set to "false" to disable D1 leaderboard API calls. */
  readonly VITE_ENABLE_REMOTE_SCORES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
