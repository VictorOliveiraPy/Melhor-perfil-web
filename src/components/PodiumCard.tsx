import Link from 'next/link'
import { sanitizeDisplayName } from '../lib/sanitize'
import { formatCurrency } from '../lib/formatCurrency'
import { profileDetailHref } from '../lib/profileDetailHref'
import { InstagramIcon, LinkedInIcon } from './icons/PlatformIcons'
import type { BoardListing } from '../lib/boardListing'

type Props = {
  listing: BoardListing & { rank: number }
}

// Card do top-3, igual ao pódio do melhorlance.dev (os 3 primeiros ganham
// destaque visual em relação à lista comum abaixo). O #1 leva o tint tonal;
// #2 e #3 ficam neutros — mesma leitura do site de referência.
export default function PodiumCard({ listing }: Props) {
  const safeName = sanitizeDisplayName(listing.display_name)
  const safeBio = sanitizeDisplayName(listing.bio)
  const seloHref = profileDetailHref(listing.platform, listing.id)

  return (
    <Link href={seloHref} className={`podium-card${listing.rank === 1 ? ' is-first' : ''}`}>
      <div className="podium-top">
        <span className="rank-pill" aria-hidden>
          #{listing.rank}
        </span>
        <span className="podium-clicks">
          {listing.clicks24h} cliques · <span className="selo-link">selo</span>
        </span>
      </div>

      <div className="podium-name">
        {listing.platform === 'instagram' ? <InstagramIcon size={18} /> : <LinkedInIcon size={18} />}
        <span dangerouslySetInnerHTML={{ __html: safeName }} />
      </div>

      <p className="podium-bio" dangerouslySetInnerHTML={{ __html: safeBio || 'Sem bio disponível' }} />

      <div className="podium-bottom">
        <span className="time-line">{listing.timeLabel}</span>
        <span className="podium-price">{formatCurrency(listing.currentBidCents)}</span>
      </div>
    </Link>
  )
}
