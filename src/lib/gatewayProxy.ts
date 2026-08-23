export type GatewayRequest = {
  url: string
  headers: Record<string, string>
}

type BuildGatewayRequestParams = {
  apiBaseUrl: string
  path: string[]
  search: string
  gatewaySecret?: string
}

// Monta a URL final e os headers pra encaminhar uma chamada de /api/:path*
// pro melhorperfil-api, anexando X-Gateway-Secret (AGENTS.md seção 3). É a
// única parte da lógica do proxy que vale a pena testar isolada — o resto
// (route.ts) é só fetch + repassar a resposta, glue de framework.
export function buildGatewayRequest({ apiBaseUrl, path, search, gatewaySecret }: BuildGatewayRequestParams): GatewayRequest {
  const base = apiBaseUrl.replace(/\/+$/, '')
  const url = `${base}/${path.join('/')}${search}`

  const headers: Record<string, string> = {}
  if (gatewaySecret) {
    headers['X-Gateway-Secret'] = gatewaySecret
  }

  return { url, headers }
}
