'use client'

import { useEffect } from 'react'

// Só registra em produção — em dev o service worker cacheando o app shell
// atrapalha o hot reload (fica servindo bundle antigo). Registro falhar
// não pode quebrar o site: PWA é progressive enhancement, o board tem que
// funcionar igual sem isso (por isso o .catch vazio).
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])

  return null
}
