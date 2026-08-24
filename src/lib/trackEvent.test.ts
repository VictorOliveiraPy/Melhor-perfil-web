import { describe, it, expect, vi, afterEach } from 'vitest'
import { trackEvent } from './trackEvent'

describe('trackEvent', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should call window.himetrica.track with the event name and properties', () => {
    // Given
    const track = vi.fn()
    vi.stubGlobal('window', { himetrica: { track, identify: vi.fn() } })

    // When
    trackEvent('bid_placed', { platform: 'instagram', amountCents: 1500 })

    // Then
    expect(track).toHaveBeenCalledWith('bid_placed', { platform: 'instagram', amountCents: 1500 })
  })

  it('should do nothing when the Himetrica script has not loaded yet', () => {
    // Given: window existe (navegador), mas sem himetrica ainda
    vi.stubGlobal('window', {})

    // When / Then: não lança
    expect(() => trackEvent('bid_placed')).not.toThrow()
  })

  it('should swallow errors thrown by the tracker instead of breaking the caller', () => {
    // Given
    const track = vi.fn(() => {
      throw new Error('tracker crashed')
    })
    vi.stubGlobal('window', { himetrica: { track, identify: vi.fn() } })

    // When / Then
    expect(() => trackEvent('bid_placed')).not.toThrow()
  })
})
