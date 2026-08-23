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

  it('should surface the backend "detail" message when the response is not ok', async () => {
    // Given: FastAPI devolve erro de validação como { detail: "..." }
    // (HTTPException) — sem isso, o usuário só vê "failed with status 400"
    // em vez do motivo real (ex.: "Reinforcement must be at least R$1...")
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 400, json: () => Promise.resolve({ detail: 'Bid amount must be a whole number of reais' }) }),
    )

    // When
    const error = await postJson('/api/listings/bid', {}).catch((err) => err)

    // Then
    expect(error).toBeInstanceOf(HttpError)
    expect(error.message).toBe('Bid amount must be a whole number of reais')
  })
})
