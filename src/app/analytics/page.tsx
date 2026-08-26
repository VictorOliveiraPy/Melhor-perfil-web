import { fetchBoardListings } from '../../services/boardApiService'
import { siteAnalytics } from '../../data/mockAnalytics'
import { boardStats } from '../../lib/boardStats'
import { formatCurrency } from '../../lib/formatCurrency'

// Analytics próprio do melhorperfil — o link "ver o analytics" da home
// linkava direto pro dashboard público do melhorlance.dev (site de
// referência), o que não faz sentido: são produtos diferentes. Números de
// tráfego do site (pessoas online, visitantes) continuam de demonstração —
// dependem de uma integração de analytics real (Umami, spec.md seção 12)
// que ainda não existe. O recorte por board já vem do melhorperfil-api.
export const dynamic = 'force-dynamic'

export default async function Analytics() {
  const instagramListings = await fetchBoardListings('instagram')
  const instagramStats = boardStats(instagramListings)

  return (
    <main className="analytics-page">
      <p className="eyebrow">Analytics</p>
      <h1>Tráfego do melhorperfil</h1>
      <p className="subtext">
        Números públicos de visibilidade — os mesmos que valem pra decidir se compensa pagar por uma posição no board.
      </p>

      <div className="hero-stats">
        <div>
          <strong>{siteAnalytics.peopleOnline}</strong>
          <span>pessoas online agora</span>
        </div>
        <div>
          <strong>{siteAnalytics.visitors.toLocaleString('pt-BR')}</strong>
          <span>visitantes desde o lançamento</span>
        </div>
        <div>
          <strong>{siteAnalytics.pageviews.toLocaleString('pt-BR')}</strong>
          <span>pageviews desde o lançamento</span>
        </div>
      </div>

      <h2 className="analytics-subheading">Board</h2>

      <div className="analytics-boards">
        <div className="analytics-board-card">
          <p className="eyebrow">Instagram</p>
          <div className="analytics-board-stats">
            <div>
              <span>Perfis ativos</span>
              <strong>{instagramStats.count}</strong>
            </div>
            <div>
              <span>Cliques (24h)</span>
              <strong>{instagramStats.totalClicks.toLocaleString('pt-BR')}</strong>
            </div>
            <div>
              <span>Valor do #1</span>
              <strong>{formatCurrency(instagramStats.topBidCents)}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
