'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AvatarImage from './AvatarImage'
import { sanitizeDisplayName } from '../lib/sanitize'
import { formatCurrency } from '../lib/formatCurrency'
import { normalizeProfileUrl } from '../lib/normalizeProfileUrl'
import { profileDetailHref } from '../lib/profileDetailHref'
import { registerCardClick } from '../services/clickService'
import { InstagramIcon, LinkedInIcon } from './icons/PlatformIcons'
import type { BoardListing } from '../lib/boardListing'

type Props = {
  listing: BoardListing & { rank: number }
}

// Card do top-3, igual ao pódio do melhorlance.dev (os 3 primeiros ganham
// destaque visual em relação à lista comum abaixo). O #1 leva o tint tonal;
// #2 e #3 ficam neutros — mesma leitura do site de referência.
export default function PodiumCard({ listing }: Props) {
  const router = useRouter()
  const safeName = sanitizeDisplayName(listing.display_name)
  const safeBio = sanitizeDisplayName(listing.bio)
  const seloHref = profileDetailHref(listing.platform, listing.id)
  const profileUrl = (listing.profileUrl && normalizeProfileUrl(listing.profileUrl)) || '#'

  // Achado do usuário (2026-08-28): o card do pódio inteiro linkava só pra
  // nossa página interna de detalhe/selo — diferente do #4 pra baixo
  // (ProfileCard), que abre o perfil real do Instagram em nova aba e
  // registra o clique (spec.md seção 4/7, item 6: "qualquer clique num
  // card"). Corrigido pra abrir o perfil real igual ao resto da lista;
  // "selo" continua indo pra página de detalhe, como um link separado (não
  // aninhado dentro do <a> — <a> dentro de <a> é HTML inválido).
  function handleProfileLinkClick() {
    registerCardClick(listing.id).then(() => router.refresh())
  }

  return (
    <div className={`podium-card${listing.rank === 1 ? ' is-first' : ''}`} style={{ position: 'relative' }}>
      <Link href={seloHref} className="selo-link podium-selo-overlay">
        selo
      </Link>

      <a
        href={profileUrl}
        target="_blank"
        rel="noreferrer noopener"
        onClick={handleProfileLinkClick}
        className="podium-card-link"
      >
        <div className="podium-top">
          <span className="rank-pill" aria-hidden>
            #{listing.rank}
          </span>
          <span className="podium-clicks">{listing.clicks24h} cliques</span>
        </div>

        <div className="podium-name">
          {/* Achado do usuário: os 3 primeiros (pódio) nunca mostravam foto —
              não era bug do scraping/download, o componente do pódio nunca
              teve <img> nenhum, diferente do ProfileCard usado do #4 em
              diante. */}
          <div className="avatar podium-avatar" aria-label={`${listing.display_name} avatar`}>
            <AvatarImage src={listing.avatarUrl} alt={listing.display_name} />
          </div>
          {listing.platform === 'instagram' ? <InstagramIcon size={18} /> : <LinkedInIcon size={18} />}
          <span dangerouslySetInnerHTML={{ __html: safeName }} />
        </div>

        <p className="podium-bio" dangerouslySetInnerHTML={{ __html: safeBio || 'Sem bio disponível' }} />

        <div className="podium-bottom">
          <span className="time-line">{listing.timeLabel}</span>
          <span className="podium-price">{formatCurrency(listing.currentBidCents)}</span>
        </div>
      </a>
    </div>
  )
}
