import { describe, it, expect } from 'vitest'
import { isPaymentConfirmed } from './isPaymentConfirmed'

describe('isPaymentConfirmed', () => {
  it('should return true only when the transaction status is paga', () => {
    // Given
    const paga = 'paga'

    // When
    const result = isPaymentConfirmed(paga)

    // Then
    expect(result).toBe(true)
  })

  it('should return false when the transaction is still pendente', () => {
    // Given: pagamento gerado, ainda esperando o webhook confirmar
    const pendente = 'pendente'

    // When
    const result = isPaymentConfirmed(pendente)

    // Then
    expect(result).toBe(false)
  })

  it('should return false when the transaction status is null', () => {
    // Given: transactionId não bateu com nenhuma transação deste listing
    // (achado do security-specialist no backend, mesmo listing_id de outro
    // token) — nunca deve ser tratado como confirmado.
    const semTransacao = null

    // When
    const result = isPaymentConfirmed(semTransacao)

    // Then
    expect(result).toBe(false)
  })

  it('should return false when the listing status is ativa but the transaction status is not paga', () => {
    // Given: regressão do bug real em produção — entrada já "ativa" de um
    // pagamento anterior não pode confirmar um reforço/ultrapassagem cujo
    // Pix novo ainda não foi pago.
    const aindaPendente = 'pendente'

    // When
    const result = isPaymentConfirmed(aindaPendente)

    // Then
    expect(result).toBe(false)
  })
})
