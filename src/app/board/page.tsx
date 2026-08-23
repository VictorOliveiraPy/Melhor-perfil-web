import BidRow from '../../components/BidRow'
import { mockListings } from '../../data/mockListings'

export default function Board() {
  return (
    <main className="board-page">
      <div className="board-topbar">
        <div>
          <p className="eyebrow">O board</p>
          <h1>Perfis em destaque</h1>
        </div>
        <div className="board-tabs">
          <span className="active-tab">Todos</span>
          <span className="muted-tab">Instagram</span>
          <span className="muted-tab">LinkedIn</span>
        </div>
      </div>

      <div className="board-meta-row">
        <span>Atualizado há 1 segundo</span>
        <span>·</span>
        <a href="#">Atualizar</a>
        <span>·</span>
        <span>11.159 cliques em visibilidade</span>
      </div>

      <section className="board-list">
        {mockListings.map((listing) => (
          <BidRow key={listing.id} listing={listing} />
        ))}
      </section>
    </main>
  )
}
