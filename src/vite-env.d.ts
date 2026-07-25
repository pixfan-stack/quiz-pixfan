/// <reference types="vite/client" />

/** Injected from package.json `version` via vite/vitest `define`. */
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  /** Public site URL used in social share links (optional). */
  readonly VITE_APP_URL?: string;
  /** Set to "false" to disable D1 leaderboard API calls. */
  readonly VITE_ENABLE_REMOTE_SCORES?: string;
  /** PIN for the in-browser question editor at #/admin. */
  readonly VITE_ADMIN_PIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
