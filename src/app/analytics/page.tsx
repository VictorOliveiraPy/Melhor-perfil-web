import { listingsByPlatform } from '../../data/mockListings'
import { siteAnalytics } from '../../data/mockAnalytics'
import { boardStats } from '../../lib/boardStats'
import { formatCurrency } from '../../lib/formatCurrency'

// Analytics próprio do melhorperfil — o link "ver o analytics" da home
// linkava direto pro dashboard público do melhorlance.dev (site de
// referência), o que não faz sentido: são produtos diferentes. Esta página
// é a nossa versão, com os mesmos números de demonstração já usados na
// hero (src/data/mockAnalytics.ts) e um recorte por board a partir dos
// mesmos dados mock do board público.
export default function Analytics() {
  const instagramStats = boardStats(listingsByPlatform('instagram'))
  const linkedinStats = boardStats(listingsByPlatform('linkedin'))

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

      <h2 className="analytics-subheading">Por board</h2>

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

        <div className="analytics-board-card">
          <p className="eyebrow">LinkedIn</p>
          <div className="analytics-board-stats">
            <div>
              <span>Perfis ativos</span>
              <strong>{linkedinStats.count}</strong>
            </div>
            <div>
              <span>Cliques (24h)</span>
              <strong>{linkedinStats.totalClicks.toLocaleString('pt-BR')}</strong>
            </div>
            <div>
              <span>Valor do #1</span>
              <strong>{formatCurrency(linkedinStats.topBidCents)}</strong>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
