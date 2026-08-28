import { fetchBoardListings } from '../../services/boardApiService'
import { fetchSiteAnalytics } from '../../services/himetricaAnalytics'
import { boardStats } from '../../lib/boardStats'
import { formatCurrency } from '../../lib/formatCurrency'
import { HIMETRICA_SHARE_URL } from '../../lib/himetricaShareUrl'

// Achado 2026-08-28: os links "Analytics" do nav e "ver o analytics" da
// home não passam mais por aqui — vão direto pro dashboard público do
// Himetrica (HIMETRICA_SHARE_URL), igual o site de referência
// melhorlance.dev. Esta página fica só acessível por URL direta, com o
// recorte de board (perfis ativos/cliques/valor do #1) que o Himetrica não
// tem, mais os mesmos números agregados (himetricaAnalytics.ts) e um link
// pro mesmo dashboard público no fim.
export const dynamic = 'force-dynamic'

export default async function Analytics() {
  const [instagramListings, analytics] = await Promise.all([fetchBoardListings('instagram'), fetchSiteAnalytics()])
  const instagramStats = boardStats(instagramListings)

  return (
    <main className="analytics-page">
      <p className="eyebrow">Analytics</p>
      <h1>Tráfego do melhorperfil</h1>
      <p className="subtext">
        Números públicos de visibilidade — os mesmos que valem pra decidir se compensa pagar por uma posição no board.
      </p>

      {analytics ? (
        <>
          <div className="hero-stats">
            <div>
              <strong>{analytics.peopleOnline}</strong>
              <span>pessoas online agora</span>
            </div>
            <div>
              <strong>{analytics.visitors.toLocaleString('pt-BR')}</strong>
              <span>visitantes desde o lançamento</span>
            </div>
            <div>
              <strong>{analytics.pageviews.toLocaleString('pt-BR')}</strong>
              <span>pageviews desde o lançamento</span>
            </div>
          </div>

          {analytics.countries.length > 0 && (
            <>
              <h2 className="analytics-subheading">De onde vêm os visitantes</h2>
              <div className="analytics-boards">
                {analytics.countries.map((item) => (
                  <div key={item.country} className="analytics-board-card">
                    <p className="eyebrow">{item.country}</p>
                    <strong>{item.percentage}%</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <p className="profile-preview-fallback-note">Números de tráfego indisponíveis no momento.</p>
      )}

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

      <p className="analytics-admin-link">
        <a href={HIMETRICA_SHARE_URL} target="_blank" rel="noopener noreferrer">
          painel completo do Himetrica →
        </a>
      </p>
    </main>
  )
}
