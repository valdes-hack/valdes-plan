// src/service-worker.js
// Configuration du Service Worker avec Workbox

// Importer Workbox
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'

// Pré-cacher les assets
precacheAndRoute(self.__WB_MANIFEST)

// Cache des assets statiques (CSS, JS, images)
registerRoute(
  ({ request }) => 
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)

// Cache des pages HTML
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 jour
      }),
    ],
  })
)

// Cache des API (pour la synchronisation future)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
)

// Gestion des notifications push
self.addEventListener('push', function(event) {
  const data = event.data.json()
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Voir la tâche'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Gestion du clic sur une notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  
  if (event.action === 'open') {
    const url = event.notification.data.url
    event.waitUntil(
      clients.openWindow(url)
    )
  }
})

// Gestion de la mise à jour
self.addEventListener('install', function(event) {
  self.skipWaiting()
})

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim())
})