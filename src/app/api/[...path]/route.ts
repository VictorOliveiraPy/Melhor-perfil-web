import { NextRequest, NextResponse } from 'next/server'
import { buildGatewayRequest } from '../../../lib/gatewayProxy'

// Proxy same-origin /api/:path* -> melhorperfil-api (AGENTS.md seção 3).
// Roda inteiramente server-side — Route Handler do Next.js nunca entra no
// bundle do client — e é o único lugar autorizado a ler GATEWAY_SECRET.
// Nenhum client component deve fazer fetch direto pra fora daqui.
type RouteParams = { params: { path: string[] } }

async function handleProxyRequest(request: NextRequest, path: string[]): Promise<NextResponse> {
  const apiBaseUrl = process.env.API_BASE_URL

  if (!apiBaseUrl) {
    return NextResponse.json({ error: 'API_BASE_URL não configurado no ambiente do melhorperfil-web' }, { status: 500 })
  }

  const { url, headers } = buildGatewayRequest({
    apiBaseUrl,
    path,
    search: request.nextUrl.search,
    gatewaySecret: process.env.GATEWAY_SECRET,
  })

  const isBodyless = request.method === 'GET' || request.method === 'HEAD'

  try {
    const upstream = await fetch(url, {
      method: request.method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: isBodyless ? undefined : await request.text(),
      cache: 'no-store',
    })

    const body = await upstream.text()
    return new NextResponse(body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json' },
    })
  } catch {
    // melhorperfil-api fora do ar, endpoint ainda não implementado, ou
    // API_BASE_URL apontando pra lugar nenhum (comum em dev local antes do
    // backend subir) — devolve 502 pro caller decidir o que fazer.
    return NextResponse.json({ error: 'Falha ao contatar a API' }, { status: 502 })
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  return handleProxyRequest(request, params.path)
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  return handleProxyRequest(request, params.path)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  return handleProxyRequest(request, params.path)
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return handleProxyRequest(request, params.path)
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return handleProxyRequest(request, params.path)
}
