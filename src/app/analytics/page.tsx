import { fetchBoardListings } from '../../services/boardApiService'
import { fetchSiteAnalytics } from '../../services/himetricaAnalytics'
import { boardStats } from '../../lib/boardStats'
import { formatCurrency } from '../../lib/formatCurrency'

// Painel completo do Himetrica exige login da conta dona do projeto —
// qualquer visitante que clique cai na tela de login deles, não vê nada
// (decisão do usuário 2026-08-28: manter /analytics público e agregado,
// mas com esse link a mais só pra quem tem a senha). Construído a partir
// do mesmo HIMETRICA_PROJECT_ID já usado pra consultar a Read API — "melhorperfil"
// é o slug do projeto no Himetrica (URL deles, não muda junto com o ID).
const HIMETRICA_DASHBOARD_URL = process.env.HIMETRICA_PROJECT_ID
  ? `https://www.himetrica.com/dashboard/melhorperfil/${process.env.HIMETRICA_PROJECT_ID}`
  : null

// Analytics próprio do melhorperfil — o link "ver o analytics" da home
// linkava direto pro dashboard público do melhorlance.dev (site de
// referência), o que não faz sentido: são produtos diferentes. Números de
// tráfego (pessoas online, visitantes, país) vêm da Read API do Himetrica
// (himetricaAnalytics.ts) — só agregado, nunca IP nem dado por visitante
// individual (decisão do usuário 2026-08-28: essa página é pública). O
// recorte por board já vem do melhorperfil-api.
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

      {HIMETRICA_DASHBOARD_URL && (
        <p className="analytics-admin-link">
          <a href={HIMETRICA_DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
            painel completo (login necessário) →
          </a>
        </p>
      )}
    </main>
  )
}
