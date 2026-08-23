import { describe, it, expect } from 'vitest'
import { profileDetailHref } from './profileDetailHref'

describe('profileDetailHref', () => {
  it('should build the canonical /platform/p/:id route for a listing', () => {
    // Given
    const platform = 'linkedin'
    const id = 'lin-101'

    // When
    const href = profileDetailHref(platform, id)

    // Then
    expect(href).toBe('/linkedin/p/lin-101')
  })
})
