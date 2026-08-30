import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { fetchLaunchCouponStatus } from './launchCouponService'

describe('fetchLaunchCouponStatus', () => {
  beforeEach(() => {
    vi.stubEnv('API_BASE_URL', 'https://api.example.com')
    vi.stubEnv('GATEWAY_SECRET', 'shh')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('should map the API response into LaunchCouponStatus shape', async () => {
    // Given
    const apiResponse = {
      isActive: true,
      remaining: 12,
      maxRedemptions: 15,
      redeemedCount: 3,
      expiresAt: '2026-09-06T12:00:00Z',
    }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(apiResponse) })
    vi.stubGlobal('fetch', fetchMock)

    // When
    const status = await fetchLaunchCouponStatus()

    // Then
    expect(status).toEqual(apiResponse)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/listings/coupon/status',
      expect.objectContaining({ headers: { 'X-Gateway-Secret': 'shh' } }),
    )
  })

  it('should return null when the API responds with an error status', async () => {
    // Given: mesma resiliência de fetchBoardListings/fetchSiteAnalytics —
    // banner de cupom nunca pode derrubar a home por causa do backend.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) }))

    // When
    const status = await fetchLaunchCouponStatus()

    // Then
    expect(status).toBeNull()
  })

  it('should return null when the request throws', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    // When
    const status = await fetchLaunchCouponStatus()

    // Then
    expect(status).toBeNull()
  })

  it('should return null when API_BASE_URL is not configured', async () => {
    // Given
    vi.stubEnv('API_BASE_URL', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    // When
    const status = await fetchLaunchCouponStatus()

    // Then
    expect(status).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
