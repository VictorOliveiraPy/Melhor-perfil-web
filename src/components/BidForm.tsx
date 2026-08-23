"use client"

import { useMemo, useState, type FormEvent } from 'react'
import { formatCurrency } from '../lib/formatCurrency'
import { isValidProfileUrl } from '../lib/contentRules'
import { normalizeProfileUrl } from '../lib/normalizeProfileUrl'
import { resolveProfileInput } from '../lib/resolveProfileInput'
import { previewBid } from '../lib/previewBid'
import { sanitizeDisplayName } from '../lib/sanitize'
import { fetchProfilePreview, type ProfilePreview } from '../services/profilePreviewService'
import { InstagramIcon, LinkedInIcon } from './icons/PlatformIcons'

type Props = {
  currentBidCents: number
  platform?: 'instagram' | 'linkedin'
}

export default function BidForm({ currentBidCents, platform = 'instagram' }: Props) {
  const [profileInput, setProfileInput] = useState('')
  const [amount, setAmount] = useState((currentBidCents / 100).toFixed(2))
  const [isOwner, setIsOwner] = useState(false)
  const [profilePreview, setProfilePreview] = useState<ProfilePreview | null>(null)
  const [isFetchingPreview, setIsFetchingPreview] = useState(false)

  const amountCents = useMemo(() => Math.round(parseFloat(amount || '0') * 100), [amount])
  const preview = useMemo(() => previewBid({ currentBidCents }, { amountCents, isOwner }), [amountCents, currentBidCents, isOwner])

  const resolvedUrl = useMemo(() => normalizeProfileUrl(resolveProfileInput(profileInput, platform)), [profileInput, platform])
  const urlIsValid = profileInput ? isValidProfileUrl(resolvedUrl) : true
  const canSubmit = profileInput.trim().length > 0 && urlIsValid && amountCents > 0

  function handleProfileInputChange(value: string) {
    setProfileInput(value)
    setProfilePreview(null)
  }

  // "No momento do lance" (spec.md do melhorperfil-api, seção 4): busca
  // foto/bio reais a partir do link só quando a pessoa confirma o lance,
  // não a cada tecla digitada. O scraping de verdade roda no
  // melhorperfil-api; enquanto o endpoint não existe (ou falha), o
  // service devolve fallback (nome = @handle) — é o que aparece aqui
  // embaixo de qualquer jeito, sem travar o fluxo.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit || isFetchingPreview) return

    setIsFetchingPreview(true)
    try {
      const result = await fetchProfilePreview(resolvedUrl, platform)
      setProfilePreview(result)
    } finally {
      setIsFetchingPreview(false)
    }
  }

  const safeName = profilePreview ? sanitizeDisplayName(profilePreview.display_name) : ''
  const safeBio = profilePreview?.bio ? sanitizeDisplayName(profilePreview.bio) : ''
  const hasSafeAvatar = Boolean(profilePreview?.avatarUrl && profilePreview.avatarUrl.startsWith('https://'))

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

      {isFetchingPreview && <p className="profile-fetch-status">Buscando foto e descrição do perfil…</p>}

      {profilePreview && (
        <div className="profile-preview-card">
          {hasSafeAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element -- avatar vem de URL dinâmica (scraping), fora do domínio conhecido em build time
            <img className="profile-preview-avatar" src={profilePreview.avatarUrl} alt="" />
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
            {profilePreview.usedFallback && (
              <small className="profile-preview-fallback-note">
                Não conseguimos buscar foto/bio automaticamente — publicando só com o @ do perfil.
              </small>
            )}
          </div>
        </div>
      )}

      <button type="submit" className="primary-button" disabled={!canSubmit || isFetchingPreview}>
        {isFetchingPreview ? 'Buscando perfil…' : 'Pegar o #1'}
      </button>
    </form>
  )
}
