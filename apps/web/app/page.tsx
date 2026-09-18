import type { Metadata } from 'next'
import type { Offer } from '@/lib/types'
import { getOffers } from '@/lib/api'
import { OfferGrid } from '@/components/offer/OfferGrid'

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

export const revalidate = 300 // revalidar a cada 5 minutos

export default async function HomePage() {
  let offers: Offer[] = []
  let error = false

  try {
    const res = await getOffers({ limit: 100, sort: 'published_at' })
    offers = res.data
  } catch {
    error = true
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>

      {/* Hero Banner */}
      <section style={{
        borderRadius: 'var(--radius)',
        marginBottom: '2rem',
        overflow: 'hidden',
        border: '1px solid #2a2a3a',
      }}>
        <img
          src="/banner-hero.jpg"
          alt="RadarOfertas PT — Cupões Amazon verificados todos os dias. Tecnologia, Casa, Gaming, Beleza. Até 70% OFF na Amazon.es"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </section>

      {/* Título da secção */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
          🔥 Últimas Ofertas
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
          {offers.length} ofertas ativas
        </span>
      </div>

      {/* Grid de ofertas */}
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
