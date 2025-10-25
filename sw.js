const CACHE_NAME = 'social-compass-v1';

// Всички пътища трябва да включват двойния префикс за GitHub Pages
const urlsToCache = [
  // Коренната страница (основният път)
  '/Social-Compas-PWA/Social-Compas-PWA/', 
  
  // Основните файлове
  '/Social-Compas-PWA/Social-Compas-PWA/index.html',
  '/Social-Compas-PWA/Social-Compas-PWA/manifest.webmanifest',
  '/Social-Compas-PWA/Social-Compas-PWA/sw.js', 
  
  // Иконите
  '/Social-Compas-PWA/Social-Compas-PWA/icon-192.png',
  '/Social-Compas-PWA/Social-Compas-PWA/icon-512.png',
  
  // Добавете пътищата до всички CSS и JS файлове, ако има такива
];

self.addEventListener('install', event => {
  // Инсталация: Отваряне на кеша и кеширане на всички ресурси
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Кешът е отворен. Започва кеширане на ресурси...');
        // Ако някой файл тук не може да бъде намерен (404), инсталацията ще се провали!
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Успешно кеширане на всички ресурси.');
        return self.skipWaiting(); // Принуждава Service Worker-а да се активира веднага
      })
      .catch(error => {
        console.error('Service Worker: Грешка при кеширането/инсталацията:', error);
      })
  );
});

self.addEventListener('activate', event => {
  // Активация: Изчистване на стари кешове
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Връща True само за кешове, които не са текущия
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          // Изтрива старите кешове
          return caches.delete(cacheName);
        })
      );
    })
  );
  console.log('Service Worker: Активиран и стари кешове изчистени.');
  // Гарантира, че Service Worker-ът поема контрол веднага
  return self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Fetch: Стратегия "Cache, falling back to network" (Кеш, с преминаване към мрежа)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Връщане на ресурса от кеша, ако е намерен
        if (response) {
          return response;
        }
        // В противен случай, търсене в мрежата
        return fetch(event.request);
      })
  );
});
