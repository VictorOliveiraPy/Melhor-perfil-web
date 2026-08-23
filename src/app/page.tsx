export default function Home() {
  return (
    <main className="landing-shell">
      <section className="hero-intro-row">
        <p className="hero-copy-line">
          Um leaderboard público de perfis brasileiros. Ninguém aqui vai te dar upvote por pena.
          <strong> Vai deixar o #1 pra outro viralizar?</strong>
        </p>

        <div className="proof-card" aria-label="Indicadores de tráfego">
          <p>
            <span className="proof-dot" aria-hidden />
            <strong>29</strong>&nbsp;pessoas online agora
          </p>
          <p><strong>8.307</strong> visitantes &amp; 19.131 pageviews desde o lançamento</p>
          <a href="https://www.himetrica.com/share/melhorlance.dev" target="_blank" rel="noreferrer">ver o analytics →</a>
        </div>
      </section>

      <h1 className="hero-heading">
        <span>Pegue o número #1 por</span> <span className="sparkle" aria-hidden>·</span> <span className="gradient-amount">R$ 1008</span> <span className="sparkle" aria-hidden>·</span>
      </h1>

      <div className="hero-entry-row" aria-label="Formulário de submissão do perfil">
        <input type="text" placeholder="Cole o link do seu perfil ou @seuarroba" />
        <button type="button" className="primary-button">Pegar o #1</button>
      </div>

      <p className="subtext">
        Já está na lista? Cola o mesmo link e aumenta o lance. Você paga só a diferença.
      </p>

      {/* Dois boards independentes (spec.md seção 1) — cada card leva pro
          ranking daquela plataforma, não existe um "board" misto pra linkar. */}
      <div className="hero-stats hero-stats-links">
        <a href="/instagram">
          <strong>Instagram</strong>
          <span>perfil pessoal</span>
        </a>
        <a href="/linkedin">
          <strong>LinkedIn</strong>
          <span>perfil profissional</span>
        </a>
      </div>

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
