export default function Home() {
  return (
    <main className="landing-shell">
      <section className="hero-card">
        <p className="eyebrow">#1 por valor do lance em reais</p>
        <h1>
          Pegue o número #1 por
          <span> valor do lance em reais</span>
        </h1>
        <p className="lead-line">R$ 1008+</p>

        <div className="hero-entry-row" aria-label="Formulário de submissão do perfil">
          <input type="text" placeholder="Cole o link do seu perfil ou @seuarroba" />
          <button type="button" className="primary-button">Pegar o #1</button>
        </div>

        <p className="subtext">
          Já está na lista? Cola o mesmo link e aumenta o lance. Você paga só a diferença.
        </p>

        <div className="proof-row" aria-label="Indicadores de tráfego">
          <span><strong>29</strong> pessoas online agora</span>
          <span><strong>8.307</strong> visitantes &amp; 19.131 pageviews</span>
          <span><a href="https://www.himetrica.com/share/melhorlance.dev" target="_blank" rel="noreferrer">ver analytics →</a></span>
        </div>

        <div className="hero-stats">
          <div>
            <strong>Instagram</strong>
            <span>perfil pessoal</span>
          </div>
          <div>
            <strong>LinkedIn</strong>
            <span>perfil ou empresa</span>
          </div>
          <div>
            <strong>Ranking</strong>
            <span>por valor &amp; tempo</span>
          </div>
        </div>
      </section>

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
    </main>
  )
}
