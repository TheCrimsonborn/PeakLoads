const CACHE_NAME = 'peakload-cache-v12';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/calculator.js',
    '/js/i18n.js',
    '/manifest.json',
    '/404.html',
    '/privacy',
    '/terms',
    '/squat-1rm-calculator',
    '/bench-press-warm-up-planner',
    '/rpe-rir-translator',
    '/assets/icons/icon-192.png',
    '/assets/icons/icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Optional: Return an offline fallback page here if applicable
                });
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = new Set([CACHE_NAME]);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => !cacheWhitelist.has(cacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});
