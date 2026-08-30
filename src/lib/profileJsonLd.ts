import { normalizeProfileUrl } from './normalizeProfileUrl'
import { isHostedImageUrl } from './isHostedImageUrl'
import type { BoardListing } from './boardListing'

type PersonJsonLd = {
  '@type': 'Person'
  name: string
  url: string
  image?: string
  description?: string
}

export type ProfileJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'ProfilePage'
  name: string
  url: string
  mainEntity: PersonJsonLd
}

// Dado estruturado (schema.org) pra página de perfil — ajuda o Google a
// entender que a página representa uma pessoa real com perfil no
// Instagram, habilitando rich results. `mainEntity.url` reaproveita
// normalizeProfileUrl (mesma defesa em profundidade contra
// javascript:/protocolo malicioso já usada nos links visíveis do site —
// achado do security-reviewer, 2026-08-23) em vez de montar a URL na mão
// aqui de novo.
export function buildProfileJsonLd(listing: BoardListing & { rank: number }, canonicalUrl: string): ProfileJsonLd {
  const personUrl = normalizeProfileUrl(listing.profileUrl)

  const mainEntity: PersonJsonLd = {
    '@type': 'Person',
    name: listing.display_name,
    url: personUrl,
  }
  if (isHostedImageUrl(listing.avatarUrl)) mainEntity.image = listing.avatarUrl
  if (listing.bio) mainEntity.description = listing.bio

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: listing.display_name,
    url: canonicalUrl,
    mainEntity,
  }
}
