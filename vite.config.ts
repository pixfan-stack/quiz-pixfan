import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { localeHomeShellsPlugin } from './vite/localeHomeShells';

const appVersion = (
  JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }
).version;

/**
 * Dev/preview parity for path locales (vague 1.99).
 * - `/en|/es|/de` home → SPA index (dev) or baked shell (preview/dist)
 * - `/xx/guides/*` → strip prefix and serve static guides
 */
function pathLocaleDevParity(): Plugin {
  const stripGuide = (raw: string): string | null => {
    const m = raw.match(/^\/(en|es|de)\/guides(\/.*)?$/i);
    if (!m) return null;
    return `/guides${m[2] ?? '/'}`;
  };

  const resolveGuideFile = (root: string, guidePath: string): string | null => {
    const base = join(root, guidePath.replace(/^\//, ''));
    if (guidePath.endsWith('/')) {
      const idx = join(base, 'index.html');
      return existsSync(idx) ? idx : null;
    }
    if (existsSync(base)) return base;
    if (existsSync(`${base}.html`)) return `${base}.html`;
    const idx = join(base, 'index.html');
    return existsSync(idx) ? idx : null;
  };

  return {
    name: 'path-locale-dev-parity',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = (req.url ?? '').split('?')[0] ?? '';
        if (/^\/(en|es|de)\/?$/.test(raw)) {
          // Keep browser URL; Vite serves transformed root index.html.
          req.url = '/' + (req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '');
          next();
          return;
        }
        const guide = stripGuide(raw);
        if (guide) {
          const file = resolveGuideFile(join(process.cwd(), 'public'), guide);
          if (file) {
            _res.setHeader('Content-Type', 'text/html; charset=utf-8');
            _res.end(readFileSync(file));
            return;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = (req.url ?? '').split('?')[0] ?? '';
        // Baked home shells live at dist/{lang}/index.html — serve explicitly.
        const home = raw.match(/^\/(en|es|de)\/?$/i);
        if (home) {
          const shell = join(process.cwd(), 'dist', home[1]!.toLowerCase(), 'index.html');
          if (existsSync(shell)) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(readFileSync(shell));
            return;
          }
        }
        const guide = stripGuide(raw);
        if (guide) {
          const file = resolveGuideFile(join(process.cwd(), 'dist'), guide);
          if (file) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(readFileSync(file));
            return;
          }
        }
        next();
      });
    },
  };
}

/** Serve public directory index.html for trailing-slash URLs (CF Pages parity). */
function publicDirIndex(): Plugin {
  return {
    name: 'public-dir-index',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const raw = (req.url ?? '').split('?')[0];
        if (!raw || !raw.endsWith('/') || raw === '/') {
          next();
          return;
        }
        // Locale homes handled by pathLocaleDevParity.
        if (/^\/(en|es|de)\/$/.test(raw)) {
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
        if (!raw || !raw.endsWith('/') || raw === '/') {
          next();
          return;
        }
        if (/^\/(en|es|de)\/$/.test(raw)) {
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
  plugins: [
    react(),
    pathLocaleDevParity(),
    publicDirIndex(),
    localeHomeShellsPlugin(),
  ],
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
