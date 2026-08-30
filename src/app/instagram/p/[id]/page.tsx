import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProfileDetail from '../../../../components/ProfileDetail'
import { fetchBoardListings } from '../../../../services/boardApiService'
import { rankListings } from '../../../../lib/rankListings'
import { buildProfileMetadata } from '../../../../lib/profileMetadata'
import { buildProfileJsonLd } from '../../../../lib/profileJsonLd'
import { isHostedImageUrl } from '../../../../lib/isHostedImageUrl'
import { stringifyJsonLd } from '../../../../lib/stringifyJsonLd'
import { profileDetailHref } from '../../../../lib/profileDetailHref'
import { SITE_URL } from '../../../../lib/siteUrl'

export const dynamic = 'force-dynamic'

type Props = {
  params: { id: string }
}

// TODO(backend): busca a página inteira (até 50 entradas) e filtra por id
// no frontend — o melhorperfil-api ainda não tem um GET /listings/{id}
// dedicado. Funciona bem pro tamanho de board esperado no MVP; se a lista
// crescer além de uma página, um perfil fora da primeira página de
// /boards/instagram deixa de ser encontrado aqui.
//
// cache() (React, não Next) dedupe entre generateMetadata e o componente
// da página — os dois precisam do mesmo listing, sem isso o board inteiro
// seria buscado da API duas vezes por request (achado de SEO 2026-08-30,
// ao adicionar metadata própria por perfil).
const getRankedListing = cache(async (id: string) => {
  const ranked = rankListings(await fetchBoardListings('instagram'))
  return ranked.find((entry) => entry.id === id) ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getRankedListing(params.id)
  if (!listing) return {}

  const { title, description } = buildProfileMetadata(listing)
  const canonicalUrl = `${SITE_URL}${profileDetailHref('instagram', listing.id)}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'profile',
      // og:image precisa ser uma URL que o crawler do Facebook/Twitter
      // consiga buscar sozinho — data: URI embutido (comum aqui, ver
      // isHostedImageUrl.ts) não funciona, cai pro OG image genérico do
      // layout (opengraph-image.tsx) quando omitido.
      images: isHostedImageUrl(listing.avatarUrl) ? [listing.avatarUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function InstagramProfileDetail({ params }: Props) {
  const listing = await getRankedListing(params.id)

  if (!listing) {
    notFound()
  }

  const canonicalUrl = `${SITE_URL}${profileDetailHref('instagram', listing.id)}`
  const jsonLd = buildProfileJsonLd(listing, canonicalUrl)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }} />
      <ProfileDetail platform="instagram" listing={listing} />
    </>
  )
}
