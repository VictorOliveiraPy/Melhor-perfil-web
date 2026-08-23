import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { fetchBoardListings } from './boardApiService'

describe('fetchBoardListings', () => {
  beforeEach(() => {
    vi.stubEnv('API_BASE_URL', 'https://api.example.com')
    vi.stubEnv('GATEWAY_SECRET', 'shh')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('should map API items into BoardListing shape', async () => {
    // Given
    const apiResponse = {
      board: 'instagram',
      page: 1,
      limit: 50,
      total: 1,
      items: [
        {
          id: 42,
          platform: 'instagram',
          display_name: 'João Silva',
          profile_url: 'instagram.com/joao.silva',
          bio: 'Designer',
          current_bid_cents: 1200,
          status: 'ativa',
          created_at: '2026-08-23T12:00:00Z',
        },
      ],
    }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(apiResponse) }))

    // When
    const listings = await fetchBoardListings('instagram')

    // Then
    expect(listings).toEqual([
      {
        id: '42',
        display_name: 'João Silva',
        bio: 'Designer',
        currentBidCents: 1200,
        platform: 'instagram',
        profileHandle: 'joao.silva',
        profileUrl: 'instagram.com/joao.silva',
        clicks24h: 0,
        timeLabel: expect.any(String),
      },
    ])
  })

  it('should return an empty list when the API responds with an error status', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) }))

    // When
    const listings = await fetchBoardListings('linkedin')

    // Then
    expect(listings).toEqual([])
  })

  it('should return an empty list when the request throws', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    // When
    const listings = await fetchBoardListings('instagram')

    // Then
    expect(listings).toEqual([])
  })

  it('should return an empty list when API_BASE_URL is not configured', async () => {
    // Given
    vi.stubEnv('API_BASE_URL', '')
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    // When
    const listings = await fetchBoardListings('instagram')

    // Then
    expect(listings).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
