import { describe, it, expect } from 'vitest'
import { buildProfileJsonLd } from './profileJsonLd'
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
    avatarUrl: 'https://scontent.cdninstagram.com/joao.jpg',
    clicks24h: 10,
    timeLabel: 'há 2h',
    rank: 3,
    ...overrides,
  }
}

describe('buildProfileJsonLd', () => {
  it('should build a ProfilePage wrapping a Person with a real, safe URL', () => {
    // Given / When
    const jsonLd = buildProfileJsonLd(listingFactory(), 'https://www.melhorperfil.com.br/instagram/p/42')

    // Then
    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('ProfilePage')
    expect(jsonLd.url).toBe('https://www.melhorperfil.com.br/instagram/p/42')
    expect(jsonLd.mainEntity).toMatchObject({
      '@type': 'Person',
      name: 'João Silva',
      url: 'https://instagram.com/joao.silva',
      image: 'https://scontent.cdninstagram.com/joao.jpg',
      description: 'Fotógrafo em SP',
    })
  })

  it('should never emit a javascript: URL even if profileUrl was somehow malicious', () => {
    // Given: mesma defesa em profundidade de normalizeProfileUrl (achado do security-reviewer, 2026-08-23)
    const jsonLd = buildProfileJsonLd(
      listingFactory({ profileUrl: 'javascript:alert(1)' }),
      'https://www.melhorperfil.com.br/instagram/p/42',
    )

    // Then
    expect(jsonLd.mainEntity.url).not.toContain('javascript:')
  })

  it('should omit image when avatarUrl is an inline data: URI, not a real URL', () => {
    // Given: achado ao testar com dado real — avatarUrl às vezes vem como
    // imagem inteira em base64 embutida (não uma URL de verdade). Incluir
    // isso no JSON-LD duplicaria um blob gigante no <head> da página,
    // piorando o peso que SEO/Core Web Vitals penaliza — o próprio motivo
    // de estar mexendo em SEO agora.
    const jsonLd = buildProfileJsonLd(
      listingFactory({ avatarUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD' }),
      'https://www.melhorperfil.com.br/instagram/p/42',
    )

    // Then
    expect(jsonLd.mainEntity).not.toHaveProperty('image')
  })

  it('should omit image and description when not available', () => {
    // Given / When
    const jsonLd = buildProfileJsonLd(
      listingFactory({ avatarUrl: undefined, bio: '' }),
      'https://www.melhorperfil.com.br/instagram/p/42',
    )

    // Then
    expect(jsonLd.mainEntity).not.toHaveProperty('image')
    expect(jsonLd.mainEntity).not.toHaveProperty('description')
  })
})
