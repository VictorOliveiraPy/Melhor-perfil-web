// Client HTTP genérico, separado dos services de domínio (AGENTS.md seção
// 2, padrão reaproveitado do santo-guardiao-web). Só fala com rotas
// same-origin (o proxy /api/:path*) — nunca com a API externamente, nunca
// anexa header de borda (isso é trabalho do proxy, server-side).
export class HttpError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new HttpError(response.status, `POST ${path} failed with status ${response.status}`)
  }

  return (await response.json()) as TResponse
}
