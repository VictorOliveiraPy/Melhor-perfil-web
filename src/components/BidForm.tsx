"use client"

import { useMemo, useState } from 'react'
import { formatCurrency } from '../lib/formatCurrency'
import { isForbiddenBio, isValidProfileUrl } from '../lib/contentRules'
import { previewBid } from '../lib/previewBid'
import { InstagramIcon, LinkedInIcon } from './icons/PlatformIcons'

type Props = {
  currentBidCents: number
  platform?: 'instagram' | 'linkedin'
}

export default function BidForm({ currentBidCents, platform = 'instagram' }: Props) {
  const [displayName, setDisplayName] = useState('')
  const [profileUrl, setProfileUrl] = useState('')
  const [bio, setBio] = useState('')
  const [amount, setAmount] = useState((currentBidCents / 100).toFixed(2))
  const [isOwner, setIsOwner] = useState(false)

  const amountCents = useMemo(() => Math.round(parseFloat(amount || '0') * 100), [amount])
  const preview = useMemo(() => previewBid({ currentBidCents }, { amountCents, isOwner }), [amountCents, currentBidCents, isOwner])

  const urlIsValid = profileUrl ? isValidProfileUrl(profileUrl) : true
  const bioHasForbiddenContent = bio ? isForbiddenBio(bio) : false
  const canSubmit = displayName.trim().length > 0 && urlIsValid && !bioHasForbiddenContent && amountCents > 0

  return (
    <form className="bid-form" onSubmit={(event) => event.preventDefault()} aria-label="Formulário de lance">
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
        <label htmlFor="display-name">Nome de exibição</label>
        <input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Seu nome no board" />
      </div>

      <div className="field-group">
        <label htmlFor="profile-url">URL do perfil</label>
        <input
          id="profile-url"
          type="url"
          value={profileUrl}
          onChange={(event) => setProfileUrl(event.target.value)}
          placeholder={platform === 'instagram' ? 'instagram.com/seuusuario' : 'linkedin.com/in/seuusuario'}
        />
        {!urlIsValid && profileUrl && <small className="field-error">URL inválida para {platform === 'instagram' ? 'Instagram' : 'LinkedIn'}.</small>}
      </div>

      <div className="field-group">
        <label htmlFor="bio">Bio / pitch</label>
        <textarea id="bio" rows={3} value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Descreva seu perfil em até 140 caracteres" />
        {bioHasForbiddenContent && <small className="field-error">Bio com link proibido: WhatsApp, Telegram, Discord, Messenger ou Signal.</small>}
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

      <button type="submit" className="primary-button" disabled={!canSubmit}>
        Pegar o #1
      </button>
    </form>
  )
}
