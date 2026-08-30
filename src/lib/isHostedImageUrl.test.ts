import { describe, it, expect } from 'vitest'
import { isHostedImageUrl } from './isHostedImageUrl'

describe('isHostedImageUrl', () => {
  it('should accept a real https URL', () => {
    expect(isHostedImageUrl('https://scontent.cdninstagram.com/x.jpg')).toBe(true)
  })

  it('should reject an inline data: URI', () => {
    // avatarUrl às vezes é a foto inteira embutida em base64 (ver
    // isSafeAvatarUrl.ts) — ótimo pra <img src>, péssimo pra og:image/
    // JSON-LD image, que precisam de uma URL que um crawler externo
    // consiga buscar, não um blob gigante duplicado no HTML.
    expect(isHostedImageUrl('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD')).toBe(false)
  })

  it('should reject undefined/empty', () => {
    expect(isHostedImageUrl(undefined)).toBe(false)
    expect(isHostedImageUrl('')).toBe(false)
  })
})
