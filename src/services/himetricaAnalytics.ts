// Read API do Himetrica (https://www.himetrica.com/docs/read-api) — usa a
// chave SECRETA (hm_sk_*), diferente da NEXT_PUBLIC_HIMETRICA_API_KEY do
// tracker client-side (essa é pública de propósito). HIMETRICA_SECRET_KEY
// NUNCA leva NEXT_PUBLIC_ — só roda server-side (Server Component/service),
// nunca chega ao browser (AGENTS.md: segredo real fica só em env var).
//
// Decisão do usuário (2026-08-28): /analytics é página pública, mas só
// número AGREGADO (visitantes, país em %) — nunca IP nem dado por
// visitante individual, que é o que a Read API deles devolveria se a gente
// expusesse a resposta crua. Por isso este service já devolve só o
// agregado pronto pro componente renderizar, sem passar nenhum dado bruto
// de visitante adiante.
const HIMETRICA_API_BASE = 'https://app.himetrica.com/api/v1'

export type SiteAnalytics = {
  peopleOnline: number
  visitors: number
  pageviews: number
  countries: { country: string; percentage: number }[]
}

type RealtimeResponse = { data: { activeVisitors: number } }
type RangeResponse = { data: { pageViews: number; uniqueVisitors: number } }
type LocationsResponse = { data: { country: string; visitors: number }[] }

async function fetchJson<T>(url: string, apiKey: string): Promise<T | null> {
  const response = await fetch(url, { headers: { 'X-API-Key': apiKey }, cache: 'no-store' })
  if (!response.ok) return null
  return (await response.json()) as T
}

function countriesWithPercentage(locations: { country: string; visitors: number }[]): { country: string; percentage: number }[] {
  const total = locations.reduce((sum, item) => sum + item.visitors, 0)
  if (total === 0) return []
  return locations.map((item) => ({
    country: item.country,
    percentage: Math.round((item.visitors / total) * 100),
  }))
}

// "Desde o lançamento" (rótulo já usado na página) — primeira decisão
// registrada no log do spec (2026-08-21) como proxy do início do projeto.
const LAUNCH_DATE = '2026-08-21'

// Best-effort, igual boardApiService.fetchBoardListings: falha de config,
// rede, ou qualquer uma das três chamadas devolve null — a página cai pro
// estado "indisponível" em vez de derrubar /analytics inteira ou misturar
// dado parcial de fontes que não bateram todas.
export async function fetchSiteAnalytics(): Promise<SiteAnalytics | null> {
  const apiKey = process.env.HIMETRICA_SECRET_KEY
  const projectId = process.env.HIMETRICA_PROJECT_ID
  if (!apiKey || !projectId) return null

  const base = `${HIMETRICA_API_BASE}/projects/${projectId}`
  const endDate = new Date().toISOString().slice(0, 10)

  try {
    const [realtime, range, locations] = await Promise.all([
      fetchJson<RealtimeResponse>(`${base}/analytics/realtime`, apiKey),
      fetchJson<RangeResponse>(`${base}/analytics?startDate=${LAUNCH_DATE}&endDate=${endDate}`, apiKey),
      fetchJson<LocationsResponse>(`${base}/locations?groupBy=country`, apiKey),
    ])

    if (!realtime || !range || !locations) return null

    return {
      peopleOnline: realtime.data.activeVisitors,
      visitors: range.data.uniqueVisitors,
      pageviews: range.data.pageViews,
      countries: countriesWithPercentage(locations.data),
    }
  } catch {
    return null
  }
}
