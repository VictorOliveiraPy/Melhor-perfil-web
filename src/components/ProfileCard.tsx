import { sanitizeDisplayName } from '../lib/sanitize'
import { formatCurrency } from '../lib/formatCurrency'
import { normalizeProfileUrl } from '../lib/normalizeProfileUrl'

type Props = {
  rank?: number
  display_name?: string
  bio?: string
  currentBidCents: number
  profileUrl?: string
  platform?: 'instagram' | 'linkedin'
  profileHandle?: string
  clicks24h?: number
  timeLabel?: string
}

export default function ProfileCard({
  rank = 0,
  display_name = 'Usuário',
  bio = '',
  currentBidCents,
  profileUrl,
  platform,
  profileHandle,
  clicks24h = 0,
  timeLabel = 'há 1 hora',
}: Props) {
  const safeName = sanitizeDisplayName(display_name)
  const safeBio = sanitizeDisplayName(bio)
  const url = profileUrl ? normalizeProfileUrl(profileUrl) : '#'
  const platformLabel = platform === 'linkedin' ? 'LinkedIn' : platform === 'instagram' ? 'Instagram' : ''

  return (
    <div className="profile-info">
      <div className="profile-row">
        <div className="rank-pill">#{rank || '—'}</div>
        <div className="avatar" aria-hidden="true" />
        <div className="profile-copy">
          <div className="profile-headline">
            <h3 dangerouslySetInnerHTML={{ __html: safeName }} />
            {platformLabel && <span className="platform-badge">{platformLabel}</span>}
          </div>
          <div className="profile-meta">
            <span dangerouslySetInnerHTML={{ __html: safeBio || 'Sem bio disponível' }} />
          </div>
          <a className="profile-link" href={url} target="_blank" rel="noreferrer noopener">
            @{profileHandle || 'perfil'}
          </a>
        </div>
        <div className="profile-side">
          <div className="time-line">{timeLabel}</div>
          <div className="bid-amount">{formatCurrency(currentBidCents)}</div>
          <div className="click-counter">{clicks24h} cliques</div>
        </div>
      </div>
    </div>
  )
}
