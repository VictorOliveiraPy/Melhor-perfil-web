import { describe, it, expect } from 'vitest'
import { isValidProfileUrl, isForbiddenBio } from './contentRules'

describe('contentRules', () => {
  it('should accept valid instagram and linkedin profile urls', () => {
    // Given
    const validUrls = [
      'instagram.com/joao.silva',
      'https://www.linkedin.com/in/maria-souza/',
      'linkedin.com/company/melhorperfil'
    ]

    // When / Then
    validUrls.forEach((url) => {
      expect(isValidProfileUrl(url)).toBe(true)
    })
  })

  it('should reject forbidden links in bio', () => {
    // Given
    const forbiddenBio = 'Vamos conversar no https://wa.me/5511999999999 or telegram.me/abc'

    // When
    const result = isForbiddenBio(forbiddenBio)

    // Then
    expect(result).toBe(true)
  })
})
