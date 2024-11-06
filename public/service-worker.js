// service-worker.js

self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'logo192.png',  // Path to an icon file
      badge: 'logo512.png' // Path to a badge icon file
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
});
  
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')  // Replace with the URL you want to open
  );
});
  

// Names for the caches
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// Files to precache for offline
const PRECACHE_URLS = [
  '/', // Add homepage
  '/index.html',
  '/favicon.ico',
  '/images/logo192.png', // Replace with your icon paths
  '/images/logo512.png', // Replace with your icon paths
  '/static/js/bundle.js',
  // Add other URLs for assets you want to cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Skip cross-origin requests (like analytics)
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
