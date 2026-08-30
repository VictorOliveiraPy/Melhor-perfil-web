import { profileDetailHref } from './profileDetailHref'
import type { BoardListing } from './boardListing'
import type { Platform } from './platform'

export type BoardJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'ItemList'
  numberOfItems: number
  itemListElement: { '@type': 'ListItem'; position: number; name: string; url: string }[]
}

// Dado estruturado (schema.org ItemList) pro board — ajuda o Google a
// entender a página como uma lista ranqueada de perfis, não texto solto,
// habilitando rich results de lista. `position` reaproveita o `rank` já
// calculado por rankListings (mesma ordenação/desempate da regra de
// negócio, nunca recalculado aqui).
export function buildBoardJsonLd(
  listings: (BoardListing & { rank: number })[],
  baseUrl: string,
  platform: Platform = 'instagram',
): BoardJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: listings.length,
    itemListElement: listings.map((listing) => ({
      '@type': 'ListItem',
      position: listing.rank,
      name: listing.display_name,
      url: `${baseUrl}${profileDetailHref(platform, listing.id)}`,
    })),
  }
}
