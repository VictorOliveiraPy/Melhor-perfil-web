import { describe, it, expect, vi, afterEach } from 'vitest'
import { fetchListingStatus } from './listingStatusService'

describe('fetchListingStatus', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return the parsed status when the request succeeds', async () => {
    // Given
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            listingId: 42,
            status: 'ativa',
            displayName: 'Fulano',
            bio: 'Bio real',
            avatarUrl: 'data:image/jpeg;base64,xyz',
            currentBidCents: 1500,
          }),
      }),
    )

    // When
    const result = await fetchListingStatus(42)

    // Then
    expect(result).toEqual({
      listingId: 42,
      status: 'ativa',
      displayName: 'Fulano',
      bio: 'Bio real',
      avatarUrl: 'data:image/jpeg;base64,xyz',
      currentBidCents: 1500,
    })
  })

  it('should return null instead of throwing when the request fails', async () => {
    // Given: polling não pode derrubar a tela por causa de uma falha
    // pontual — só tenta de novo na próxima rodada.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    // When
    const result = await fetchListingStatus(42)

    // Then
    expect(result).toBeNull()
  })

  it('should return null when the listing does not exist (404)', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({ detail: 'Listing not found' }) }))

    // When
    const result = await fetchListingStatus(999)

    // Then
    expect(result).toBeNull()
  })
})
