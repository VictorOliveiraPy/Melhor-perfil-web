export default function Home() {
  return (
    <main className="landing-shell">
      <section className="hero-card">
        <div className="hero-intro">
          <p className="hero-copy-line">
            Um leaderboard público de perfis brasileiros. Ninguém aqui vai te dar upvote por pena.
            <strong> Vai deixar o #1 pra outro viralizar?</strong>
          </p>

          <div className="proof-row" aria-label="Indicadores de tráfego">
            <span><strong>29</strong> pessoas online agora</span>
            <span><strong>8.307</strong> visitantes &amp; 19.131 pageviews</span>
            <span><a href="https://www.himetrica.com/share/melhorlance.dev" target="_blank" rel="noreferrer">ver analytics →</a></span>
          </div>
        </div>

        <div className="hero-price-box">
          <p className="eyebrow">Pegue o número #1 por</p>
          <div className="price-stepper" aria-label="Valor do lance atual">
            <button type="button" className="stepper-button" aria-label="Diminuir R$ 1">−</button>
            <div className="price-readout">
              <span className="price-label">Valor do lance em reais</span>
              <div className="price-display">
                <span className="currency">R$</span>
                <span className="value">1008</span>
              </div>
            </div>
            <button type="button" className="stepper-button" aria-label="Aumentar R$ 1">+</button>
          </div>
        </div>

        <div className="hero-entry-row" aria-label="Formulário de submissão do perfil">
          <input type="text" placeholder="Cole o link do seu perfil ou @seuarroba" />
          <button type="button" className="primary-button">Pegar o #1</button>
        </div>

        <p className="subtext">
          Já está na lista? Cola o mesmo link e aumenta o lance. Você paga só a diferença.
        </p>

        <div className="hero-stats">
          <div>
            <strong>Instagram</strong>
            <span>perfil pessoal</span>
          </div>
          <div>
            <strong>LinkedIn</strong>
            <span>perfil profissional</span>
          </div>
          <div>
            <strong>Board</strong>
            <span>ranking público</span>
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
