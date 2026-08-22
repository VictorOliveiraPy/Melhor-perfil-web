import { describe, it, expect } from 'vitest'
import { add } from './example'

describe('add', () => {
  it('should add two numbers', () => {
    // Given
    const a = 2
    const b = 3

    // When
    const result = add(a, b)

    // Then
    expect(result).toBe(5)
  })
})
