import type { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://radarofertas-psi.vercel.app'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/termos`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacidade`, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Categorias dinâmicas
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const catRes = await fetch(`${API_URL}/api/categories`, { next: { revalidate: 3600 } })
    const catData = await catRes.json()
    categoryRoutes = catData.data.map((cat: any) => ({
      url: `${baseUrl}/categoria/${cat.slug}`,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    }))
  } catch {}

  // Ofertas dinâmicas
  let offerRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/api/offers?limit=500`, { next: { revalidate: 3600 } })
    const data = await res.json()
    offerRoutes = data.data.map((offer: any) => ({
      url: `${baseUrl}/oferta/${offer.slug}`,
      lastModified: new Date(offer.updatedAt || offer.publishedAt),
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }))
  } catch {}

  return [...staticRoutes, ...categoryRoutes, ...offerRoutes]
}
