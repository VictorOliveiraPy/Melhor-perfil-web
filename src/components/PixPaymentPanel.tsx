"use client"

import { useEffect, useRef, useState } from 'react'
import { fetchListingStatus } from '../services/listingStatusService'

type Props = {
  listingId: number
  qrCode: string
  qrCodeBase64: string
  onConfirmed: () => void
}

const POLL_INTERVAL_MS = 3000

// Pix não confirma na hora — a pessoa escaneia o QR code (ou cola o código)
// no app do banco, e o Mercado Pago avisa a gente via webhook alguns
// segundos depois (spec.md seção 6/7). Decisão do usuário: polling
// automático em vez de botão manual "já paguei" — fica perguntando sozinho
// até confirmar, sem exigir ação nenhuma de quem pagou.
//
// setTimeout recursivo (agenda a próxima chamada só depois da anterior
// terminar), não setInterval — evita empilhar requisições se uma demorar
// mais que POLL_INTERVAL_MS.
export default function PixPaymentPanel({ listingId, qrCode, qrCodeBase64, onConfirmed }: Props) {
  const [copied, setCopied] = useState(false)
  const onConfirmedRef = useRef(onConfirmed)
  onConfirmedRef.current = onConfirmed

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    async function poll() {
      const result = await fetchListingStatus(listingId)
      if (cancelled) return

      if (result?.status === 'ativa') {
        onConfirmedRef.current()
        return
      }

      timeoutId = setTimeout(poll, POLL_INTERVAL_MS)
    }

    timeoutId = setTimeout(poll, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [listingId])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard pode falhar (permissão negada, contexto sem HTTPS) — não
      // é crítico, a pessoa ainda consegue selecionar o texto manualmente.
    }
  }

  return (
    <div className="pix-payment-panel">
      <p className="pix-instructions">Escaneie o QR code ou copie o código Pix pra pagar</p>
      {/* eslint-disable-next-line @next/next/no-img-element -- imagem gerada na hora (base64), não é asset estático */}
      <img className="pix-qr-image" src={`data:image/png;base64,${qrCodeBase64}`} alt="QR code Pix" />
      <div className="pix-copy-row">
        <input
          readOnly
          value={qrCode}
          aria-label="Código Pix copia e cola"
          onFocus={(event) => event.target.select()}
        />
        <button type="button" onClick={handleCopy} className="secondary-button">
          {copied ? 'Copiado!' : 'Copiar código'}
        </button>
      </div>
      <p className="pix-waiting">Aguardando confirmação do pagamento…</p>
    </div>
  )
}
