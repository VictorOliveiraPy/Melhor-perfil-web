import Link from 'next/link'
import { sanitizeDisplayName } from '../lib/sanitize'
import { formatCurrency } from '../lib/formatCurrency'
import { normalizeProfileUrl } from '../lib/normalizeProfileUrl'
import { InstagramIcon, LinkedInIcon } from './icons/PlatformIcons'

type Props = {
  id?: string
  rank?: number
  display_name?: string
  bio?: string
  currentBidCents: number
  profileUrl?: string
  platform?: 'instagram' | 'linkedin'
  profileHandle?: string
  avatarUrl?: string
  clicks24h?: number
  timeLabel?: string
}

export default function ProfileCard({
  id,
  rank = 0,
  display_name = 'Usuário',
  bio = '',
  currentBidCents,
  profileUrl,
  platform,
  profileHandle,
  avatarUrl,
  clicks24h = 0,
  timeLabel = 'há 1 hora',
}: Props) {
  const safeName = sanitizeDisplayName(display_name)
  const safeBio = sanitizeDisplayName(bio)
  const url = profileUrl ? normalizeProfileUrl(profileUrl) : '#'
  const platformLabel = platform === 'linkedin' ? 'LinkedIn' : platform === 'instagram' ? 'Instagram' : ''

  return (
    <div className="profile-info listing-card">
      <div className="profile-row">
        <div className="rank-pill" aria-hidden>
          #{rank || '—'}
        </div>

        <div className="avatar" aria-label={`${display_name} avatar`}>
          {avatarUrl ? <img src={avatarUrl} alt={display_name} /> : null}
        </div>

        <div className="profile-copy">
          <div className="profile-headline">
            <h3 dangerouslySetInnerHTML={{ __html: safeName }} />
            {platform && (
              <span className="platform-badge" aria-hidden>
                {platform === 'instagram' ? <InstagramIcon /> : <LinkedInIcon />}
                <span>{platformLabel}</span>
              </span>
            )}
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
          <div className="click-counter">
            {clicks24h} cliques
            {id && platform && (
              <>
                {' · '}
                <Link href={`/${platform}/p/${id}`} className="selo-link">
                  selo
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
