import { describe, it, expect } from 'vitest'
import { sanitizeDisplayName } from './sanitize'

describe('sanitizeDisplayName', () => {
  it('should escape HTML characters', () => {
    // Given
    const raw = '<script>alert("x")</script> & name'

    // When
    const safe = sanitizeDisplayName(raw)

    // Then
    expect(safe).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; name')
  })
})
