"use client"

import { useEffect, useRef, useState } from 'react'
import { fetchListingStatus } from '../services/listingStatusService'
import { isPaymentConfirmed } from '../lib/isPaymentConfirmed'

type Props = {
  listingId: number
  // public_token da BidTransaction gerada por este lance/reforço/takeover
  // (BidResult.transactionId) — usado no polling pra checar SE ESTE PIX
  // específico foi pago, não o status agregado do listing (achado em
  // produção 2026-08-27, spec.md seção 7: numa entrada já "ativa", o
  // status do listing não muda até o reforço/ultrapassagem ser aplicado).
  transactionId: string
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
export default function PixPaymentPanel({ listingId, transactionId, qrCode, qrCodeBase64, onConfirmed }: Props) {
  const [copied, setCopied] = useState(false)
  const onConfirmedRef = useRef(onConfirmed)
  onConfirmedRef.current = onConfirmed

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    async function poll() {
      const result = await fetchListingStatus(listingId, transactionId)
      if (cancelled) return

      // isPaymentConfirmed (src/lib) checa a TRANSAÇÃO específica
      // (?transactionId=), não o listing inteiro — `status` do listing pode
      // já estar "ativa" por causa de uma entrada anterior (achado em
      // produção 2026-08-27, spec.md seção 7). Confiar em `status` aqui
      // fechava o QR como "confirmado" antes do Pix novo ser pago de fato.
      if (isPaymentConfirmed(result?.transactionStatus ?? null)) {
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
  }, [listingId, transactionId])

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
