import type { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://radarofertas.pt'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/categoria/gaming`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/categoria/casa`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/categoria/suplementacao`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/pesquisa`, changeFrequency: 'monthly', priority: 0.3 },
  ]

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
  } catch {
    // Se API não disponível, continuar sem ofertas
  }

  return [...staticRoutes, ...offerRoutes]
}
