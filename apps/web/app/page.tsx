import type { Metadata } from 'next'
import Link from 'next/link'
import type { Offer } from '@/lib/types'
import { getOffers } from '@/lib/api'
import { OfferGrid } from '@/components/offer/OfferGrid'
import { Sidebar } from '@/components/layout/Sidebar'
import { ActivityTicker } from '@/components/ui/ActivityTicker'

export const metadata: Metadata = {
  title: 'RadarOfertas — Melhores Ofertas e Descontos em Portugal',
  description: 'Encontra as melhores ofertas em Portugal com histórico de preços real, Deal Score e cupões verificados. Gaming, Casa, Suplementação.',
  openGraph: {
    title: 'RadarOfertas — Melhores Ofertas e Descontos em Portugal',
    description: 'Histórico de preços real · Deal Score algorítmico · Cupões verificados. Gaming · Casa · Suplementação.',
    url: 'https://radarofertas-psi.vercel.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RadarOfertas — Melhores Ofertas em Portugal',
    description: 'Histórico de preços · Deal Score · Cupões verificados.',
  },
  alternates: {
    canonical: 'https://radarofertas-psi.vercel.app',
  },
}

interface HomeProps {
  searchParams: Promise<{ store?: string }>
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { store } = await searchParams
  let offers: Offer[] = []
  let total = 0
  let error = false

  try {
    const res = await getOffers({ limit: 40, sort: 'published_at', store })
    offers = res.data
    total = res.pagination?.total ?? res.data.length
  } catch {
    error = true
  }

  const storeName = store ? (offers[0]?.store.name ?? store) : null

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>

      {/* Hero de texto */}
      <section style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Encontra os melhores descontos e cupões promocionais
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>
          Poupa em lojas como <strong style={{ color: 'var(--primary)' }}>Amazon</strong>, <strong style={{ color: 'var(--primary)' }}>Worten</strong>, <strong style={{ color: 'var(--primary)' }}>PC Componentes</strong> e muito mais!
        </p>
      </section>

      <ActivityTicker />

      <div className="home-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          {/* Título da secção */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {storeName ? `🏪 Ofertas em ${storeName}` : '🔥 Últimas Ofertas'}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
              {storeName && (
                <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginRight: '0.75rem', fontWeight: 600 }}>
                  ✕ Limpar filtro
                </Link>
              )}
              {total} ofertas ativas
            </span>
          </div>

          {/* Lista de ofertas */}
          {error ? (
            <div style={{
              background: 'var(--muted)',
              borderRadius: 'var(--radius)',
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
              <p>A API está a inicializar. Certifica-te que o servidor está a correr.</p>
              <code style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.5rem' }}>
                pnpm dev
              </code>
            </div>
          ) : offers.length === 0 ? (
            <div style={{
              background: 'var(--muted)',
              borderRadius: 'var(--radius)',
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p>Ainda não há ofertas. Adiciona a primeira via o admin.</p>
            </div>
          ) : (
            <OfferGrid initialOffers={offers} />
          )}
        </div>

        <Sidebar />
      </div>

      {/* Schema.org WebSite + SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'RadarOfertas',
            url: 'https://radarofertas.pt',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://radarofertas.pt/pesquisa?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      {/* Schema.org ItemList */}
      {offers.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Últimas Ofertas',
              itemListElement: offers.slice(0, 10).map((offer, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://radarofertas.pt/oferta/${offer.slug}`,
                name: offer.title,
              })),
            }),
          }}
        />
      )}
    </div>
  )
}
