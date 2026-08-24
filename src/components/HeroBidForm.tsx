"use client"

import { useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { isValidProfileUrl } from '../lib/contentRules'
import { normalizeProfileUrl } from '../lib/normalizeProfileUrl'
import { resolveProfileInput } from '../lib/resolveProfileInput'
import { submitBid } from '../services/bidService'
import { trackEvent } from '../lib/trackEvent'
import type { Platform } from '../lib/platform'

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

// O input+botão da hero sempre foi só HTML estático (type="button", sem
// onClick, sem estado) — parecia funcional porque copiava o visual da
// referência, mas nunca chamou nada. Achado direto pelo usuário testando
// no site: "network não mostra nenhum sinal de chamar nada". Este
// componente é a versão de verdade: escolhe a plataforma (a hero não sabe
// isso sozinha, ao contrário das páginas de board), confirma o lance via
// submitBid() e volta pra própria home — é lá que mora o board (spec.md
// seção 1 + pedido do usuário: "o board deve ser a página inicial"), não
// numa página de perfil isolada sem ranking ao redor. router.refresh()
// força o Server Component da home a buscar de novo (senão o Next
// reaproveitaria o RSC já cacheado, sem o lance novo).
export default function HeroBidForm() {
  const router = useRouter()
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [profileInput, setProfileInput] = useState('')
  const [amount, setAmount] = useState('1')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const amountCents = useMemo(() => Math.round(parseFloat(amount || '0') * 100), [amount])
  const resolvedUrl = useMemo(() => normalizeProfileUrl(resolveProfileInput(profileInput, platform)), [profileInput, platform])
  const urlIsValid = profileInput ? isValidProfileUrl(resolvedUrl) : true
  const canSubmit = profileInput.trim().length > 0 && urlIsValid && amountCents > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)
    try {
      const result = await submitBid(resolvedUrl, platform, amountCents, false)
      // "purchase_completed" do nosso produto — evento que mais importa
      // rastrear (pedido do usuário depois de instalar o Himetrica).
      trackEvent('bid_placed', {
        platform,
        amountCents,
        isReinforcement: result.isReinforcement,
        chargedCents: result.chargedCents,
      })
      setProfileInput('')
      setSubmitSuccess(true)
      // #board: a home permanece na mesma rota, então router.push sozinho
      // não rola a tela pra ver a entrada nova — o hash leva até a seção
      // do board (id="board" em CombinedBoard.tsx). refresh() invalida o
      // Server Component pra buscar de novo (senão o Next reaproveitaria o
      // RSC já cacheado, sem o lance que acabou de entrar).
      router.push('/#board')
      router.refresh()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível confirmar o lance. Tente de novo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Formulário de submissão do perfil">
      <div className="hero-platform-toggle" role="radiogroup" aria-label="Plataforma do perfil">
        {(['instagram', 'linkedin'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={platform === option}
            className={platform === option ? 'active-tab' : 'muted-tab'}
            onClick={() => setPlatform(option)}
          >
            {PLATFORM_LABEL[option]}
          </button>
        ))}
      </div>

      <div className="hero-entry-row">
        <input
          type="text"
          value={profileInput}
          onChange={(event) => setProfileInput(event.target.value)}
          placeholder={platform === 'instagram' ? '@seuarroba ou instagram.com/seuusuario' : '@seuarroba ou linkedin.com/in/seuusuario'}
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
          {isSubmitting ? 'Confirmando…' : 'Pegar o #1'}
        </button>
      </div>

      {!urlIsValid && profileInput && (
        <small className="field-error">Perfil inválido para {PLATFORM_LABEL[platform]}.</small>
      )}
      {submitError && <p className="field-error">{submitError}</p>}
      {submitSuccess && <p className="field-success">Publicado! Já aparece no board aqui embaixo. ↓</p>}
    </form>
  )
}
