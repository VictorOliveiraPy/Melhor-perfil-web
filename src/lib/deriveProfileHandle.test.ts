import { describe, it, expect } from 'vitest'
import { deriveProfileHandle } from './deriveProfileHandle'

describe('deriveProfileHandle', () => {
  it('should extract the last path segment as the handle from a bare domain url', () => {
    // Given
    const url = 'instagram.com/joao.silva'

    // When
    const handle = deriveProfileHandle(url)

    // Then
    expect(handle).toBe('joao.silva')
  })

  it('should ignore a trailing slash when extracting the handle', () => {
    // Given: perfil do LinkedIn normalizado costuma vir com barra no final
    const url = 'https://www.linkedin.com/in/victor-hugo-py/'

    // When
    const handle = deriveProfileHandle(url)

    // Then
    expect(handle).toBe('victor-hugo-py')
  })

  it('should return an empty string for an empty input', () => {
    // Given
    const url = ''

    // When
    const handle = deriveProfileHandle(url)

    // Then
    expect(handle).toBe('')
  })
})
