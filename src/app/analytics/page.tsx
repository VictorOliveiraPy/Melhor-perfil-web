import { fetchBoardListings } from '../../services/boardApiService'
import { fetchSiteAnalytics } from '../../services/himetricaAnalytics'
import { boardStats } from '../../lib/boardStats'
import { formatCurrency } from '../../lib/formatCurrency'

// Dashboard PÚBLICO do Himetrica (Project Settings → Public Sharing),
// não o painel privado (/dashboard/{project}/{id}, esse sim exige login).
// Mesmo padrão do site de referência melhorlance.dev: linka direto pro
// share deles em vez de reconstruir o dashboard aqui. Slug fixo (não sai
// de env var — é só uma URL pública, sem credencial nenhuma envolvida).
const HIMETRICA_SHARE_URL = 'https://www.himetrica.com/share/melhor-perfil-j8bkxhzb6-melhor-perfil.vercel.app'

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

      <p className="analytics-admin-link">
        <a href={HIMETRICA_SHARE_URL} target="_blank" rel="noopener noreferrer">
          painel completo do Himetrica →
        </a>
      </p>
    </main>
  )
}
