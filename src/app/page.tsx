export default function Home() {
  return (
    <main className="landing-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Pegue o número #1 por</p>
          <h1>Valor do lance em reais</h1>
          <p className="lead-line">R$ 1008+</p>
        </div>

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

        <p className="hero-liner">
          Um leaderboard público de perfis brasileiros. Ninguém aqui vai te dar upvote por pena.
          Vai deixar o #1 pra outro viralizar?
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
