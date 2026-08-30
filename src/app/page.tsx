import BoardSection from '../components/BoardSection'
import HeroBidForm from '../components/HeroBidForm'
import { fetchSiteAnalytics } from '../services/himetricaAnalytics'
import { fetchBoardListings } from '../services/boardApiService'
import { fetchLaunchCouponStatus } from '../services/launchCouponService'
import { HIMETRICA_SHARE_URL } from '../lib/himetricaShareUrl'
import { boardStats } from '../lib/boardStats'
import { rankListings } from '../lib/rankListings'
import { heroTargetBidCents } from '../lib/heroTargetBidCents'
import { formatCurrency } from '../lib/formatCurrency'
import { resolveLaunchCoupon } from '../lib/resolveLaunchCoupon'

// Precisa buscar o board antes de montar a hero (o valor mostrado depende
// do maior lance atual — ver heroTargetBidCents) e depender de dado ao vivo
// do melhorperfil-api — sem isso o Next congelaria a página como estática
// no build (achado em produção 2026-08-23: build sem API_BASE_URL virou
// HTML estático com board vazio "pra sempre").
export const dynamic = 'force-dynamic'

// Valor real colocado direto aqui a pedido do usuário (2026-08-30), pra não
// bloquear teste/lançamento em configurar NEXT_PUBLIC_LAUNCH_COUPON_CODE no
// Vercel antes — precisa bater com o default de
// Settings.launch_coupon_code no melhorperfil-api (app/core/config.py).
// Setar a env var no Vercel continua funcionando normalmente (sobrescreve
// este fallback); trocar o código da campanha só exige mudar num lugar só
// (a env var), sem precisar mexer em código de novo, contanto que os dois
// repos usem o mesmo valor.
const DEFAULT_LAUNCH_COUPON_CODE = 'LANCAMENTO15'

// Produto focado só em Instagram (decisão do usuário, 2026-08-25) — LinkedIn
// removido de vez da UI (/linkedin, /board combinado, toggle de plataforma
// no formulário). O backend continua aceitando URL do LinkedIn sem
// problema; só não tem mais nenhuma tela que publique lá.
export default async function Home() {
  const [listings, analytics, couponStatus] = await Promise.all([
    fetchBoardListings('instagram'),
    fetchSiteAnalytics(),
    fetchLaunchCouponStatus(),
  ])
  const ranked = rankListings(listings)
  const { totalClicks, topBidCents } = boardStats(ranked)
  const heroAmountCents = heroTargetBidCents([topBidCents])
  // NEXT_PUBLIC_LAUNCH_COUPON_CODE precisa bater com LAUNCH_COUPON_CODE do
  // melhorperfil-api — o backend nunca devolve o código em si (só o
  // status agregado), de propósito, então quem anuncia o texto exato é
  // este repo. Sem as duas env vars configuradas com o MESMO valor, ou
  // sem o cupom ativado administrativamente, resolveLaunchCoupon devolve
  // null e nem o banner nem o toggle no formulário aparecem.
  const launchCoupon = resolveLaunchCoupon(couponStatus, process.env.NEXT_PUBLIC_LAUNCH_COUPON_CODE ?? DEFAULT_LAUNCH_COUPON_CODE)

  return (
    <main className="landing-shell">
      <section className="hero-intro-row">
        <p className="hero-copy-line">
          Um leaderboard público de perfis brasileiros. Ninguém aqui vai te dar upvote por pena.
          <strong> Vai deixar o #1 pra outro viralizar?</strong>
        </p>

        {/* Analytics próprio (src/app/analytics) — não linka mais pro
            dashboard do melhorlance.dev, o site de referência. Dado real via
            Read API do Himetrica (himetricaAnalytics.ts); sem número
            inventado se a API não responder — só omite as linhas, mantém o
            link (achado 2026-08-28: mock fixo aqui já tinha saído de sincronia
            com o real assim que /analytics passou a mostrar dado de verdade). */}
        <div className="proof-card" aria-label="Indicadores de tráfego">
          {analytics && (
            <>
              <p>
                <span className="proof-dot" aria-hidden />
                <strong>{analytics.peopleOnline}</strong>&nbsp;pessoas online agora
              </p>
              <p>
                <strong>{analytics.visitors.toLocaleString('pt-BR')}</strong> visitantes &amp;{' '}
                {analytics.pageviews.toLocaleString('pt-BR')} pageviews desde o lançamento
              </p>
            </>
          )}
          <a href={HIMETRICA_SHARE_URL} target="_blank" rel="noopener noreferrer">
            ver o analytics →
          </a>
        </div>
      </section>

      {launchCoupon && (
        <div className="launch-coupon-banner" role="status">
          <span className="launch-coupon-banner-badge">🎉 Lançamento</span>
          <p>
            As primeiras <strong>15 vagas</strong> entram <strong>grátis</strong> no ranking — sem pagar nada. Restam{' '}
            <strong>{launchCoupon.remaining}</strong> {launchCoupon.remaining === 1 ? 'vaga' : 'vagas'}.
          </p>
        </div>
      )}

      <h1 className="hero-heading">
        <span>Pegue o número #1 por</span> <span className="sparkle" aria-hidden>·</span>{' '}
        <span className="gradient-amount">{formatCurrency(heroAmountCents)}</span> <span className="sparkle" aria-hidden>·</span>
      </h1>

      <HeroBidForm launchCoupon={launchCoupon} />

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
