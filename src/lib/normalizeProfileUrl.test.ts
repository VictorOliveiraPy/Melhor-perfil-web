import { describe, it, expect } from 'vitest'
import { normalizeProfileUrl } from './normalizeProfileUrl'

describe('normalizeProfileUrl', () => {
  it('should add https when missing and remove trailing slash', () => {
    // Given
    const raw = 'example.com/user/'

    // When
    const normalized = normalizeProfileUrl(raw)

    // Then
    expect(normalized).toBe('https://example.com/user')
  })
})
