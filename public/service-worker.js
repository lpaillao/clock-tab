// Service Worker for ClockTab PWA

const CACHE_NAME = 'clocktab-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/backgrounds/day.webp',
  '/backgrounds/night.webp',
  '/backgrounds/morning.webp',
  '/backgrounds/sunset.webp',
  '/backgrounds/rain.webp',
  '/backgrounds/cloudy.webp',
  '/icons/clock-icon.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Instalar y cachear recursos esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Limpiar cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de caché: primero cache, luego red con actualización de caché
self.addEventListener('fetch', (event) => {
  // No interceptar peticiones a APIs
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          // Fetch en segundo plano para actualizar caché
          fetch(event.request).then((freshResponse) => {
            if (freshResponse && freshResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, freshResponse);
              });
            }
          }).catch(() => {
            // Error de red, usamos la caché
          });
          return response;
        }

        // No hay coincidencia en caché, fetch de red
        return fetch(event.request).then((response) => {
          // Verificar que sea válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar para caché y navegador
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
  );
});

// Manejar mensajes desde la aplicación
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
