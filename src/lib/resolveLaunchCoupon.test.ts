import { describe, it, expect } from 'vitest'
import { resolveLaunchCoupon } from './resolveLaunchCoupon'
import type { LaunchCouponStatus } from '../services/launchCouponService'

function statusFactory(overrides: Partial<LaunchCouponStatus> = {}): LaunchCouponStatus {
  return {
    isActive: true,
    remaining: 12,
    maxRedemptions: 15,
    redeemedCount: 3,
    expiresAt: '2026-09-06T12:00:00Z',
    ...overrides,
  }
}

describe('resolveLaunchCoupon', () => {
  it('should return the banner info when active, with slots left and code configured', () => {
    // Given / When
    const result = resolveLaunchCoupon(statusFactory({ remaining: 7 }), 'LANCAMENTO15')

    // Then
    expect(result).toEqual({ code: 'LANCAMENTO15', remaining: 7 })
  })

  it('should return null when status is null (API unreachable or not configured)', () => {
    // Given / When
    const result = resolveLaunchCoupon(null, 'LANCAMENTO15')

    // Then
    expect(result).toBeNull()
  })

  it('should return null when no code is configured on this repo', () => {
    // Given: backend nunca devolve o código em si — sem NEXT_PUBLIC_LAUNCH_COUPON_CODE
    // configurado aqui, não tem como o usuário saber o que digitar.
    const result = resolveLaunchCoupon(statusFactory(), undefined)

    // Then
    expect(result).toBeNull()
  })

  it('should return null when the coupon was not administratively activated', () => {
    // Given / When
    const result = resolveLaunchCoupon(statusFactory({ isActive: false }), 'LANCAMENTO15')

    // Then
    expect(result).toBeNull()
  })

  it('should return null when there are no slots remaining', () => {
    // Given / When
    const result = resolveLaunchCoupon(statusFactory({ remaining: 0 }), 'LANCAMENTO15')

    // Then
    expect(result).toBeNull()
  })
})
