/**
 * Service Worker for Quiz PixFan — offline-friendly caching.
 *
 * - Navigations: network-first, offline shell fallback
 * - Static assets: stale-while-revalidate
 * - Same-origin /images/: cache-first (photo-reading / public-domain offline)
 * - API: network only (no stale leaderboard cache)
 */

const CACHE_NAME = 'quiz-pixfan-v10';
const IMAGE_CACHE_NAME = 'quiz-pixfan-images-v4';

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

/** Local illustrated assets used by public-domain / packs / photo-reading offline. */
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
  '/images/packs/photo-1418065460487-3e41a6c84dc5.avif',
  '/images/packs/photo-1419242902214-272b3f66ee7a.avif',
  '/images/packs/photo-1438761681033-6461ffad8d80.avif',
  '/images/packs/photo-1441974231531-c6227db76b6e.avif',
  '/images/packs/photo-1449824913935-59a10b8d2000.avif',
  '/images/packs/photo-1450101499163-c8848c66ca85.avif',
  '/images/packs/photo-1452421822248-d4c2b47f0c81.avif',
  '/images/packs/photo-1452587925148-ce544e77e70d.avif',
  '/images/packs/photo-1454165804606-c3d57bc86b40.avif',
  '/images/packs/photo-1460925895917-afdab827c52f.avif',
  '/images/packs/photo-1464822759023-fed622ff2c3b.avif',
  '/images/packs/photo-1469474968028-56623f02e42e.avif',
  '/images/packs/photo-1470071459604-3b5ec3a7fe05.avif',
  '/images/packs/photo-1470252649378-9c29740c9fa8.avif',
  '/images/packs/photo-1472214103451-9374bd1c798e.avif',
  '/images/packs/photo-1486312338219-ce68d2c6f44d.avif',
  '/images/packs/photo-1487412720507-e7ab37603c6f.avif',
  '/images/packs/photo-1492691527719-9d1e07e534b4.avif',
  '/images/packs/photo-1493246507139-91e8fad9978e.avif',
  '/images/packs/photo-1493863641943-9b68992a8d07.avif',
  '/images/packs/photo-1494790108377-be9c29b29330.avif',
  '/images/packs/photo-1495616811223-4d98c6e9c869.avif',
  '/images/packs/photo-1498050108023-c5249f4df085.avif',
  '/images/packs/photo-1499750310107-5fef28a66643.avif',
  '/images/packs/photo-1500530855697-b586d89ba3ee.avif',
  '/images/packs/photo-1500534314209-a25ddb2bd429.avif',
  '/images/packs/photo-1500648767791-00dcc994a43e.avif',
  '/images/packs/photo-1501594907352-04cda38ebc29.avif',
  '/images/packs/photo-1501785888041-af3ef285b470.avif',
  '/images/packs/photo-1502082553048-f009c37129b9.avif',
  '/images/packs/photo-1502920917128-1aa500764cbd.avif',
  '/images/packs/photo-1504674900247-0877df9cc836.avif',
  '/images/packs/photo-1506905925346-21bda4d32df4.avif',
  '/images/packs/photo-1507003211169-0a1dd7228f2d.avif',
  '/images/packs/photo-1510127034890-ba27508e9f1c.avif',
  '/images/packs/photo-1511707171634-5f897ff02aa9.avif',
  '/images/packs/photo-1512499617640-c74ae3a79d37.avif',
  '/images/packs/photo-1512941937669-90a1b58e7e9c.avif',
  '/images/packs/photo-1514565131-fce0801e5785.avif',
  '/images/packs/photo-1515378791036-0648a3ef77b2.avif',
  '/images/packs/photo-1515886657613-9f3515b0c78f.avif',
  '/images/packs/photo-1516035069371-29a1b244cc32.avif',
  '/images/packs/photo-1517694712202-14dd9538aa97.avif',
  '/images/packs/photo-1517841905240-472988babdf9.avif',
  '/images/packs/photo-1518182170546-07661fd94144.avif',
  '/images/packs/photo-1519501025264-65ba15a82390.avif',
  '/images/packs/photo-1519741497674-611481863552.avif',
  '/images/packs/photo-1521791136064-7986c2920216.avif',
  '/images/packs/photo-1524504388940-b1c1722653e1.avif',
  '/images/packs/photo-1526170375885-4d8ecf77b99f.avif',
  '/images/packs/photo-1529626455594-4ff0802cfb7e.avif',
  '/images/packs/photo-1531297484001-80022131f5a1.avif',
  '/images/packs/photo-1531746020798-e6953c6e8e04.avif',
  '/images/packs/photo-1534528741775-53994a69daeb.avif',
  '/images/packs/photo-1542038784456-1ea8e935640e.avif',
  '/images/packs/photo-1544005313-94ddf0286df2.avif',
  '/images/packs/photo-1550745165-9bc0b252726f.avif',
  '/images/packs/photo-1552374196-c4e7ffc6e126.avif',
  '/images/packs/photo-1552674605-db6ffd4facb5.avif',
  '/images/packs/photo-1554048612-b6a482bc67e5.avif',
  '/images/packs/photo-1554118811-1e0d58224f24.avif',
  '/images/packs/photo-1555949963-aa79dcee981c.avif',
  '/images/packs/photo-1555949963-ff9fe0c870eb.avif',
  '/images/packs/photo-1556656793-08538906a9f8.avif',
  '/images/packs/photo-1558655146-d09347e92766.avif',
  '/images/packs/photo-1561070791-2526d30994b5.avif',
  '/images/packs/photo-1564349683136-77e08dba1ef7.avif',
  '/images/packs/photo-1580910051074-3eb694886505.avif',
  '/images/packs/photo-1598327105666-5b89351aff97.avif',
  '/images/packs/photo-1606983340126-99ab4feaa64a.avif',
  '/images/packs/photo-1611162616305-c69b3fa7fbe0.avif',
  '/images/packs/photo-1618005182384-a83a8bd57fbe.avif',
  '/images/packs/photo-1620712943543-bcc4688e7485.avif',
  '/images/packs/photo-1677442136019-21780ecad995.avif',
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
