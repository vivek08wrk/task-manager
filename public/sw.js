// Offline-first service worker tuned for Next.js
const CACHE_NAME = 'task-manager-cache-v2';
const APP_SHELL = ['/', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Always bypass caching for Next.js internals and dev HMR endpoints
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/__nextjs')) {
    event.respondWith(fetch(req));
    return;
  }

  // Don't try to cache cross-origin requests (e.g., images, fonts, yt)
  if (!isSameOrigin) {
    event.respondWith(fetch(req));
    return;
  }

  // For document navigations, prefer network and fall back to cache (app shell)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(req).then((res) => res || caches.match('/')))
    );
    return;
  }

  // Cache-first for other same-origin GETs; update cache in the background
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((networkRes) => {
          // Only cache successful, non-opaque responses
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const resClone = networkRes.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(req, resClone))
              .catch(() => {});
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
