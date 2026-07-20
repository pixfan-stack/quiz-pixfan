/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public site URL used in social share links (optional). */
  readonly VITE_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
