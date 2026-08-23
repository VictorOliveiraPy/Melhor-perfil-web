import BoardSection from './BoardSection'
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

// Página cheia de uma plataforma — spec.md seção 1: "Dois boards
// independentes, não um único board misto". /instagram e /linkedin
// renderizam este mesmo componente, cada um só com as entradas (e o
// ranking) da sua plataforma. Ver também src/app/board/page.tsx: as duas
// plataformas lado a lado numa página só, pra quem quer ver as duas sem
// trocar de rota — visual apenas, o ranking de cada uma continua isolado.
export default function Board({ platform, heading, listings }: Props) {
  const { totalClicks } = boardStats(rankListings(listings))

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

      <BoardSection listings={listings} />
    </main>
  )
}
