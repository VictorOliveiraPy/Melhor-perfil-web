// Service worker do melhorperfil — cache só do "app shell" (fallback
// offline estático). NÃO cacheia o board nem nenhuma rota dinâmica: lance
// e ranking têm que ser sempre dado ao vivo, mostrar um ranking
// desatualizado offline seria pior que não mostrar nada (o produto inteiro
// depende de dado em tempo real, ver spec.md seção 4).
const CACHE_NAME = 'melhorperfil-shell-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

// Só intercepta navegação de página (GET, mode 'navigate') — toda chamada
// de API/asset segue o comportamento normal do navegador, sem interceptar.
// Se a rede falhar de verdade (sem conexão), cai no fallback estático em
// vez do erro cru do Chrome ("Não há conexão com a Internet").
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return

  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)))
})
