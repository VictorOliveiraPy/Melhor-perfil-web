import { describe, it, expect } from 'vitest'
import { buildProfileMetadata } from './profileMetadata'
import type { BoardListing } from './boardListing'

function listingFactory(overrides: Partial<BoardListing & { rank: number }> = {}): BoardListing & { rank: number } {
  return {
    id: '42',
    display_name: 'João Silva',
    bio: 'Fotógrafo e criador de conteúdo em SP',
    currentBidCents: 1200,
    platform: 'instagram',
    profileHandle: 'joao.silva',
    profileUrl: 'instagram.com/joao.silva',
    clicks24h: 10,
    timeLabel: 'há 2h',
    rank: 3,
    ...overrides,
  }
}

describe('buildProfileMetadata', () => {
  it('should build a title with the display name and current rank', () => {
    // Given / When
    const result = buildProfileMetadata(listingFactory({ display_name: 'João Silva', rank: 3 }))

    // Then
    expect(result.title).toBe('João Silva — #3 no ranking do Instagram')
  })

  it('should use the real bio in the description when available', () => {
    // Given / When
    const result = buildProfileMetadata(listingFactory({ bio: 'Fotógrafo e criador de conteúdo em SP' }))

    // Then
    expect(result.description).toContain('Fotógrafo e criador de conteúdo em SP')
  })

  it('should fall back to a generic description when bio is empty', () => {
    // Given: scraping falhou (fallback, spec.md do melhorperfil-api seção 4) — bio vazia é estado normal, não bug
    const result = buildProfileMetadata(listingFactory({ bio: '', display_name: '@joao.silva', rank: 5 }))

    // Then
    expect(result.description.length).toBeGreaterThan(0)
    expect(result.description).toContain('#5')
  })

  it('should truncate a very long display name to keep the title SERP-sized', () => {
    // Given: scraping (og:title) às vezes traz o nome do site junto, ex.
    // "Fulano (@fulano) • Instagram photos and videos"
    const longName = 'National Geographic (@natgeo) • Instagram photos and videos'

    // When
    const result = buildProfileMetadata(listingFactory({ display_name: longName, rank: 1 }))

    // Then
    expect(result.title.length).toBeLessThanOrEqual(70)
  })

  it('should truncate a very long bio to keep the description snippet-sized', () => {
    // Given: bios de Instagram podem ter até 150 caracteres, mas SEO pede description curta (~155-160)
    const longBio = 'x'.repeat(300)

    // When
    const result = buildProfileMetadata(listingFactory({ bio: longBio }))

    // Then
    expect(result.description.length).toBeLessThanOrEqual(160)
  })
})
