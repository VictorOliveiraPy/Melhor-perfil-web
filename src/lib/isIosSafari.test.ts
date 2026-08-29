import { describe, it, expect } from 'vitest'
import { isIosSafari } from './isIosSafari'

describe('isIosSafari', () => {
  it('should detect Safari on iPhone', () => {
    // Given
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'

    // When
    const result = isIosSafari(userAgent)

    // Then
    expect(result).toBe(true)
  })

  it('should detect Safari on iPad', () => {
    // Given
    const userAgent =
      'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'

    // When
    const result = isIosSafari(userAgent)

    // Then
    expect(result).toBe(true)
  })

  it('should reject Chrome on iPhone even though it also runs on WebKit', () => {
    // Given: CriOS não tem "Adicionar à Tela de Início" no menu, diferente do Safari
    const userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1'

    // When
    const result = isIosSafari(userAgent)

    // Then
    expect(result).toBe(false)
  })

  it('should reject Android Chrome', () => {
    // Given
    const userAgent = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36'

    // When
    const result = isIosSafari(userAgent)

    // Then
    expect(result).toBe(false)
  })

  it('should reject desktop Safari on macOS', () => {
    // Given
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'

    // When
    const result = isIosSafari(userAgent)

    // Then
    expect(result).toBe(false)
  })
})
