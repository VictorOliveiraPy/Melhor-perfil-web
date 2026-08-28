import { describe, it, expect, vi, afterEach } from 'vitest'
import { registerCardClick } from './clickService'

describe('registerCardClick', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should POST to /api/listings/{id}/click', () => {
    // Given
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    // When
    registerCardClick('42')

    // Then
    expect(fetchMock).toHaveBeenCalledWith('/api/listings/42/click', { method: 'POST', keepalive: true })
  })

  it('should never throw when the request fails', async () => {
    // Given: clique num card nunca pode quebrar a navegação pro perfil
    // real, mesmo com a API fora do ar (mesma filosofia do trackEvent).
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    // When / Then
    expect(() => registerCardClick('42')).not.toThrow()
  })
})
