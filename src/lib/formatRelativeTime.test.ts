import { describe, it, expect } from 'vitest'
import { formatRelativeTime } from './formatRelativeTime'

describe('formatRelativeTime', () => {
  it('should show "agora mesmo" for a timestamp less than a minute ago', () => {
    // Given
    const now = new Date('2026-08-23T12:00:30Z')
    const createdAt = '2026-08-23T12:00:00Z'

    // When
    const label = formatRelativeTime(createdAt, now)

    // Then
    expect(label).toBe('agora mesmo')
  })

  it('should pluralize minutes correctly', () => {
    // Given
    const now = new Date('2026-08-23T12:05:00Z')
    const createdAt = '2026-08-23T12:00:00Z'

    // When
    const label = formatRelativeTime(createdAt, now)

    // Then
    expect(label).toBe('há 5 minutos')
  })

  it('should use singular for exactly one hour', () => {
    // Given
    const now = new Date('2026-08-23T13:00:00Z')
    const createdAt = '2026-08-23T12:00:00Z'

    // When
    const label = formatRelativeTime(createdAt, now)

    // Then
    expect(label).toBe('há 1 hora')
  })

  it('should fall back to days once it has been more than 24 hours', () => {
    // Given
    const now = new Date('2026-08-26T12:00:00Z')
    const createdAt = '2026-08-23T12:00:00Z'

    // When
    const label = formatRelativeTime(createdAt, now)

    // Then
    expect(label).toBe('há 3 dias')
  })
})
