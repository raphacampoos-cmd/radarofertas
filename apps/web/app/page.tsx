import type { Metadata } from 'next'
import { getOffers } from '@/lib/api'
import { OfferCard } from '@/components/offer/OfferCard'

export const metadata: Metadata = {
  title: 'RadarOfertas — Melhores Ofertas e Descontos em Portugal',
  description: 'Encontra as melhores ofertas em Portugal com histórico de preços real, Deal Score e cupões verificados. Gaming, Casa, Suplementação.',
}

export const revalidate = 300 // revalidar a cada 5 minutos

export default async function HomePage() {
  let offers = []
  let error = false

  try {
    const res = await getOffers({ limit: 20, sort: 'published_at' })
    offers = res.data
  } catch {
    error = true
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        color: '#fff',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.2 }}>
            📡 Radar de Ofertas Portugal
          </h1>
          <p style={{ opacity: 0.9, maxWidth: '500px', lineHeight: 1.6 }}>
            Histórico de preços real · Deal Score algorítmico · Cupões verificados
            <br />
            <strong>Gaming · Casa · Suplementação</strong>
          </p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }}>🎯</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.25rem' }}>
            Esta oferta vale a pena?
          </div>
        </div>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          {offers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
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
