import Board from '../../components/Board'
import { listingsByPlatform } from '../../data/mockListings'

export default function InstagramBoard() {
  return <Board platform="instagram" heading="Perfis do Instagram em destaque" listings={listingsByPlatform('instagram')} />
}
