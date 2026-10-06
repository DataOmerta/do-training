const CACHE_NAME = 'do-training-v1';
const STATIC_ASSETS = [
  '/do-training/',
  '/do-training/index.html',
  '/do-training/css/style.css',
  '/do-training/js/app.js',
  '/do-training/js/calendar.js',
  '/do-training/js/certificates.js',
  '/do-training/js/i18n.js',
  '/do-training/js/images.js',
  '/do-training/manifest.json',
  '/do-training/assets/icons/icon-192x192.png',
  '/do-training/assets/icons/icon-512x512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      }).catch(() => caches.match('/do-training/index.html'));
    })
  );
});
