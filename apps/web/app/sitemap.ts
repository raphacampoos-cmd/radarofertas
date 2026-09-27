import type { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://radarofertas-psi.vercel.app'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/termos`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacidade`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/politica-cookies`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/lojas`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/black-friday`, changeFrequency: 'daily', priority: 0.95 },
    { url: `${baseUrl}/cyber-monday`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/singles-day`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/natal`, changeFrequency: 'daily', priority: 0.9 },
  ]

  // Categorias dinâmicas
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const catRes = await fetch(`${API_URL}/api/categories`, { next: { revalidate: 3600 } })
    const catData = await catRes.json()
    const rawCats = catData?.data?.categories || catData?.data || []
    categoryRoutes = rawCats.map((cat: any) => ({
      url: `${baseUrl}/categoria/${cat.slug}`,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    }))
  } catch {}

  // Lojas dinâmicas (apenas lojas com ofertas qualificadas ou cupões ativos)
  let storeRoutes: MetadataRoute.Sitemap = []
  try {
    const storesRes = await fetch(`${API_URL}/api/stores`, { next: { revalidate: 3600 } })
    const storesData = await storesRes.json()
    storeRoutes = (storesData?.data || [])
      .filter((store: any) => (store.activeOffersCount > 0 || store.couponsCount > 0))
      .map((store: any) => ({
        url: `${baseUrl}/loja/${store.slug}`,
        changeFrequency: 'daily' as const,
        priority: 0.85,
      }))
  } catch {}

  // Ofertas dinâmicas
  let offerRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/api/offers?limit=500`, { next: { revalidate: 3600 } })
    const data = await res.json()
    offerRoutes = (data?.data || []).map((offer: any) => ({
      url: `${baseUrl}/oferta/${offer.slug}`,
      lastModified: new Date(offer.updatedAt || offer.publishedAt),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }))
  } catch {}

  return [...staticRoutes, ...categoryRoutes, ...storeRoutes, ...offerRoutes]
}
