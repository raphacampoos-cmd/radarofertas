import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryOffers } from '@/lib/api'
import { OfferCard } from '@/components/offer/OfferCard'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const res = await getCategoryOffers(slug)
    const cat = res.data.category
    return {
      title: `${cat.icon || ''} ${cat.name} — Melhores Ofertas`,
      description: cat.description || `As melhores ofertas de ${cat.name} em Portugal. Deal Score, histórico de preços e cupões verificados.`,
      alternates: {
        canonical: `https://radarofertas.pt/categoria/${slug}`,
      },
    }
  } catch {
    return { title: 'Categoria' }
  }
}

export const revalidate = 300

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr || '1'))

  let category: any = null
  let offers: any[] = []
  let pagination: any = null

  try {
    const res = await getCategoryOffers(slug, page)
    category = res.data.category
    offers = res.data.offers
    pagination = res.data.pagination
  } catch {
    notFound()
  }

  if (!category) notFound()

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
        <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Início</a>
        {' › '}
        <span>{category.icon} {category.name}</span>
      </nav>

      {/* Título */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {category.icon} {category.name}
        </h1>
        {category.description && (
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>{category.description}</p>
        )}
        <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>
          {pagination?.total || 0} ofertas ativas
        </p>
      </div>

      {/* Grid */}
      {offers.length === 0 ? (
        <div style={{
          background: 'var(--muted)',
          borderRadius: 'var(--radius)',
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--muted-foreground)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <p>Ainda não há ofertas nesta categoria.</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            {offers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {page > 1 && (
                <a href={`/categoria/${slug}?page=${page - 1}`} style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: 'var(--foreground)',
                }}>← Anterior</a>
              )}
              <span style={{ padding: '0.5rem 1rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                {page} / {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <a href={`/categoria/${slug}?page=${page + 1}`} style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: 'var(--foreground)',
                }}>Seguinte →</a>
              )}
            </div>
          )}
        </>
      )}

      {/* Schema.org CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${category.name} — Ofertas RadarOfertas`,
            description: category.description,
            url: `https://radarofertas.pt/categoria/${slug}`,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radarofertas.pt' },
                { '@type': 'ListItem', position: 2, name: category.name, item: `https://radarofertas.pt/categoria/${slug}` },
              ],
            },
          }),
        }}
      />
    </div>
  )
}
