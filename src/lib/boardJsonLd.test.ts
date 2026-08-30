import { describe, it, expect } from 'vitest'
import { buildBoardJsonLd } from './boardJsonLd'
import type { BoardListing } from './boardListing'

function listingFactory(overrides: Partial<BoardListing & { rank: number }> = {}): BoardListing & { rank: number } {
  return {
    id: '42',
    display_name: 'João Silva',
    bio: 'Fotógrafo em SP',
    currentBidCents: 1200,
    platform: 'instagram',
    profileHandle: 'joao.silva',
    profileUrl: 'instagram.com/joao.silva',
    clicks24h: 10,
    timeLabel: 'há 2h',
    rank: 1,
    ...overrides,
  }
}

describe('buildBoardJsonLd', () => {
  it('should build an ItemList with one ListItem per listing, in rank order', () => {
    // Given
    const listings = [
      listingFactory({ id: '1', display_name: 'Ana', rank: 1 }),
      listingFactory({ id: '2', display_name: 'Bruno', rank: 2 }),
    ]

    // When
    const jsonLd = buildBoardJsonLd(listings, 'https://www.melhorperfil.com.br')

    // Then
    expect(jsonLd['@type']).toBe('ItemList')
    expect(jsonLd.numberOfItems).toBe(2)
    expect(jsonLd.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Ana', url: 'https://www.melhorperfil.com.br/instagram/p/1' },
      { '@type': 'ListItem', position: 2, name: 'Bruno', url: 'https://www.melhorperfil.com.br/instagram/p/2' },
    ])
  })

  it('should build an empty list when there are no listings yet', () => {
    // Given / When
    const jsonLd = buildBoardJsonLd([], 'https://www.melhorperfil.com.br')

    // Then
    expect(jsonLd.numberOfItems).toBe(0)
    expect(jsonLd.itemListElement).toEqual([])
  })
})
