import ProfileCard from '../../components/ProfileCard'
import BidForm from '../../components/BidForm'
import { mockListings } from '../../data/mockListings'

export default function Board() {
  return (
    <main className="board-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Ranking de autoridade</p>
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
          <article key={listing.id} className="listing-row">
            <div className="listing-main">
              <ProfileCard
                rank={listing.rank}
                display_name={listing.display_name}
                bio={listing.bio}
                currentBidCents={listing.currentBidCents}
                profileUrl={listing.profileUrl}
                platform={listing.platform}
                profileHandle={listing.profileHandle}
                avatarUrl={listing.avatarUrl}
                clicks24h={listing.clicks24h}
                timeLabel={listing.timeLabel}
              />
            </div>
            <div className="cta">
              <BidForm currentBidCents={listing.currentBidCents} platform={listing.platform} />
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
