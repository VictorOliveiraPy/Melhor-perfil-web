import { describe, it, expect } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('should format cents to BRL', () => {
    // Given
    const cents = 12345

    // When
    const formatted = formatCurrency(cents)

    // Then
    expect(formatted).toBe('R$ 123,45')
  })
})
