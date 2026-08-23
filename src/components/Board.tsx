import BidRow from './BidRow'
import { rankListings } from '../lib/rankListings'
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
  const totalClicks = ranked.reduce((sum, listing) => sum + listing.clicks24h, 0)

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

      <section className="board-list">
        {ranked.map((listing) => (
          <BidRow key={listing.id} listing={listing} />
        ))}
      </section>
    </main>
  )
}
