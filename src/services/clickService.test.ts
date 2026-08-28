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
    await expect(registerCardClick('42')).resolves.toBeUndefined()
  })

  it('should resolve once the request settles, so the caller can refresh after', async () => {
    // Given: achado em produção 2026-08-28 — o card não atualizava sozinho
    // porque quem chamava não esperava nada pra disparar router.refresh().
    // Devolver uma Promise deixa isso encadeável sem bloquear a navegação
    // (o <a target="_blank"> já abre a aba real de qualquer jeito).
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    // When
    const result = registerCardClick('42')

    // Then
    expect(result).toBeInstanceOf(Promise)
    await expect(result).resolves.toBeUndefined()
  })
})
