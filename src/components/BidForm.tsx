"use client"

import { useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { formatCurrency } from '../lib/formatCurrency'
import { isValidProfileUrl } from '../lib/contentRules'
import { normalizeProfileUrl } from '../lib/normalizeProfileUrl'
import { resolveProfileInput } from '../lib/resolveProfileInput'
import { previewBid } from '../lib/previewBid'
import { isSafeAvatarUrl } from '../lib/isSafeAvatarUrl'
import { sanitizeDisplayName } from '../lib/sanitize'
import { trackEvent } from '../lib/trackEvent'
import { submitBid, type BidResult } from '../services/bidService'
import { InstagramIcon, LinkedInIcon } from './icons/PlatformIcons'
import PixPaymentPanel from './PixPaymentPanel'

type Props = {
  currentBidCents: number
  platform?: 'instagram' | 'linkedin'
}

export default function BidForm({ currentBidCents, platform = 'instagram' }: Props) {
  const [profileInput, setProfileInput] = useState('')
  const [amount, setAmount] = useState((currentBidCents / 100).toFixed(2))
  const [isOwner, setIsOwner] = useState(false)
  const [bidResult, setBidResult] = useState<BidResult | null>(null)
  // Mercado Pago integrado (spec.md seção 6/7): o lance não publica na
  // hora — a entrada fica pendente até o webhook confirmar o Pix.
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Achado do usuário testando no ar: uma foto real (@pontifex) carregou
  // quebrada (ícone feio nativo do navegador) em vez de cair no placeholder
  // — URL assinada de CDN de terceiro pode falhar depois de publicada.
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false)

  const amountCents = useMemo(() => Math.round(parseFloat(amount || '0') * 100), [amount])
  const preview = useMemo(() => previewBid({ currentBidCents }, { amountCents, isOwner }), [amountCents, currentBidCents, isOwner])

  const resolvedUrl = useMemo(() => normalizeProfileUrl(resolveProfileInput(profileInput, platform)), [profileInput, platform])
  const urlIsValid = profileInput ? isValidProfileUrl(resolvedUrl) : true
  const canSubmit = profileInput.trim().length > 0 && urlIsValid && amountCents > 0

  function handleProfileInputChange(value: string) {
    setProfileInput(value)
    setBidResult(null)
    setPaymentConfirmed(false)
    setSubmitError(null)
    setAvatarLoadFailed(false)
  }

  // "No momento do lance" (spec.md do melhorperfil-api, seção 4): já cria/
  // reforça a entrada de verdade no Postgres, com o scraping (perfil novo)
  // — mas como pendente, aguardando a cobrança Pix gerada aqui ser paga
  // (seção 6/7). O backend devolve o que já raspou de fato (nome/foto/bio),
  // incluindo se caiu em fallback, mesmo antes do pagamento confirmar. Erro
  // de regra de negócio (valor abaixo do mínimo, reforço que não aumenta o
  // lance) mostra a mensagem real do backend em vez de falhar
  // silenciosamente.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)
    setPaymentConfirmed(false)
    try {
      const result = await submitBid(resolvedUrl, platform, amountCents, isOwner)
      setBidResult(result)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível confirmar o lance. Tente de novo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handlePaymentConfirmed() {
    if (!bidResult) return
    // "purchase_completed" do nosso produto — evento que mais importa
    // rastrear (pedido do usuário depois de instalar o Himetrica). Só
    // dispara aqui, no pagamento CONFIRMADO — antes disso ainda não virou
    // dinheiro de verdade.
    trackEvent('bid_placed', {
      platform,
      amountCents: bidResult.newTotalCents,
      isReinforcement: bidResult.isReinforcement,
      chargedCents: bidResult.chargedCents,
    })
    setPaymentConfirmed(true)
  }

  const safeName = bidResult ? sanitizeDisplayName(bidResult.displayName) : ''
  const safeBio = bidResult?.bio ? sanitizeDisplayName(bidResult.bio) : ''
  const hasSafeAvatar = isSafeAvatarUrl(bidResult?.avatarUrl) && !avatarLoadFailed

  return (
    <form className="bid-form" onSubmit={handleSubmit} aria-label="Formulário de lance">
      <div className="bid-form-header" style={{ justifyContent: 'space-between' }}>
        <div className="platform-badge" aria-hidden>
          {platform === 'instagram' ? <InstagramIcon size={16} /> : <LinkedInIcon size={16} />}
          <span className="preview-label">{platform === 'instagram' ? 'Instagram' : 'LinkedIn'}</span>
        </div>
        <div className="preview-row" style={{ alignItems: 'center' }}>
          <div className="preview-label">Valor atual:</div>
          <div className="preview-value">{formatCurrency(currentBidCents)}</div>
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="profile-input">Perfil</label>
        <input
          id="profile-input"
          value={profileInput}
          onChange={(event) => handleProfileInputChange(event.target.value)}
          placeholder={platform === 'instagram' ? '@seuarroba ou instagram.com/seuusuario' : '@seuarroba ou linkedin.com/in/seuusuario'}
        />
        {!urlIsValid && profileInput && <small className="field-error">Perfil inválido para {platform === 'instagram' ? 'Instagram' : 'LinkedIn'}.</small>}
      </div>

      <div className="field-group inline">
        <label htmlFor="amount">Valor (R$)</label>
        <input id="amount" type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" checked={isOwner} onChange={(event) => setIsOwner(event.target.checked)} />
        Reforçar lance atual (pagar somente a diferença)
      </label>

      <div className="preview-box">
        <span>Preview de cobrança</span>
        <strong>{formatCurrency(preview.chargeCents)}</strong>
      </div>

      {isSubmitting && <p className="profile-fetch-status">Gerando cobrança Pix e buscando foto/bio…</p>}

      {submitError && <p className="field-error">{submitError}</p>}

      {bidResult && (
        <div className="profile-preview-card">
          {hasSafeAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar vem de URL dinâmica (scraping), fora do domínio conhecido em build time
            <img
              className="profile-preview-avatar"
              src={bidResult.avatarUrl}
              alt=""
              onError={() => setAvatarLoadFailed(true)}
            />
          ) : (
            <div className="profile-preview-avatar profile-preview-avatar-empty" aria-hidden />
          )}
          <div className="profile-preview-copy">
            <strong dangerouslySetInnerHTML={{ __html: safeName }} />
            {safeBio ? (
              <p dangerouslySetInnerHTML={{ __html: safeBio }} />
            ) : (
              <p className="profile-preview-fallback-note">Sem bio disponível.</p>
            )}
            {bidResult.usedFallback && (
              <small className="profile-preview-fallback-note">
                Não conseguimos buscar foto/bio automaticamente — publicado só com o @ do perfil.
              </small>
            )}
            {paymentConfirmed ? (
              <p className="profile-preview-fallback-note">
                {/* Pedido do usuário: o board é a página inicial, não a
                    página de perfil isolada (profileDetailHref) — sem
                    ranking ao redor, parecia "não ter nada" depois de
                    publicar. #board rola até a seção do board na home
                    (id="board" em src/app/page.tsx). */}
                <Link href="/#board">Pagamento confirmado! Ver no board →</Link>
              </p>
            ) : (
              <PixPaymentPanel
                listingId={bidResult.listingId}
                transactionId={bidResult.transactionId}
                qrCode={bidResult.pixQrCode}
                qrCodeBase64={bidResult.pixQrCodeBase64}
                onConfirmed={handlePaymentConfirmed}
              />
            )}
          </div>
        </div>
      )}

      <button type="submit" className="primary-button" disabled={!canSubmit || isSubmitting}>
        {isSubmitting ? 'Gerando cobrança…' : 'Pegar o #1'}
      </button>
    </form>
  )
}
