const IOS_DEVICE_REGEX = /iPad|iPhone|iPod/
const NON_SAFARI_IOS_BROWSER_REGEX = /CriOS|FxiOS|EdgiOS|OPiOS/

// iOS nunca implementou beforeinstallprompt (Apple não adotou essa API) —
// o único jeito de instalar é manual, via Compartilhar > Adicionar à Tela
// de Início, e só o Safari expõe essa opção no menu (Chrome/Firefox/Edge
// no iOS rodam sobre o mesmo motor WebKit por exigência da Apple, mas não
// têm "Adicionar à Tela de Início"). Detecta esse caso específico pra
// mostrar instrução manual no InstallPwaBanner em vez do botão "Instalar"
// (que nunca dispararia nada lá).
export function isIosSafari(userAgent: string): boolean {
  return IOS_DEVICE_REGEX.test(userAgent) && !NON_SAFARI_IOS_BROWSER_REGEX.test(userAgent)
}
