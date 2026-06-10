const CACHE = 'whispr-v1'
const OFFLINE_URL = '/offline.html'
const PRECACHE = [OFFLINE_URL, '/icons/favicon.svg', '/manifest.json']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)))
    return
  }

  const isStatic =
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/icons') ||
    /\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico|webp)$/.test(url.pathname)

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy))
            return res
          }),
      ),
    )
  }
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data && event.data.text() }
  }

  const title = data.title || 'New whispr'
  const options = {
    body: data.body || 'You got a new anonymous message.',
    icon: '/icons/android-chrome-192x192.png',
    badge: '/icons/favicon.svg',
    tag: 'whispr',
    data: { url: data.url || '/dashboard' },
  }

  event.waitUntil(
    self.registration.showNotification(title, options).then(() => {
      if (typeof data.unread === 'number' && self.navigator && 'setAppBadge' in self.navigator) {
        self.navigator.setAppBadge(data.unread).catch(() => {})
      }
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = (event.notification.data && event.notification.data.url) || '/dashboard'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(target))
      if (existing) return existing.focus()
      return self.clients.openWindow(target)
    }),
  )
})
