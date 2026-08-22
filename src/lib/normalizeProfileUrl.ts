export function normalizeProfileUrl(raw: string): string {
  if (!raw) return ''
  let url = raw.trim()

  // add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  try {
    const u = new URL(url)
    // remove trailing slash
    u.pathname = u.pathname.replace(/\/+$/,'')
    return u.toString()
  } catch (e) {
    return raw
  }
}
