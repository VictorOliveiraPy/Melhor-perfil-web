import BoardSection from './BoardSection'
import BidForm from './BidForm'
import { fetchBoardListings } from '../services/boardApiService'
import { rankListings } from '../lib/rankListings'
import { boardStats } from '../lib/boardStats'
import type { Platform } from '../lib/platform'

type Props = {
  platform: Platform
  heading: string
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
//
// Async porque busca direto do melhorperfil-api (fetchBoardListings) — sem
// mock, sem client-only fetch (CLAUDE.md seção 1: SSR/SSG no board
// público). Server Component async é renderizado normalmente quando
// aninhado dentro de uma page.tsx síncrona.
export default async function Board({ platform, heading }: Props) {
  const listings = await fetchBoardListings(platform)
  const { totalClicks, topBidCents } = boardStats(rankListings(listings))

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

      {/* Achado do usuário: quem entra direto em /instagram ou /linkedin
          (sem passar pela home) não tinha NENHUM jeito de dar lance — só a
          lista. Diferente da hero (HeroBidForm), aqui não precisa de toggle
          de plataforma: a página já é fixa numa só. */}
      <section className="board-entry-form" aria-label={`Entrar no ranking de ${PLATFORM_LABEL[platform]}`}>
        <h2 className="board-entry-heading">Entrar no ranking</h2>
        <BidForm currentBidCents={topBidCents} platform={platform} />
      </section>

      <BoardSection listings={listings} />
    </main>
  )
}
