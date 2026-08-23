import { notFound } from 'next/navigation'
import ProfileDetail from '../../../../components/ProfileDetail'
import { listingsByPlatform } from '../../../../data/mockListings'
import { rankListings } from '../../../../lib/rankListings'

type Props = {
  params: { id: string }
}

export default function InstagramProfileDetail({ params }: Props) {
  const ranked = rankListings(listingsByPlatform('instagram'))
  const listing = ranked.find((entry) => entry.id === params.id)

  if (!listing) {
    notFound()
  }

  return <ProfileDetail platform="instagram" listing={listing} />
}
