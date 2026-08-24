import Link from 'next/link'
import CombinedBoard from '../components/CombinedBoard'
import HeroBidForm from '../components/HeroBidForm'
import { siteAnalytics } from '../data/mockAnalytics'
import { isPlatform, type Platform } from '../lib/platform'
import { fetchBoardListings } from '../services/boardApiService'
import { boardStats } from '../lib/boardStats'
import { rankListings } from '../lib/rankListings'
import { heroTargetBidCents } from '../lib/heroTargetBidCents'
import { formatCurrency } from '../lib/formatCurrency'

// Ver src/app/board/page.tsx pro porquê do force-dynamic explícito.
export const dynamic = 'force-dynamic'

type Props = {
  searchParams: { platform?: string }
}

const PLATFORMS: Platform[] = ['instagram', 'linkedin']

// Async: precisa buscar os dois boards antes de montar a hero (o valor
// mostrado depende do maior lance atual — ver heroTargetBidCents). O mesmo
// fetchBoardListings roda de novo dentro de CombinedBoard logo abaixo; o
// Next.js dedupa automaticamente fetches idênticos (mesma URL/opções)
// dentro da mesma renderização (React Request Memoization), então isso não
// dobra a chamada real de rede.
export default async function Home({ searchParams }: Props) {
  const filter = isPlatform(searchParams.platform) ? searchParams.platform : undefined

  const listingsByPlatform = await Promise.all(PLATFORMS.map((platform) => fetchBoardListings(platform)))
  const topBidCentsByPlatform = listingsByPlatform.map((listings) => boardStats(rankListings(listings)).topBidCents)
  const heroAmountCents = heroTargetBidCents(topBidCentsByPlatform)

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

      {/* Dois boards independentes (spec.md seção 1) — cada card leva pro
          ranking daquela plataforma, não existe um "board" misto pra linkar. */}
      <div className="hero-stats hero-stats-links">
        <a href="/instagram">
          <strong>Instagram</strong>
          <span>perfil pessoal</span>
        </a>
        <a href="/linkedin">
          <strong>LinkedIn</strong>
          <span>perfil profissional</span>
        </a>
      </div>

      <section className="brand-strip" aria-label="Resumo do produto">
        <div>
          <span>Board público</span>
          <strong>Perfis de Instagram e LinkedIn</strong>
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

      {/* Perfis na mesma tela da home — pedido do usuário, igual à
          referência melhorlance.dev (o board dela também mora na home,
          não numa rota separada). /board continua existindo à parte pra
          quem chegar direto nele pelo nav. */}
      <CombinedBoard filter={filter} basePath="/" headingLevel={2} />
    </main>
  )
}
