import BidRow from './BidRow'
import PodiumCard from './PodiumCard'
import { rankListings } from '../lib/rankListings'
import type { BoardListing } from '../lib/boardListing'

type Props = {
  listings: BoardListing[]
}

// Pódio + lista, sem heading/meta própria — usado tanto por Board.tsx
// (página /instagram) quanto direto na home (src/app/page.tsx). Produto
// focado só em Instagram (decisão do usuário, 2026-08-25); o componente
// não sabe/precisa saber de plataforma, só ranqueia o que vier em
// `listings`.
export default function BoardSection({ listings }: Props) {
  const ranked = rankListings(listings)
  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  if (ranked.length === 0) {
    return (
      <p className="board-empty">
        Ainda não tem ninguém neste board. Cola seu @/link no formulário aqui em cima e seja o primeiro #1.
      </p>
    )
  }

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
