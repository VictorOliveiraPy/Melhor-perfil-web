import BidRow from './BidRow'
import PodiumCard from './PodiumCard'
import { rankListings } from '../lib/rankListings'
import type { BoardListing } from '../data/mockListings'

type Props = {
  listings: BoardListing[]
}

// Pódio + lista de uma plataforma, sem heading/meta própria — usado tanto
// por Board.tsx (página cheia de uma plataforma só) quanto por
// src/app/board/page.tsx (as duas plataformas lado a lado, ver comentário
// lá). O ranking é sempre calculado só a partir de `listings`: mesmo
// quando as duas seções aparecem juntas na mesma página, Instagram e
// LinkedIn nunca disputam a mesma lista (spec.md seção 1, "Isolamento por
// board") — é só a visualização que fica lado a lado.
export default function BoardSection({ listings }: Props) {
  const ranked = rankListings(listings)
  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <>
      {top3.length > 0 && (
        <div className="podium">
          {top3.map((listing) => (
            <PodiumCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="board-list">
          {rest.map((listing) => (
            <BidRow key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </>
  )
}
