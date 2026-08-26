import Link from 'next/link'
import BoardSection from '../components/BoardSection'
import HeroBidForm from '../components/HeroBidForm'
import { siteAnalytics } from '../data/mockAnalytics'
import { fetchBoardListings } from '../services/boardApiService'
import { boardStats } from '../lib/boardStats'
import { rankListings } from '../lib/rankListings'
import { heroTargetBidCents } from '../lib/heroTargetBidCents'
import { formatCurrency } from '../lib/formatCurrency'

// Precisa buscar o board antes de montar a hero (o valor mostrado depende
// do maior lance atual — ver heroTargetBidCents) e depender de dado ao vivo
// do melhorperfil-api — sem isso o Next congelaria a página como estática
// no build (achado em produção 2026-08-23: build sem API_BASE_URL virou
// HTML estático com board vazio "pra sempre").
export const dynamic = 'force-dynamic'

// Produto focado só em Instagram (decisão do usuário, 2026-08-25) — LinkedIn
// removido de vez da UI (/linkedin, /board combinado, toggle de plataforma
// no formulário). O backend continua aceitando URL do LinkedIn sem
// problema; só não tem mais nenhuma tela que publique lá.
export default async function Home() {
  const listings = await fetchBoardListings('instagram')
  const ranked = rankListings(listings)
  const { totalClicks, topBidCents } = boardStats(ranked)
  const heroAmountCents = heroTargetBidCents([topBidCents])

  return (
    <main className="landing-shell">
      <section className="hero-intro-row">
        <p className="hero-copy-line">
          Um leaderboard público de perfis brasileiros. Ninguém aqui vai te dar upvote por pena.
          <strong> Vai deixar o #1 pra outro viralizar?</strong>
        </p>

        {/* Analytics próprio (src/app/analytics) — não linka mais pro
            dashboard do melhorlance.dev, o site de referência. */}
        <div className="proof-card" aria-label="Indicadores de tráfego">
          <p>
            <span className="proof-dot" aria-hidden />
            <strong>{siteAnalytics.peopleOnline}</strong>&nbsp;pessoas online agora
          </p>
          <p>
            <strong>{siteAnalytics.visitors.toLocaleString('pt-BR')}</strong> visitantes &amp;{' '}
            {siteAnalytics.pageviews.toLocaleString('pt-BR')} pageviews desde o lançamento
          </p>
          <Link href="/analytics">ver o analytics →</Link>
        </div>
      </section>

      <h1 className="hero-heading">
        <span>Pegue o número #1 por</span> <span className="sparkle" aria-hidden>·</span>{' '}
        <span className="gradient-amount">{formatCurrency(heroAmountCents)}</span> <span className="sparkle" aria-hidden>·</span>
      </h1>

      <HeroBidForm />

      <p className="subtext">
        Já está na lista? Cola o mesmo link e aumenta o lance. Você paga só a diferença.
      </p>

      <section className="brand-strip" aria-label="Resumo do produto">
        <div>
          <span>Board público</span>
          <strong>Perfis de Instagram</strong>
        </div>
        <div>
          <span>Visibilidade</span>
          <strong>mais cliques, mais presença</strong>
        </div>
        <div>
          <span>Pagamento</span>
          <strong>Pix com confirmação instantânea</strong>
        </div>
      </section>

      <section id="board" className="board-embed" aria-label="Board de perfis do Instagram">
        <div className="board-topbar">
          <div>
            <p className="eyebrow">Board</p>
            <h2>Perfis em destaque</h2>
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
      </section>
    </main>
  )
}
