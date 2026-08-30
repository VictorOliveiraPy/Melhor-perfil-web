// Client HTTP genérico, separado dos services de domínio (AGENTS.md seção
// 2, padrão reaproveitado do santo-guardiao-web). Só fala com rotas
// same-origin (o proxy /api/:path*) — nunca com a API externamente, nunca
// anexa header de borda (isso é trabalho do proxy, server-side).
export class HttpError extends Error {
  status: number
  // Preenchido só quando o backend devolve detail={message, reason} (ex.:
  // erros de cupom de lançamento — melhorperfil-api) em vez de detail
  // string simples. Machine-readable, pra caller distinguir casos (código
  // inválido vs. esgotado vs. rate limit) sem parsear a mensagem humana.
  reason?: string

  constructor(status: number, message: string, reason?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.reason = reason
  }
}

function isStructuredDetail(value: unknown): value is { message: unknown; reason?: unknown } {
  return typeof value === 'object' && value !== null && 'message' in value
}

async function extractErrorDetail(
  response: Response,
  path: string,
  method: string,
): Promise<{ message: string; reason?: string }> {
  // FastAPI devolve erro de validação como { detail: "..." } (string) na
  // maioria das rotas, mas algumas (cupom de lançamento) usam
  // { detail: { message, reason } } — um objeto estruturado com um motivo
  // machine-readable além do texto humano. Sem tratar os dois formatos,
  // o segundo virava a string literal "[object Object]" pro usuário e o
  // "reason" se perdia.
  const detail = await response
    .json()
    .then((data: unknown): { message: string; reason?: string } | null => {
      if (!data || typeof data !== 'object' || !('detail' in data)) return null
      const raw = (data as { detail: unknown }).detail
      if (isStructuredDetail(raw)) return { message: String(raw.message), reason: raw.reason ? String(raw.reason) : undefined }
      return typeof raw === 'string' ? { message: raw } : null
    })
    .catch(() => null)

  return detail ?? { message: `${method} ${path} failed with status ${response.status}` }
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(path)

  if (!response.ok) {
    const { message, reason } = await extractErrorDetail(response, path, 'GET')
    throw new HttpError(response.status, message, reason)
  }

  return (await response.json()) as TResponse
}

export async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const { message, reason } = await extractErrorDetail(response, path, 'POST')
    throw new HttpError(response.status, message, reason)
  }

  return (await response.json()) as TResponse
}
