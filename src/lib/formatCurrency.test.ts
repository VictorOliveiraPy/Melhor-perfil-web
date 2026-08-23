import { describe, it, expect } from 'vitest'
import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
  it('should format whole-real cents without decimals, matching the melhorlance.dev reference style', () => {
    // Given: lance mínimo em reais inteiros (spec.md seção 5) — nunca há centavos
    const cents = 120000

    // When
    const formatted = formatCurrency(cents)

    // Then (Intl.NumberFormat separa "R$" do valor com nbsp, não espaço comum)
    expect(formatted).toBe('R$ 1.200')
  })

  it('should round a fractional value instead of leaking centavos into the UI', () => {
    // Given: valor nunca deveria chegar fracionado, mas a função não deve
    // vazar centavos se isso acontecer
    const cents = 150

    // When
    const formatted = formatCurrency(cents)

    // Then
    expect(formatted).toBe('R$ 2')
  })
})
