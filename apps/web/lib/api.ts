import type { Offer, Category, Store, ApiResponse, PaginationMeta, PricePoint, RecentComment, RecentActivity } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // Leituras (GET) no servidor ficam em cache 60s: a home é dinâmica (filtro por loja) e sem isto
  // cada visita bateria na API. No browser esta opção é ignorada.
  const isGet = !options?.method || options.method === 'GET'
  const res = await fetch(`${API_URL}${path}`, {
    ...(isGet ? { next: { revalidate: 60 } } : {}),
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// ── Ofertas ───────────────────────────────────────────────────
export async function getOffers(params?: {
  page?: number
  limit?: number
  category?: string
  store?: string
  sort?: string
}): Promise<{ data: Offer[]; pagination: PaginationMeta }> {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))
  if (params?.category) qs.set('category', params.category)
  if (params?.store) qs.set('store', params.store)
  if (params?.sort) qs.set('sort', params.sort)

  return apiFetch(`/api/offers?${qs}`)
}

export async function getOffer(slug: string): Promise<{ data: Offer & { priceStats: any } }> {
  return apiFetch(`/api/offers/${slug}`)
}

export async function getPriceHistory(offerId: number, days = 90): Promise<{ data: PricePoint[] }> {
  return apiFetch(`/api/offers/${offerId}/history?days=${days}`)
}

// ── Categorias ────────────────────────────────────────────────
export async function getCategories(): Promise<{ data: { categories: (Category & {count: number})[], stores: (Store & {count: number})[] } }> {
  return apiFetch('/api/categories')
}

export async function getCategoryOffers(slug: string, page = 1): Promise<{
  data: { category: Category; offers: Offer[]; pagination: PaginationMeta }
}> {
  return apiFetch(`/api/categories/${slug}?page=${page}`)
}

// ── Lojas ─────────────────────────────────────────────────────
export async function getStores(): Promise<{ data: Store[] }> {
  return apiFetch('/api/stores')
}

// ── Pesquisa ──────────────────────────────────────────────────
export async function searchOffers(q: string): Promise<{ data: Offer[]; query: string }> {
  return apiFetch(`/api/search?q=${encodeURIComponent(q)}`)
}

// ── Click tracking ────────────────────────────────────────────
export async function trackClick(offerId: number, channel = 'web'): Promise<void> {
  await apiFetch('/api/clicks', {
    method: 'POST',
    body: JSON.stringify({ offerId, channel }),
  }).catch(() => {}) // silencioso — não bloquear o clique
}

// ── Comentários recentes (sidebar) ───────────────────────────
export async function getRecentComments(limit = 5): Promise<{ data: RecentComment[] }> {
  return apiFetch(`/api/comments/recent?limit=${limit}`)
}

// ── Atividade recente (ticker: voto mais recente) ────────────
export async function getRecentActivity(): Promise<{ data: RecentActivity | null }> {
  return apiFetch('/api/offers/activity/recent')
}

// ── Presença ("X pessoas no site agora") ─────────────────────
export async function pingPresence(sessionId: string): Promise<{ data: { online: number } }> {
  return apiFetch('/api/presence/ping', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
  })
}
