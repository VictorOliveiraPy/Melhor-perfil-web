export default function Home() {
  return (
    <main className="hero-page">
      <section className="hero-card">
        <p className="eyebrow">Autoridade digital</p>
        <h1>Sua presença digital começa no topo</h1>
        <p className="lead-line">R$ 1.008+</p>
        <p className="lead">
          Transforme visibilidade em reputação. O ranking mostra quem está ganhando atenção, relevância e oportunidades reais no mercado digital.
        </p>

        <div className="hero-actions">
          <a href="/board" className="primary-button">Ver o ranking</a>
          <a href="/board" className="secondary-button">Entrar no board</a>
        </div>

        <div className="proof-row" aria-label="Indicadores de autoridade">
          <span><strong>43</strong> online agora</span>
          <span><strong>5.926</strong> visitas / 24h</span>
          <span><strong>13.687</strong> pageviews / 24h</span>
        </div>

        <div className="stats-grid">
          <div>
            <strong>#1</strong>
            <span>visibilidade profissional</span>
          </div>
          <div>
            <strong>+18%</strong>
            <span>engajamento por posição</span>
          </div>
          <div>
            <strong>R$ 1.008</strong>
            <span>lance inicial no topo</span>
          </div>
        </div>

        <div className="micro-highlight">
          <span className="micro-dot" />
          Ranking pensado para quem quer crescer visibilidade com autoridade.
        </div>
      </section>
    </main>
  )
}
