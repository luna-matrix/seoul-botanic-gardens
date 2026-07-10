// Jeju Food Atlas — Service Worker
// Caches all pages, CSS, JS, and vendor files for offline use
const CACHE_NAME = 'jeju-food-atlas-v1';
const ASSETS = [
  './',
  './index.html',
  './jeju-city.html',
  './island.html',
  './hot-hits.html',
  './coffee.html',
  './specialties.html',
  './manifest.json',
  './css/style.css',
  './css/vendor/leaflet.css',
  './js/main.js',
  './js/vendor/leaflet.js',
  './img/logo.svg',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/apple-touch-icon.png',
  './img/favicon-32.png',
  './img/favicon-16.png'
];

// Install: cache all core assets
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
          .map(function(n) { return caches.delete(n); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: cache-first for assets, network-first for navigation
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);

  // Skip non-GET (e.g. POST)
  if (e.request.method !== 'GET') return;

  // Skip cross-origin (Google Fonts, map tiles) — let browser handle
  if (url.origin !== self.location.origin) return;

  // For same-origin requests: cache-first
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) {
        // Update cache in background
        fetch(e.request).then(function(resp) {
          if (resp && resp.status === 200) {
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(e.request, resp.clone());
            });
          }
        }).catch(function() {});
        return cached;
      }
      // Not in cache: fetch, cache, return
      return fetch(e.request).then(function(resp) {
        if (!resp || resp.status !== 200) return resp;
        var respClone = resp.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, respClone);
        });
        return resp;
      }).catch(function() {
        // Offline and not cached: return cached index as fallback
        return caches.match('./index.html');
      });
    })
  );
});
