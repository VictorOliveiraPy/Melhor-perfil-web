import { describe, it, expect } from 'vitest'
import { previewBid } from './previewBid'

describe('previewBid', () => {
  it('should charge only the difference when owner reinforces bid', () => {
    // Given
    const listing = { currentBidCents: 1200 }

    // When
    const result = previewBid(listing, { amountCents: 1500, isOwner: true })

    // Then
    expect(result.chargeCents).toBe(300)
  })

  it('should charge full amount for non-owner', () => {
    // Given
    const listing = { currentBidCents: 1200 }

    // When
    const result = previewBid(listing, { amountCents: 1500, isOwner: false })

    // Then
    expect(result.chargeCents).toBe(1500)
  })
})
