import { describe, it, expect } from 'vitest'
import { boardStats } from './boardStats'

describe('boardStats', () => {
  it('should sum clicks and find the highest bid across listings', () => {
    // Given
    const listings = [
      { clicks24h: 100, currentBidCents: 500 },
      { clicks24h: 40, currentBidCents: 1200 },
      { clicks24h: 10, currentBidCents: 300 },
    ]

    // When
    const stats = boardStats(listings)

    // Then
    expect(stats).toEqual({ count: 3, totalClicks: 150, topBidCents: 1200 })
  })

  it('should return zeroed stats for an empty board', () => {
    // Given
    const listings: { clicks24h: number; currentBidCents: number }[] = []

    // When
    const stats = boardStats(listings)

    // Then
    expect(stats).toEqual({ count: 0, totalClicks: 0, topBidCents: 0 })
  })
})
