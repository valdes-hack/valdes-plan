// public/sw.js — Service Worker SmartPlan
// Gère le cache offline + les Push Notifications background

const CACHE_NAME = 'smartplan-v2'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/android/launchericon-192x192.png',
  '/icons/android/launchericon-512x512.png',
]

// ── Installation ─────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// ── Activation ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

// ── Fetch (cache-first pour les assets, network-first pour les pages) ────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ne pas intercepter les requêtes API / Supabase
  if (
    url.hostname.includes('supabase.co') ||
    url.pathname.startsWith('/api/')
  ) return

  // Cache-first pour les assets statiques
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((response) => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
          return response
        })
      )
    )
    return
  }

  // Network-first pour la navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    )
  }
})

// ══════════════════════════════════════════════════════════════════════════════
//  PUSH NOTIFICATIONS — reçues même app fermée / écran verrouillé
// ══════════════════════════════════════════════════════════════════════════════

self.addEventListener('push', (event) => {
  let data = {
    title: '📅 SmartPlan',
    body: 'Vous avez une tâche à faire !',
    icon: '/icons/android/launchericon-192x192.png',
    badge: '/icons/android/launchericon-96x96.png',
    url: '/planning',
    tag: 'smartplan-task',
    taskId: null,
  }

  // Parser les données du push
  if (event.data) {
    try {
      const payload = event.data.json()
      data = { ...data, ...payload }
    } catch {
      data.body = event.data.text()
    }
  }

  const options = {
    body:    data.body,
    icon:    data.icon,
    badge:   data.badge,
    tag:     data.tag,
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: data.requireInteraction || false,
    silent:  false,
    data: {
      url:    data.url,
      taskId: data.taskId,
    },
    actions: [
      { action: 'open',  title: '📋 Voir la tâche' },
      { action: 'close', title: 'Fermer' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// ── Clic sur une notification ─────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') return

  const targetUrl = event.notification.data?.url || '/planning'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Si l'app est déjà ouverte, focus + navigation
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus()
            client.postMessage({ type: 'NAVIGATE', url: targetUrl })
            return
          }
        }
        // Sinon ouvrir une nouvelle fenêtre
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl)
        }
      })
  )
})

// ── Push subscription change (token expiré) ──────────────────────────────────
self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: self.VAPID_PUBLIC_KEY,
    }).then((subscription) => {
      // Notifier le client pour mettre à jour la subscription en BDD
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({
            type: 'PUSH_SUBSCRIPTION_CHANGED',
            subscription: subscription.toJSON(),
          })
        )
      })
    })
  )
})
