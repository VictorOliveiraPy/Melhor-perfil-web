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
            transactionStatus: 'paga',
          }),
      }),
    )

    // When
    const result = await fetchListingStatus(42, 'tx-abc')

    // Then
    expect(result).toEqual({
      listingId: 42,
      status: 'ativa',
      displayName: 'Fulano',
      bio: 'Bio real',
      avatarUrl: 'data:image/jpeg;base64,xyz',
      currentBidCents: 1500,
      transactionStatus: 'paga',
    })
  })

  it('should send the transactionId as a query string parameter', async () => {
    // Given: o backend só sabe dizer se O PIX ESPECÍFICO foi pago
    // (spec.md seção 7) quando recebe o public_token via ?transactionId=
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          listingId: 42,
          status: 'ativa',
          displayName: 'Fulano',
          bio: 'Bio real',
          currentBidCents: 1500,
          transactionStatus: 'pendente',
        }),
    })
    vi.stubGlobal('fetch', fetchMock)

    // When
    await fetchListingStatus(42, 'tx-abc-123')

    // Then
    expect(fetchMock).toHaveBeenCalledWith('/api/listings/42/status?transactionId=tx-abc-123')
  })

  it('should return null instead of throwing when the request fails', async () => {
    // Given: polling não pode derrubar a tela por causa de uma falha
    // pontual — só tenta de novo na próxima rodada.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    // When
    const result = await fetchListingStatus(42, 'tx-abc')

    // Then
    expect(result).toBeNull()
  })

  it('should return null when the listing does not exist (404)', async () => {
    // Given
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({ detail: 'Listing not found' }) }))

    // When
    const result = await fetchListingStatus(999, 'tx-abc')

    // Then
    expect(result).toBeNull()
  })
})
