import Board from '../../components/Board'
import { listingsByPlatform } from '../../data/mockListings'

export default function LinkedInBoard() {
  return <Board platform="linkedin" heading="Perfis do LinkedIn em destaque" listings={listingsByPlatform('linkedin')} />
}
