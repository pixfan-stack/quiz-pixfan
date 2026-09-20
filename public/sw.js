/**
 * Service Worker for Quiz PixFan — offline-friendly caching.
 *
 * - Navigations: network-first, offline shell fallback
 * - Static assets: stale-while-revalidate
 * - Same-origin /images/: cache-first (photo-reading / public-domain offline)
 * - API: network only (no stale leaderboard cache)
 */

const CACHE_NAME = 'quiz-pixfan-v7';
const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v1';

const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/data/questions.json',
  '/locales/fr/translation.json',
  '/locales/en/translation.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
];

/** Local illustrated assets used by public-domain / photo-reading offline. */
const IMAGE_URLS = [
  '/images/public-domain/atget-paris.avif',
  '/images/public-domain/blossfeldt-plant.avif',
  '/images/public-domain/brady-lincoln.avif',
  '/images/public-domain/cameron-portrait.avif',
  '/images/public-domain/daguerre-boulevard.avif',
  '/images/public-domain/dust-bowl-1936.avif',
  '/images/public-domain/evans-allie-mae.avif',
  '/images/public-domain/hine-spinner.avif',
  '/images/public-domain/johnston-new-woman.avif',
  '/images/public-domain/kasebier-blessed.avif',
  '/images/public-domain/lange-migrant-mother.avif',
  '/images/public-domain/le-gray-sea.avif',
  '/images/public-domain/marey-motion.avif',
  '/images/public-domain/muybridge-horse.avif',
  '/images/public-domain/nadar-portrait.avif',
  '/images/public-domain/niepce-le-gras.avif',
  '/images/public-domain/parks-american-gothic.avif',
  '/images/public-domain/prokudin-color.avif',
  '/images/public-domain/riis-bandits-roost.avif',
  '/images/public-domain/stieglitz-steerage.avif',
  '/images/public-domain/talbot-open-door.avif',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const shell = await caches.open(CACHE_NAME);
      await shell.addAll(OFFLINE_URLS);
      const images = await caches.open(IMAGE_CACHE_NAME);
      await Promise.all(
        IMAGE_URLS.map((url) =>
          images.add(url).catch(() => {
            /* best-effort — missing asset must not fail install */
          })
        )
      );
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== IMAGE_CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache API responses
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(
        () =>
          new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          })
      )
    );
    return;
  }

  // App shell / navigations: network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Illustrated quiz images: cache-first for offline photo-reading
  if (url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          return (
            cached ||
            new Response('', { status: 503, statusText: 'Offline image' })
          );
        }
      })
    );
    return;
  }

  // Static: stale-while-revalidate
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target =
    (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.navigate?.(target);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(target);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.type !== 'SKIP_WAITING') return;
  self.skipWaiting();
});
