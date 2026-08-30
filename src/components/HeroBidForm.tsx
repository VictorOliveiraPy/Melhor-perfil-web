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

type Props = {
  // Presente só quando o cupom de lançamento está ativo E ainda tem vaga
  // (ver src/app/page.tsx, que decide isso a partir de
  // fetchLaunchCouponStatus() + NEXT_PUBLIC_LAUNCH_COUPON_CODE — o backend
  // nunca devolve o código em si, só o status). Ausente/null: formulário
  // funciona exatamente como antes, sem nenhuma menção a cupom.
  launchCoupon?: { code: string; remaining: number } | null
}

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
export default function HeroBidForm({ launchCoupon }: Props) {
  const router = useRouter()
  const [profileInput, setProfileInput] = useState('')
  const [amount, setAmount] = useState('1')
  // Enquanto tiver cupom disponível, começa marcado — é o caminho que mais
  // engaja durante o lançamento (entrada grátis), sem esconder atrás de um
  // toggle que a maioria nunca acha. Quem quiser pagar normalmente
  // desmarca.
  const [useCoupon, setUseCoupon] = useState(Boolean(launchCoupon))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  // Mercado Pago integrado (spec.md seção 6/7): o lance não publica na
  // hora — gera uma cobrança Pix, e só o webhook confirmado ativa a
  // entrada. Enquanto isso, mostra o QR code em vez do sucesso direto.
  // Resgate via cupom (paymentStatus="cortesia") nunca passa por aqui —
  // vai direto pro sucesso, não existe QR code pra mostrar.
  const [pendingBid, setPendingBid] = useState<BidResult | null>(null)

  const amountCents = useMemo(() => Math.round(parseFloat(amount || '0') * 100), [amount])
  const resolvedUrl = useMemo(() => normalizeProfileUrl(resolveProfileInput(profileInput, PLATFORM)), [profileInput])
  const urlIsValid = profileInput ? isValidProfileUrl(resolvedUrl) : true
  const canSubmit = profileInput.trim().length > 0 && urlIsValid && (useCoupon || amountCents > 0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      const couponCode = useCoupon && launchCoupon ? launchCoupon.code : undefined
      const result = await submitBid(resolvedUrl, PLATFORM, amountCents, false, couponCode)
      if (result.paymentStatus === 'cortesia') {
        // Cupom ativou a entrada na hora — sem Pix, sem QR code, já é
        // sucesso de verdade (dinheiro/posição de graça, mas real).
        finishWithSuccess(result)
      } else {
        setPendingBid(result)
      }
      setProfileInput('')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível confirmar o lance. Tente de novo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function finishWithSuccess(result: BidResult) {
    // "purchase_completed" do nosso produto — evento que mais importa
    // rastrear (pedido do usuário depois de instalar o Himetrica). Pro
    // cupom, dispara igual: é uma ativação real, só sem cobrança.
    trackEvent('bid_placed', { platform: PLATFORM, amountCents: result.newTotalCents })
    setPendingBid(null)
    setSubmitSuccess(true)
    // #board: a home permanece na mesma rota, então router.push sozinho
    // não rola a tela pra ver a entrada nova — o hash leva até a seção
    // do board (id="board" em src/app/page.tsx). refresh() invalida o
    // Server Component pra buscar de novo (senão o Next reaproveitaria o
    // RSC já cacheado, sem o lance/cupom que acabou de entrar, nem o
    // contador de vagas restantes do banner).
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
        onConfirmed={() => finishWithSuccess(pendingBid)}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Formulário de submissão do perfil" className="hero-form-card">
      <div className="hero-entry-row">
        <div className="hero-field-group">
          <label htmlFor="hero-profile-input">Link do perfil</label>
          <input
            id="hero-profile-input"
            type="text"
            value={profileInput}
            onChange={(event) => setProfileInput(event.target.value)}
            placeholder="@seuarroba ou instagram.com/seuusuario"
          />
        </div>
        {useCoupon && launchCoupon ? (
          <div className="hero-field-group hero-field-amount">
            <label htmlFor="hero-amount-input">Seu lance</label>
            <div className="hero-coupon-free-badge" id="hero-amount-input">
              Grátis 🎁
            </div>
          </div>
        ) : (
          <div className="hero-field-group hero-field-amount">
            <label htmlFor="hero-amount-input">Seu lance</label>
            <div className="hero-amount-wrap">
              <span className="currency-prefix" aria-hidden>R$</span>
              <input
                id="hero-amount-input"
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="hero-amount-input"
                aria-label="Valor do lance em reais"
              />
            </div>
          </div>
        )}
        <button type="submit" className="primary-button" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? 'Gerando cobrança…' : useCoupon && launchCoupon ? 'Entrar grátis no ranking' : 'Pegar o #1'}
        </button>
      </div>

      {launchCoupon && (
        <label className="hero-coupon-toggle">
          <input type="checkbox" checked={useCoupon} onChange={(event) => setUseCoupon(event.target.checked)} />
          Usar cupom de lançamento — entrada grátis (restam {launchCoupon.remaining} vagas)
        </label>
      )}

      {!urlIsValid && profileInput && <small className="field-error">Perfil inválido para Instagram.</small>}
      {submitError && <p className="field-error">{submitError}</p>}
      {submitSuccess && <p className="field-success">Pagamento confirmado! Já aparece no board aqui embaixo. ↓</p>}
      {!submitError && !submitSuccess && (
        <p className="hero-form-hint">
          {useCoupon && launchCoupon
            ? 'Cole o link e entra no ranking na hora, sem pagar nada — vagas do cupom de lançamento são limitadas.'
            : 'Cole o link, escolhe o valor e paga com Pix — o perfil entra no ranking assim que o pagamento confirmar.'}
        </p>
      )}
    </form>
  )
}
