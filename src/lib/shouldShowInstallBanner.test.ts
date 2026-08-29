import { describe, it, expect } from 'vitest'
import { shouldShowInstallBanner } from './shouldShowInstallBanner'

describe('shouldShowInstallBanner', () => {
  it('should show the banner when it was never dismissed before', () => {
    // Given
    const lastDismissedAt = null

    // When
    const result = shouldShowInstallBanner(lastDismissedAt, new Date('2026-08-29T12:00:00Z'))

    // Then
    expect(result).toBe(true)
  })

  it('should hide the banner when dismissed less than 14 days ago', () => {
    // Given
    const lastDismissedAt = '2026-08-20T12:00:00Z'

    // When
    const result = shouldShowInstallBanner(lastDismissedAt, new Date('2026-08-25T12:00:00Z'))

    // Then
    expect(result).toBe(false)
  })

  it('should show the banner again after 14 days since the last dismissal', () => {
    // Given
    const lastDismissedAt = '2026-08-01T12:00:00Z'

    // When
    const result = shouldShowInstallBanner(lastDismissedAt, new Date('2026-08-20T12:00:00Z'))

    // Then
    expect(result).toBe(true)
  })

  it('should show the banner when the stored dismissal timestamp is invalid', () => {
    // Given
    const lastDismissedAt = 'lixo-nao-e-data'

    // When
    const result = shouldShowInstallBanner(lastDismissedAt, new Date('2026-08-29T12:00:00Z'))

    // Then
    expect(result).toBe(true)
  })
})
