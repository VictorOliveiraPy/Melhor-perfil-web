import { describe, it, expect } from 'vitest'
import { resolveProfileInput } from './resolveProfileInput'

describe('resolveProfileInput', () => {
  it('should expand a bare @handle into a full instagram profile url', () => {
    // Given
    const raw = '@joao.silva'

    // When
    const resolved = resolveProfileInput(raw, 'instagram')

    // Then
    expect(resolved).toBe('https://instagram.com/joao.silva')
  })

  it('should expand a bare @handle into a full linkedin profile url', () => {
    // Given
    const raw = '@maria-souza'

    // When
    const resolved = resolveProfileInput(raw, 'linkedin')

    // Then
    expect(resolved).toBe('https://www.linkedin.com/in/maria-souza')
  })

  it('should pass a full url through unchanged', () => {
    // Given
    const raw = 'instagram.com/joao.silva'

    // When
    const resolved = resolveProfileInput(raw, 'instagram')

    // Then
    expect(resolved).toBe('instagram.com/joao.silva')
  })

  it('should return an empty string for a bare "@" with no handle', () => {
    // Given
    const raw = '@'

    // When
    const resolved = resolveProfileInput(raw, 'instagram')

    // Then
    expect(resolved).toBe('')
  })
})
