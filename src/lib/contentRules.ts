export function isValidProfileUrl(value: string): boolean {
  const raw = (value ?? '').trim()
  if (!raw) return false

  let candidate = raw
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `https://${candidate}`
  }

  try {
    const url = new URL(candidate)
    const host = url.hostname.replace(/^www\./i, '').toLowerCase()
    const pathname = url.pathname.replace(/\/+$/, '')

    if (host === 'instagram.com') {
      return pathname.length > 1 && !pathname.includes('/p/') && !pathname.includes('/reel/')
    }

    if (host === 'linkedin.com') {
      const isCompany = /^\/company\//i.test(pathname)
      const isProfile = /^\/in\//i.test(pathname)
      return (isCompany || isProfile) && pathname.length > 4
    }

    return false
  } catch {
    return false
  }
}

export function isForbiddenBio(value: string): boolean {
  const text = (value ?? '').toLowerCase()
  const forbiddenPatterns = [
    'wa.me',
    'whatsapp.com',
    'telegram.me',
    't.me',
    'discord.gg',
    'discord.com/invite',
    'signal.me',
    'messenger.com',
    'm.me',
  ]

  return forbiddenPatterns.some((pattern) => text.includes(pattern))
}
