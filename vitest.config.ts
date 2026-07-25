import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const appVersion = (
  JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }
).version;

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/tests/**/*.test.ts'],
    exclude: ['e2e/**'],
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
  },
});
