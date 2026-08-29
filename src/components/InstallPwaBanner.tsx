'use client'

import { useEffect, useState } from 'react'
import { shouldShowInstallBanner } from '../lib/shouldShowInstallBanner'

const DISMISS_KEY = 'melhorperfil:install-banner-dismissed-at'

// BeforeInstallPromptEvent não faz parte do lib.dom.d.ts padrão do
// TypeScript (proposta ainda não é standard cross-browser — Safari/iOS não
// implementa, o evento simplesmente nunca dispara lá) — tipagem mínima só
// do que este componente usa.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Sugere instalar o PWA em vez de depender do usuário achar sozinho a
// opção no menu do Chrome. Lógica de "reaparecer depois de dispensado" é
// pura e testada em shouldShowInstallBanner.ts — este componente só
// conecta isso ao BeforeInstallPromptEvent do navegador.
export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()

      let lastDismissedAt: string | null = null
      try {
        lastDismissedAt = window.localStorage.getItem(DISMISS_KEY)
      } catch {
        // Storage bloqueado (aba anônima restrita etc.) — trata como nunca
        // dispensado, mostra o banner mesmo assim.
      }

      if (!shouldShowInstallBanner(lastDismissedAt, new Date())) return

      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    function handleAppInstalled() {
      setVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function handleInstallClick() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  function handleDismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, new Date().toISOString())
    } catch {
      // Sem storage disponível — só fecha nesta sessão, sem persistir.
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="install-banner" role="complementary" aria-label="Instalar o app">
      <span>Instala o melhorperfil no seu celular pra abrir como app.</span>
      <div className="install-banner-actions">
        <button type="button" onClick={handleInstallClick} className="primary-button">
          Instalar
        </button>
        <button type="button" onClick={handleDismiss} aria-label="Dispensar" className="install-banner-dismiss">
          ✕
        </button>
      </div>
    </div>
  )
}
