import { describe, it, expect, vi, afterEach } from 'vitest'
import { postJson, HttpError } from './httpClient'

describe('postJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should send a POST with JSON body and return the parsed response', async () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ hello: 'world' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    // When
    const result = await postJson('/api/profiles/preview', { profileUrl: 'https://instagram.com/x' })

    // Then
    expect(result).toEqual({ hello: 'world' })
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/profiles/preview',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl: 'https://instagram.com/x' }),
      }),
    )
  })

  it('should throw HttpError when the response is not ok', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502, json: () => Promise.resolve({}) }))

    // When / Then
    await expect(postJson('/api/profiles/preview', {})).rejects.toBeInstanceOf(HttpError)
  })
})
