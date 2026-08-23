"use client"

import { useState } from 'react'
import ProfileCard from './ProfileCard'
import BidForm from './BidForm'
import type { BoardListing } from '../data/mockListings'

type Props = {
  listing: BoardListing
}

// O melhorlance.dev de referência mantém cada linha do board compacta —
// só rank, nome e preço — e o lance acontece pelo formulário único do topo.
// Aqui a decisão do usuário (ver commit 1541880) foi manter um formulário
// por linha, então pra não voltar ao card de ~300px sempre aberto, o form
// fica recolhido atrás de um botão "Aumentar lance" e só ocupa espaço
// quando a pessoa realmente quer dar um lance naquela linha.
export default function BidRow({ listing }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className={`listing-row card-horizontal${expanded ? ' is-expanded' : ''}${listing.rank === 1 ? ' is-top' : ''}`}
    >
      <div className="listing-main">
        <ProfileCard
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

      {expanded ? (
        <div className="cta">
          <BidForm currentBidCents={listing.currentBidCents} platform={listing.platform} />
        </div>
      ) : (
        <div className="cta cta-collapsed">
          <button type="button" className="secondary-button" onClick={() => setExpanded(true)}>
            Aumentar lance
          </button>
        </div>
      )}
    </article>
  )
}
