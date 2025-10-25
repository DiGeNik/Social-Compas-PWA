const CACHE_NAME = 'social-compass-v1';
const urlsToCache = [
  const urlsToCache = [
  '/social-compas-pwa/', // Коренната страница
  '/social-compas-pwa/index.html',
  '/social-compas-pwa/manifest.webmanifest',
  '/social-compas-pwa/icon-192.png', 
  '/social-compas-pwa/icon-512.png', 
];
  // Добавете всички други ресурси (CSS, JS, други изображения) тук
];

self.addEventListener('install', event => {
  // Кеширане на основните ресурси
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Стратегия: Cache, falling back to network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Връщане на ресурса от кеша, ако е наличен
        if (response) {
          return response;
        }
        // В противен случай, търсене в мрежата
        return fetch(event.request);
      })
  );
});
