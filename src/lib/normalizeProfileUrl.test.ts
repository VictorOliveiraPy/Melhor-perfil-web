import { describe, it, expect } from 'vitest'
import { normalizeProfileUrl } from './normalizeProfileUrl'

describe('normalizeProfileUrl', () => {
  it('should add https when missing and remove trailing slash', () => {
    // Given
    const raw = 'example.com/user/'

    // When
    const normalized = normalizeProfileUrl(raw)

    // Then
    expect(normalized).toBe('https://example.com/user')
  })

  it('should return an empty string instead of leaking an unparseable value into the DOM', () => {
    // Given: qualquer entrada que não vira uma URL http(s) válida — o
    // fallback anterior devolvia `raw` sem checar, então um valor como
    // "javascript:alert(1)" saía intacto e ia parar direto num href=
    // (ProfileCard/ProfileDetail), abrindo XSS ao clicar no link do
    // perfil. Ver achado do security-reviewer, 2026-08-23.
    const raw = 'javascript:alert(document.cookie)'

    // When
    const normalized = normalizeProfileUrl(raw)

    // Then
    expect(normalized).toBe('')
  })

})
