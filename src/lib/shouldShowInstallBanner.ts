const SNOOZE_DAYS = 14

// Regra pura de quando reexibir o banner de "instalar app" — extraída do
// componente (InstallPwaBanner) pra ser testável sem mockar
// localStorage/BeforeInstallPromptEvent. Dispensar não é "nunca mais", é
// soneca: reaparece depois de SNOOZE_DAYS pra não perder alguém que só
// dispensou sem prestar atenção.
export function shouldShowInstallBanner(lastDismissedAt: string | null, now: Date): boolean {
  if (!lastDismissedAt) return true

  const dismissedAt = new Date(lastDismissedAt)
  if (Number.isNaN(dismissedAt.getTime())) return true

  const elapsedMs = now.getTime() - dismissedAt.getTime()
  return elapsedMs >= SNOOZE_DAYS * 24 * 60 * 60 * 1000
}
