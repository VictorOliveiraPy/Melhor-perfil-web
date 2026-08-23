export type Platform = 'instagram' | 'linkedin'

/**
 * Accepts either a full profile URL or a bare "@handle" and returns a full
 * profile URL. A bare handle is expanded using the platform's canonical
 * personal-profile domain; anything else (assumed to already be a URL) is
 * returned untouched — normalizeProfileUrl handles cleanup/protocol from there.
 */
export function resolveProfileInput(raw: string, platform: Platform): string {
  const trimmed = (raw ?? '').trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('@')) {
    const handle = trimmed.slice(1).trim()
    if (!handle) return ''

    return platform === 'linkedin' ? `https://www.linkedin.com/in/${handle}` : `https://instagram.com/${handle}`
  }

  return trimmed
}
