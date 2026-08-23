import { notFound } from 'next/navigation'
import ProfileDetail from '../../../../components/ProfileDetail'
import { fetchBoardListings } from '../../../../services/boardApiService'
import { rankListings } from '../../../../lib/rankListings'

export const dynamic = 'force-dynamic'

type Props = {
  params: { id: string }
}

// TODO(backend): busca a página inteira (até 50 entradas) e filtra por id
// no frontend — o melhorperfil-api ainda não tem um GET /listings/{id}
// dedicado. Funciona bem pro tamanho de board esperado no MVP; se a lista
// crescer além de uma página, um perfil fora da primeira página de
// /boards/instagram deixa de ser encontrado aqui.
export default async function InstagramProfileDetail({ params }: Props) {
  const ranked = rankListings(await fetchBoardListings('instagram'))
  const listing = ranked.find((entry) => entry.id === params.id)

  if (!listing) {
    notFound()
  }

  return <ProfileDetail platform="instagram" listing={listing} />
}
