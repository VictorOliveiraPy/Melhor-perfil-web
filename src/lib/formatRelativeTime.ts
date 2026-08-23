// "há X tempo" a partir do created_at que a API devolve (ISO 8601). `now` é
// injetável só pra teste determinístico — em produção sempre usa o real.
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const then = new Date(isoDate)
  const diffMinutes = Math.floor((now.getTime() - then.getTime()) / 60000)

  if (diffMinutes < 1) return 'agora mesmo'

  if (diffMinutes < 60) {
    return `há ${diffMinutes} minuto${diffMinutes === 1 ? '' : 's'}`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `há ${diffHours} hora${diffHours === 1 ? '' : 's'}`
  }

  const diffDays = Math.floor(diffHours / 24)
  return `há ${diffDays} dia${diffDays === 1 ? '' : 's'}`
}
