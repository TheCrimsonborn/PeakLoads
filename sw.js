const CACHE_NAME = 'peakloads-cache-1.0.7fbe39f';
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
            .catch(err => console.error("Cache open failed:", err))
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    if (networkResponse.ok) {
                        const url = new URL(event.request.url);
                        if (url.origin === self.location.origin && !url.search) {
                            cache.put(event.request, networkResponse.clone());
                        }
                    }
                    return networkResponse;
                });
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
                return Response.error();
            });

            event.waitUntil(fetchPromise);

            return cachedResponse || fetchPromise;
        })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = new Set([CACHE_NAME]);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                // NOSONAR - Pre-filtering mandated by memory guidelines to prevent undefined array slots in Promise.all
                cacheNames
                    .filter(cacheName => !cacheWhitelist.has(cacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});
