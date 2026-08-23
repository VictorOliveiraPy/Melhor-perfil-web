export default function Home() {
  return (
    <main className="hero-page">
      <section className="hero-card">
        <p className="eyebrow">Board de perfis</p>
        <h1>Seu perfil no topo do ranking</h1>
        <p className="lead-line">R$ 1.008+</p>
        <p className="lead">
          Cole o link do seu perfil ou @seuarroba e suba no ranking. Já está na lista? Reforce seu lance e ganhe mais visibilidade.
        </p>

        <div className="hero-actions">
          <a href="/board" className="primary-button">Ver o board</a>
          <a href="/board" className="secondary-button">Entrar no ranking</a>
        </div>

        <div className="stats-grid">
          <div>
            <strong>43</strong>
            <span>pessoas online agora</span>
          </div>
          <div>
            <strong>5.926</strong>
            <span>visitantes / 24h</span>
          </div>
          <div>
            <strong>13.687</strong>
            <span>pageviews / 24h</span>
          </div>
        </div>
      </section>
    </main>
  )
}
