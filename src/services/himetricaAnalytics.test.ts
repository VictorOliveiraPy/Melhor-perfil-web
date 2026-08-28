import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { fetchSiteAnalytics } from './himetricaAnalytics'

describe('fetchSiteAnalytics', () => {
  beforeEach(() => {
    vi.stubEnv('HIMETRICA_SECRET_KEY', 'hm_sk_test')
    vi.stubEnv('HIMETRICA_PROJECT_ID', 'proj_test')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('should combine realtime, range and country data into one aggregate shape', async () => {
    // Given: as três chamadas de leitura do Himetrica (realtime, analytics
    // por período, breakdown por país) respondendo com sucesso
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url.includes('/analytics/realtime')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { activeVisitors: 12 } }) })
        }
        if (url.includes('/locations')) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                data: [
                  { country: 'Brasil', visitors: 68 },
                  { country: 'Estados Unidos', visitors: 32 },
                ],
              }),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ data: { pageViews: 19131, uniqueVisitors: 8307, sessions: 9000, bounceRate: 40, avgDuration: 120 } }),
        })
      }),
    )

    // When
    const result = await fetchSiteAnalytics()

    // Then
    expect(result).toEqual({
      peopleOnline: 12,
      visitors: 8307,
      pageviews: 19131,
      countries: [
        { country: 'Brasil', percentage: 68 },
        { country: 'Estados Unidos', percentage: 32 },
      ],
    })
  })

  it('should return null instead of throwing when HIMETRICA_SECRET_KEY is not configured', async () => {
    // Given: página de analytics não pode quebrar por falta de config
    vi.stubEnv('HIMETRICA_SECRET_KEY', '')

    // When
    const result = await fetchSiteAnalytics()

    // Then
    expect(result).toBeNull()
  })

  it('should return null instead of throwing when the Himetrica API is unreachable', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    // When
    const result = await fetchSiteAnalytics()

    // Then
    expect(result).toBeNull()
  })

  it('should return null instead of throwing when any of the three requests fails', async () => {
    // Given: realtime falha (401, chave errada) — não pode misturar dado
    // parcial de fontes que não bateram todas
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string) => {
        if (url.includes('/analytics/realtime')) {
          return Promise.resolve({ ok: false, status: 401 })
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: {} }) })
      }),
    )

    // When
    const result = await fetchSiteAnalytics()

    // Then
    expect(result).toBeNull()
  })
})
