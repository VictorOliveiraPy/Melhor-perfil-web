type HimetricaEventProperties = Record<string, string | number | boolean>

/* eslint-disable no-unused-vars -- assinatura de tipo ambiente, os nomes de
   parâmetro são só documentação; a regra base (sem o parser do TypeScript)
   não reconhece isso e acusa "não usado" à toa. */
declare global {
  interface Window {
    himetrica?: {
      track: (eventName: string, properties?: Record<string, unknown>) => void
      identify: (user: { name?: string; email?: string; metadata?: Record<string, unknown> }) => void
    }
  }
}
/* eslint-enable no-unused-vars */

// Rastreamento client-side é best-effort: o script do Himetrica pode ainda
// não ter carregado (ou o visitante bloqueou), e isso nunca pode quebrar o
// fluxo de lance por causa disso — só desiste silenciosamente.
export function trackEvent(eventName: string, properties?: HimetricaEventProperties): void {
  if (typeof window === 'undefined' || !window.himetrica) return
  try {
    window.himetrica.track(eventName, properties)
  } catch {
    // rastreamento nunca deve quebrar o fluxo principal
  }
}
