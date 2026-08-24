import { describe, it, expect } from 'vitest'
import { isSafeAvatarUrl } from './isSafeAvatarUrl'

describe('isSafeAvatarUrl', () => {
  it('should accept a real https URL', () => {
    // Given
    const url = 'https://cdn.example.com/foto.jpg'

    // When / Then
    expect(isSafeAvatarUrl(url)).toBe(true)
  })

  it('should accept a base64 image data URI', () => {
    // Given: formato usado pelo melhorperfil-api pra evitar hotlink frágil
    // do CDN do Instagram (achado com o usuário testando de rede diferente)
    const url = 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='

    // When / Then
    expect(isSafeAvatarUrl(url)).toBe(true)
  })

  it('should reject a data URI that is not an image', () => {
    // Given
    const url = 'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='

    // When / Then
    expect(isSafeAvatarUrl(url)).toBe(false)
  })

  it('should reject a javascript: scheme', () => {
    // Given
    const url = 'javascript:alert(1)'

    // When / Then
    expect(isSafeAvatarUrl(url)).toBe(false)
  })

  it('should reject empty or missing values', () => {
    expect(isSafeAvatarUrl('')).toBe(false)
    expect(isSafeAvatarUrl(undefined)).toBe(false)
  })
})
