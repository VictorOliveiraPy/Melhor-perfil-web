'use client'

import { useEffect, useState } from 'react'
import { shouldShowInstallBanner } from '../lib/shouldShowInstallBanner'
import { isIosSafari } from '../lib/isIosSafari'

const DISMISS_KEY = 'melhorperfil:install-banner-dismissed-at'

// BeforeInstallPromptEvent não faz parte do lib.dom.d.ts padrão do
// TypeScript (proposta ainda não é standard cross-browser — Safari/iOS não
// implementa, o evento simplesmente nunca dispara lá) — tipagem mínima só
// do que este componente usa.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type BannerMode = 'android' | 'ios' | null

function readDismissedAt(): string | null {
  try {
    return window.localStorage.getItem(DISMISS_KEY)
  } catch {
    // Storage bloqueado (aba anônima restrita etc.) — trata como nunca
    // dispensado, mostra o banner mesmo assim.
    return null
  }
}

// PWA já instalado, aberto sem barra de endereço — display-mode:standalone
// cobre Android/desktop, navigator.standalone é a propriedade específica
// do iOS pro mesmo estado (não existe no lib.dom.d.ts, daí o cast).
function isRunningStandalone(): boolean {
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true
  return window.matchMedia('(display-mode: standalone)').matches || iosStandalone
}

// Sugere instalar o PWA em vez de depender do usuário achar sozinho a
// opção. Dois modos, achado em produção 2026-08-29 (usuário testou no
// iPhone e não apareceu nada): Android/Chrome dispara
// beforeinstallprompt e o botão "Instalar" funciona de verdade; iOS/Safari
// nunca implementou essa API — lá o único caminho é manual (Compartilhar >
// Adicionar à Tela de Início), então o banner vira só instrução, sem botão
// que não faria nada. Lógica de "reaparecer depois de dispensado" é pura e
// testada em shouldShowInstallBanner.ts; detecção de iOS/Safari em
// isIosSafari.ts.
export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [mode, setMode] = useState<BannerMode>(null)

  useEffect(() => {
    if (isRunningStandalone()) return

    if (isIosSafari(navigator.userAgent) && shouldShowInstallBanner(readDismissedAt(), new Date())) {
      setMode('ios')
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      if (!shouldShowInstallBanner(readDismissedAt(), new Date())) return

      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setMode('android')
    }

    function handleAppInstalled() {
      setMode(null)
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
    setMode(null)
  }

  function handleDismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, new Date().toISOString())
    } catch {
      // Sem storage disponível — só fecha nesta sessão, sem persistir.
    }
    setMode(null)
  }

  if (!mode) return null

  return (
    <div className="install-banner" role="complementary" aria-label="Instalar o app">
      {mode === 'android' ? (
        <>
          <span>Instala o melhorperfil no seu celular pra abrir como app.</span>
          <div className="install-banner-actions">
            <button type="button" onClick={handleInstallClick} className="primary-button">
              Instalar
            </button>
            <button type="button" onClick={handleDismiss} aria-label="Dispensar" className="install-banner-dismiss">
              ✕
            </button>
          </div>
        </>
      ) : (
        <>
          <span>
            No iPhone: toque em <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong> pra
            instalar o app.
          </span>
          <div className="install-banner-actions">
            <button type="button" onClick={handleDismiss} aria-label="Dispensar" className="install-banner-dismiss">
              ✕
            </button>
          </div>
        </>
      )}
    </div>
  )
}
