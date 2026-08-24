import { describe, it, expect } from 'vitest'
import { heroTargetBidCents } from './heroTargetBidCents'

describe('heroTargetBidCents', () => {
  it('should return the current top bid across platforms when someone is already ranked', () => {
    // Given
    const topBidCentsByPlatform = [150000, 30000]

    // When
    const target = heroTargetBidCents(topBidCentsByPlatform)

    // Then
    expect(target).toBe(150000)
  })

  it('should fall back to the minimum bid when no board has an entry yet', () => {
    // Given
    const topBidCentsByPlatform = [0, 0]

    // When
    const target = heroTargetBidCents(topBidCentsByPlatform)

    // Then
    expect(target).toBe(100)
  })
})
