const STATIC_CACHE = 'saksham-static-v1'
const DYNAMIC_CACHE = 'saksham-dynamic-v1'
const IMAGE_CACHE = 'saksham-images-v1'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/placeholder-photo.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              ![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(key),
          )
          .map((key) => caches.delete(key)),
      ),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  const isSameOrigin = url.origin === self.location.origin

  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, IMAGE_CACHE))
    return
  }

  if (isSameOrigin) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  }
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'saksham-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const networkPromise = fetch(request).then((response) => {
    cache.put(request, response.clone())
    return response
  })
  return cached || networkPromise
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    cache.put(request, response.clone())
    return response
  } catch (err) {
    const cached = await cache.match(request)
    if (cached) return cached
    throw err
  }
}

async function handleBackgroundSync() {
  // Placeholder: wired for future API sync calls.
  const clients = await self.clients.matchAll()
  clients.forEach((client) =>
    client.postMessage({ type: 'SYNC_STARTED', timestamp: Date.now() }),
  )
}
