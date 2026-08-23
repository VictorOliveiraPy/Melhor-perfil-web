import Link from 'next/link'
import ProfileCard from './ProfileCard'
import type { BoardListing } from '../data/mockListings'

type Props = {
  listing: BoardListing & { rank: number }
}

// Linha compacta do board: resumo do perfil + link pra página de perfil
// individual (spec.md seção 4: "/instagram/p/:id e /linkedin/p/:id"), que é
// onde o formulário de lance completo mora de verdade — "selo" clicável
// pra reforçar a entrada, igual ao conceito do original. Sem estado local
// aqui: nenhuma interatividade real na linha, então Server Component
// (ver .claude/rules/react/coding-style.md, "Server / Client Boundary").
export default function BidRow({ listing }: Props) {
  const seloHref = `/${listing.platform}/p/${listing.id}`

  return (
    <article className="listing-row card-horizontal">
      <div className="listing-main">
        <ProfileCard
          id={listing.id}
          rank={listing.rank}
          display_name={listing.display_name}
          bio={listing.bio}
          currentBidCents={listing.currentBidCents}
          profileUrl={listing.profileUrl}
          platform={listing.platform}
          profileHandle={listing.profileHandle}
          avatarUrl={listing.avatarUrl}
          clicks24h={listing.clicks24h}
          timeLabel={listing.timeLabel}
        />
      </div>

      <div className="cta">
        <Link href={seloHref} className="secondary-button">
          Aumentar lance
        </Link>
      </div>
    </article>
  )
}
