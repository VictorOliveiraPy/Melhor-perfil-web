import Link from 'next/link'
import BidForm from './BidForm'
import { sanitizeDisplayName } from '../lib/sanitize'
import { formatCurrency } from '../lib/formatCurrency'
import { normalizeProfileUrl } from '../lib/normalizeProfileUrl'
import { InstagramIcon, LinkedInIcon } from './icons/PlatformIcons'
import type { BoardListing, Platform } from '../data/mockListings'

type Props = {
  platform: Platform
  listing: BoardListing & { rank: number }
}

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

// Página individual de perfil (spec.md seção 4: "/instagram/p/:id e
// /linkedin/p/:id, com o mesmo conceito de 'selo' clicável do original
// para reforçar a entrada direto daquela página"). É pra cá que o "selo"
// do board (PodiumCard/ProfileCard) leva — único lugar onde o BidForm
// completo aparece de fato.
export default function ProfileDetail({ platform, listing }: Props) {
  const safeName = sanitizeDisplayName(listing.display_name)
  const safeBio = sanitizeDisplayName(listing.bio)
  const url = normalizeProfileUrl(listing.profileUrl) || '#'
  const platformLabel = PLATFORM_LABEL[platform]

  return (
    <main className="profile-detail-page">
      <Link href={`/${platform}`} className="back-link">
        ← Board de {platformLabel}
      </Link>

      <article className="profile-detail-card">
        <div className="profile-detail-header">
          <div className="rank-pill" aria-hidden>
            #{listing.rank}
          </div>

          <div className="avatar avatar-lg" aria-label={`${listing.display_name} avatar`}>
            {listing.avatarUrl ? <img src={listing.avatarUrl} alt={listing.display_name} /> : null}
          </div>

          <div className="profile-copy">
            <div className="profile-headline">
              <h1 dangerouslySetInnerHTML={{ __html: safeName }} />
              <span className="platform-badge" aria-hidden>
                {platform === 'instagram' ? <InstagramIcon /> : <LinkedInIcon />}
                <span>{platformLabel}</span>
              </span>
            </div>

            <p className="profile-meta" dangerouslySetInnerHTML={{ __html: safeBio || 'Sem bio disponível' }} />

            <a className="profile-link" href={url} target="_blank" rel="noreferrer noopener">
              @{listing.profileHandle}
            </a>
          </div>
        </div>

        <div className="profile-detail-stats">
          <div>
            <span>Valor atual</span>
            <strong>{formatCurrency(listing.currentBidCents)}</strong>
          </div>
          <div>
            <span>Cliques (24h)</span>
            <strong>{listing.clicks24h}</strong>
          </div>
          <div>
            <span>Última atualização</span>
            <strong>{listing.timeLabel}</strong>
          </div>
        </div>
      </article>

      <section className="profile-detail-bid">
        <p className="eyebrow">Selo de reforço</p>
        <p className="subtext">
          Cola o mesmo @/link deste perfil aqui embaixo pra reforçar o lance e manter o #{listing.rank}. Se o perfil for
          seu, marque &quot;reforçar&quot; — você paga só a diferença. Caso contrário, um novo lance paga o valor cheio e
          assume a posição.
        </p>
        <BidForm currentBidCents={listing.currentBidCents} platform={platform} />
      </section>
    </main>
  )
}
