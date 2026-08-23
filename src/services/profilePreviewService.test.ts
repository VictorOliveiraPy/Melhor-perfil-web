import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchProfilePreview } from './profilePreviewService'

describe('fetchProfilePreview', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return the backend result when the preview call succeeds', async () => {
    // Given
    const backendResult = { display_name: 'Victor Hugo', bio: 'Product & growth', avatarUrl: 'https://x/a.jpg', usedFallback: false }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(backendResult) }),
    )

    // When
    const preview = await fetchProfilePreview('https://www.linkedin.com/in/victor-hugo-py', 'linkedin')

    // Then
    expect(preview).toEqual(backendResult)
  })

  it('should fall back to a handle-based preview when the request fails', async () => {
    // Given: backend fora do ar / endpoint ainda não implementado — o
    // proxy devolve erro, postJson lança HttpError
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502, json: () => Promise.resolve({}) }))

    // When
    const preview = await fetchProfilePreview('https://instagram.com/joao.silva', 'instagram')

    // Then
    expect(preview).toEqual({ display_name: '@joao.silva', bio: '', usedFallback: true })
  })
})
