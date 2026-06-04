const CACHE_NAME = 'peakload-cache-v13';
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
    // Stale-While-Revalidate strategy for dynamic assets
    if (event.request.method === 'GET') {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        if (networkResponse.ok) {
                            const url = new URL(event.request.url);
                            // Prevent unbounded caching by restricting to same-origin and no query params
                            if (url.origin === self.location.origin && !url.search) {
                                cache.put(event.request, networkResponse.clone());
                            }
                        }
                        return networkResponse;
                    });
                }).catch(() => {
                    // Optional: Return offline fallback
                });

                // Ensure background fetch completes even if worker is closed
                event.waitUntil(fetchPromise);

                // Return cached response immediately if available, otherwise wait for network
                return cachedResponse || fetchPromise;
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
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
