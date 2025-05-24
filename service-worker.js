/**
 * Service Worker for Yasodha Residency Website
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'yasodha-residency-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/animations.css',
  '/css/responsive.css',
  '/css/video.css',
  '/js/main.js',
  '/js/animations.js',
  '/js/interactive.js',
  '/js/media-categories.js',
  '/js/gallery-loader.js',
  '/js/video-handler.js',
  '/js/sw-register.js',
  '/assets/favicon.ico',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
  '/manifest.json'
];

// Assets to cache separately (larger files)
const MEDIA_CACHE_NAME = 'yasodha-residency-media-v1';
const MEDIA_ASSETS = [
  '/assets/virtual-tour.mp4'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache media assets separately
      caches.open(MEDIA_CACHE_NAME).then(cache => {
        console.log('Caching media assets');
        return cache.addAll(MEDIA_ASSETS);
      })
    ])
  );
  
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== MEDIA_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Image-specific strategy - cache first, network fallback with cache update
  if (event.request.destination === 'image') {
    event.respondWith(handleImageRequest(event.request));
    return;
  }
  
  // Video-specific strategy - network first with long cache
  if (event.request.destination === 'video') {
    event.respondWith(handleVideoRequest(event.request));
    return;
  }
  
  // Default strategy - stale while revalidate
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached response if available
      if (cachedResponse) {
        // Revalidate in the background
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Update cache with fresh response
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          })
          .catch(error => {
            console.log('Fetch failed:', error);
            // Return original cached response
            return cachedResponse;
          });
          
        // Return cached response immediately
        return cachedResponse;
      }
      
      // If not in cache, fetch from network and cache
      return fetch(event.request)
        .then(response => {
          // Cache the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(error => {
          console.log('Fetch failed:', error);
          // Show offline page if available
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
    })
  );
});

// Handle image requests
async function handleImageRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then(response => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, response);
        });
      })
      .catch(error => console.log('Error updating image cache:', error));
      
    return cachedResponse;
  }
  
  // If not in cache, fetch from network and cache
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Image fetch failed:', error);
    // Return placeholder image if available
    return caches.match('/assets/placeholder.jpg');
  }
}

// Handle video requests
async function handleVideoRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    // Cache the response
    const cache = await caches.open(MEDIA_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Video fetch failed:', error);
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Show error message if nothing in cache
    return new Response('Video unavailable offline', { 
      status: 503, 
      headers: { 'Content-Type': 'text/plain' } 
    });
  }
}