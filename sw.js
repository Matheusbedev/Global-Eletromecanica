// Service Worker - Global Eletromecânica PWA
const CACHE_NAME = 'global-eletromecanica-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Arquivos para cache estático
const STATIC_FILES = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/LOGO GLOBAL ELETROMECANICA/Global Logo.png',
  '/LOGO GLOBAL ELETROMECANICA/Globo.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@400;500;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.min.js'
];

// Imagens críticas para cache
const CRITICAL_IMAGES = [
  '/FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.58.07 (3).jpeg',
  '/FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.58.07.jpeg',
  '/FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.57.jpeg',
  '/FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 15.21.56.jpeg'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Cache estático criado');
        return cache.addAll(STATIC_FILES);
      }),
      // Cache de imagens críticas
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Service Worker: Cache dinâmico criado');
        return cache.addAll(CRITICAL_IMAGES);
      })
    ])
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Remove caches antigos
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia Cache First para recursos estáticos
  if (STATIC_FILES.includes(url.pathname) || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estratégia Cache First para imagens
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Estratégia Network First para HTML
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Estratégia Network First para APIs externas
  if (url.origin !== location.origin) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Fallback para outras requisições
  event.respondWith(cacheFirst(request));
});

// Estratégia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    // Cache apenas respostas válidas
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Erro na estratégia Cache First:', error);
    
    // Fallback para páginas offline
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}

// Estratégia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache apenas respostas válidas
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Erro na rede, buscando no cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para páginas offline
    if (request.destination === 'document') {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}

// Limpeza periódica do cache
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCache();
  }
});

async function cleanOldCache() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  
  // Remove entradas antigas (mais de 7 dias)
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  for (const request of requests) {
    const response = await cache.match(request);
    const dateHeader = response.headers.get('date');
    
    if (dateHeader) {
      const responseDate = new Date(dateHeader).getTime();
      if (responseDate < oneWeekAgo) {
        await cache.delete(request);
        console.log('Service Worker: Cache antigo removido:', request.url);
      }
    }
  }
}