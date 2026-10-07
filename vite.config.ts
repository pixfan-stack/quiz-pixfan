import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const appVersion = (
  JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }
).version;

/** Serve public directory index.html for trailing-slash URLs (CF Pages parity). */
function publicDirIndex(): Plugin {
  return {
    name: 'public-dir-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = (req.url ?? '').split('?')[0];
        if (!raw.endsWith('/') || raw === '/') {
          next();
          return;
        }
        const indexPath = join(process.cwd(), 'public', raw, 'index.html');
        if (!existsSync(indexPath)) {
          next();
          return;
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(indexPath));
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = (req.url ?? '').split('?')[0];
        if (!raw.endsWith('/') || raw === '/') {
          next();
          return;
        }
        const indexPath = join(process.cwd(), 'dist', raw, 'index.html');
        if (!existsSync(indexPath)) {
          next();
          return;
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(readFileSync(indexPath));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), publicDirIndex()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          i18n: ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },
});
