import { describe, it, expect } from 'vitest'
import { rankListings } from './rankListings'

describe('rankListings', () => {
  it('should order listings by bid value, highest first, and assign sequential ranks', () => {
    // Given: entradas fora de ordem, como chegariam de um board por plataforma
    const listings = [
      { id: 'a', currentBidCents: 1200 },
      { id: 'b', currentBidCents: 5000 },
      { id: 'c', currentBidCents: 3400 },
    ]

    // When
    const ranked = rankListings(listings)

    // Then
    expect(ranked.map((entry) => entry.id)).toEqual(['b', 'c', 'a'])
    expect(ranked.map((entry) => entry.rank)).toEqual([1, 2, 3])
  })

  it('should keep the original (payment) order for tied bid values', () => {
    // Given: dois lances de mesmo valor — spec.md seção 3, "Empate":
    // quem pagou primeiro fica na frente
    const listings = [
      { id: 'first-payer', currentBidCents: 1000 },
      { id: 'second-payer', currentBidCents: 1000 },
    ]

    // When
    const ranked = rankListings(listings)

    // Then
    expect(ranked.map((entry) => entry.id)).toEqual(['first-payer', 'second-payer'])
    expect(ranked.map((entry) => entry.rank)).toEqual([1, 2])
  })
})
