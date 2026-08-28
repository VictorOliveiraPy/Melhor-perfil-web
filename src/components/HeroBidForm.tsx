"use client"

import { useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { isValidProfileUrl } from '../lib/contentRules'
import { normalizeProfileUrl } from '../lib/normalizeProfileUrl'
import { resolveProfileInput } from '../lib/resolveProfileInput'
import { submitBid, type BidResult } from '../services/bidService'
import { trackEvent } from '../lib/trackEvent'
import PixPaymentPanel from './PixPaymentPanel'

// Produto focado só em Instagram (decisão do usuário, 2026-08-25) — o
// toggle de plataforma (Instagram/LinkedIn) saiu daqui; sempre publica no
// Instagram, não precisa mais perguntar.
const PLATFORM = 'instagram' as const

// O input+botão da hero sempre foi só HTML estático (type="button", sem
// onClick, sem estado) — parecia funcional porque copiava o visual da
// referência, mas nunca chamou nada. Achado direto pelo usuário testando
// no site: "network não mostra nenhum sinal de chamar nada". Este
// componente é a versão de verdade: confirma o lance via submitBid() e
// volta pra própria home — é lá que mora o board (spec.md seção 1 +
// pedido do usuário: "o board deve ser a página inicial"), não numa
// página de perfil isolada sem ranking ao redor. router.refresh() força o
// Server Component da home a buscar de novo (senão o Next reaproveitaria
// o RSC já cacheado, sem o lance novo).
export default function HeroBidForm() {
  const router = useRouter()
  const [profileInput, setProfileInput] = useState('')
  const [amount, setAmount] = useState('1')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  // Mercado Pago integrado (spec.md seção 6/7): o lance não publica na
  // hora — gera uma cobrança Pix, e só o webhook confirmado ativa a
  // entrada. Enquanto isso, mostra o QR code em vez do sucesso direto.
  const [pendingBid, setPendingBid] = useState<BidResult | null>(null)

  const amountCents = useMemo(() => Math.round(parseFloat(amount || '0') * 100), [amount])
  const resolvedUrl = useMemo(() => normalizeProfileUrl(resolveProfileInput(profileInput, PLATFORM)), [profileInput])
  const urlIsValid = profileInput ? isValidProfileUrl(resolvedUrl) : true
  const canSubmit = profileInput.trim().length > 0 && urlIsValid && amountCents > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      const result = await submitBid(resolvedUrl, PLATFORM, amountCents, false)
      setPendingBid(result)
      setProfileInput('')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível confirmar o lance. Tente de novo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handlePaymentConfirmed() {
    if (!pendingBid) return
    // "purchase_completed" do nosso produto — evento que mais importa
    // rastrear (pedido do usuário depois de instalar o Himetrica). Só
    // dispara aqui, no pagamento CONFIRMADO — antes disso ainda não virou
    // dinheiro de verdade.
    trackEvent('bid_placed', { platform: PLATFORM, amountCents: pendingBid.newTotalCents })
    setPendingBid(null)
    setSubmitSuccess(true)
    // #board: a home permanece na mesma rota, então router.push sozinho
    // não rola a tela pra ver a entrada nova — o hash leva até a seção
    // do board (id="board" em src/app/page.tsx). refresh() invalida o
    // Server Component pra buscar de novo (senão o Next reaproveitaria o
    // RSC já cacheado, sem o lance que acabou de entrar).
    router.push('/#board')
    router.refresh()
  }

  if (pendingBid) {
    return (
      <PixPaymentPanel
        listingId={pendingBid.listingId}
        transactionId={pendingBid.transactionId}
        qrCode={pendingBid.pixQrCode}
        qrCodeBase64={pendingBid.pixQrCodeBase64}
        onConfirmed={handlePaymentConfirmed}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Formulário de submissão do perfil">
      <div className="hero-entry-row">
        <input
          type="text"
          value={profileInput}
          onChange={(event) => setProfileInput(event.target.value)}
          placeholder="@seuarroba ou instagram.com/seuusuario"
          aria-label="Link do perfil ou @arroba"
        />
        <input
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="hero-amount-input"
          aria-label="Valor do lance em reais"
        />
        <button type="submit" className="primary-button" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Gerando cobrança…' : 'Pegar o #1'}
        </button>
      </div>

      {!urlIsValid && profileInput && <small className="field-error">Perfil inválido para Instagram.</small>}
      {submitError && <p className="field-error">{submitError}</p>}
      {submitSuccess && <p className="field-success">Pagamento confirmado! Já aparece no board aqui embaixo. ↓</p>}
    </form>
  )
}
