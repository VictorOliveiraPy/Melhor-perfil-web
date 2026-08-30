import { describe, it, expect } from 'vitest'
import { stringifyJsonLd } from './stringifyJsonLd'

describe('stringifyJsonLd', () => {
  it('should serialize a plain object like JSON.stringify', () => {
    // Given / When
    const result = stringifyJsonLd({ a: 1, b: 'x' })

    // Then
    expect(result).toBe('{"a":1,"b":"x"}')
  })

  it('should escape "<" so a value containing "</script>" cannot break out of the script tag', () => {
    // Given: bio/nome vêm de scraping — mesmo já passando por sanitização
    // de HTML no backend (nh3), essa sanitização mira renderização em HTML
    // normal, não o contexto específico de dentro de <script type=
    // "application/ld+json">. JSON.stringify sozinho NÃO escapa "<",
    // então um valor com "</script><script>alert(1)</script>" fecharia a
    // tag JSON-LD e injetaria HTML/JS de verdade.
    const malicious = { name: '</script><script>alert(1)</script>' }

    // When
    const result = stringifyJsonLd(malicious)

    // Then
    expect(result).not.toContain('</script>')
    expect(result).toContain('\\u003c/script>')
  })
})
