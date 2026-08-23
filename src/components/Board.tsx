import BidRow from './BidRow'
import PodiumCard from './PodiumCard'
import { rankListings } from '../lib/rankListings'
import { boardStats } from '../lib/boardStats'
import type { BoardListing, Platform } from '../data/mockListings'

type Props = {
  platform: Platform
  heading: string
  listings: BoardListing[]
}

const PLATFORM_LABEL: Record<Platform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
}

// Board por plataforma — spec.md seção 1: "Dois boards independentes, não
// um único board misto". /instagram e /linkedin renderizam este mesmo
// componente, cada um só com as entradas (e o ranking) da sua plataforma.
export default function Board({ platform, heading, listings }: Props) {
  const ranked = rankListings(listings)
  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)
  const { totalClicks } = boardStats(ranked)

  return (
    <main className="board-page">
      <div className="board-topbar">
        <div>
          <p className="eyebrow">Board · {PLATFORM_LABEL[platform]}</p>
          <h1>{heading}</h1>
        </div>
      </div>

      <div className="board-meta-row">
        <span>Atualizado há 1 segundo</span>
        <span>·</span>
        <a href="#">Atualizar</a>
        <span>·</span>
        <span>{totalClicks.toLocaleString('pt-BR')} cliques em visibilidade</span>
      </div>

      {top3.length > 0 && (
        <div className="podium">
          {top3.map((listing) => (
            <PodiumCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <section className="board-list">
          {rest.map((listing) => (
            <BidRow key={listing.id} listing={listing} />
          ))}
        </section>
      )}
    </main>
  )
}
