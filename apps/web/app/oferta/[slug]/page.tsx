import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getOffer, getPriceHistory } from '@/lib/api'
import { DealScoreBadge } from '@/components/offer/DealScoreBadge'
import { PriceHistory } from '@/components/offer/PriceHistory'
import { formatPrice, formatTimeAgo } from '@/lib/utils'
import { AffiliateButton } from '@/components/offer/AffiliateButton'
import { CouponBox } from '@/components/offer/CouponBox'
import { ShareButtonBig } from '@/components/offer/ShareButtonBig'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const res = await getOffer(slug)
    const offer = res.data
    const price = parseFloat(offer.priceCurrent || '0')
    const discount = parseFloat(offer.discountPct || '0')

    return {
      title: `${offer.title} — ${Math.round(discount)}% Desconto`,
      description: `${offer.title} por ${formatPrice(price)} na ${offer.store.name}. Deal Score: ${Math.round(parseFloat(offer.dealScore || '0'))}/100. ${offer.isMinHistoric ? '🔥 Mínimo histórico!' : ''}`,
      openGraph: {
        title: offer.title,
        description: `${formatPrice(price)} na ${offer.store.name}`,
        images: offer.imageUrl ? [{ url: offer.imageUrl, width: 800, height: 600 }] : [],
        type: 'article',
      },
      // INDEXADO! Diferencial vs Cupões Tá Fixe que usa noindex
      robots: { index: true, follow: true },
      alternates: {
        canonical: `https://radarofertas.pt/oferta/${slug}`,
      },
    }
  } catch {
    return { title: 'Oferta não encontrada' }
  }
}

export const revalidate = 3600 // 1 hora

export default async function OfferPage({ params }: PageProps) {
  const { slug } = await params

  let offer: any = null
  let history: any[] = []

  try {
    const offerRes = await getOffer(slug)
    offer = offerRes.data
    // Buscar histórico separadamente, sem falhar a página se não houver dados
    try {
      const historyRes = await getPriceHistory(offer.id, 90)
      history = historyRes.data
    } catch {
      history = []
    }
  } catch {
    notFound()
  }

  if (!offer) notFound()

  const priceCurrent = parseFloat(offer.priceCurrent || '0')
  const priceOriginal = parseFloat(offer.priceOriginal || '0')
  const priceMinimum = parseFloat(offer.priceMinimum || '0')
  const discountPct = parseFloat(offer.discountPct || '0')
  const dealScore = parseFloat(offer.dealScore || '0')

  // Schema.org Product
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: offer.title,
    description: offer.description,
    image: offer.imageUrl,
    sku: offer.externalId,
    brand: { '@type': 'Brand', name: offer.store.name },
    offers: {
      '@type': 'Offer',
      price: priceCurrent.toFixed(2),
      priceCurrency: 'EUR',
      availability: offer.availability === 'InStock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: offer.expiresAt
        ? new Date(offer.expiresAt).toISOString().split('T')[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: { '@type': 'Organization', name: offer.store.name },
      url: offer.affiliateUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: Math.min(5, (dealScore / 100) * 5).toFixed(1),
      bestRating: '5',
      worstRating: '1',
      reviewCount: Math.max(1, offer.clickCount || 1),
    },
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
        <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Início</a>
        {offer.categories?.[0] && (
          <>
            {' › '}
            <a href={`/categoria/${offer.categories[0].slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {offer.categories[0].name}
            </a>
          </>
        )}
        {' › '}
        <span style={{ color: 'var(--foreground)' }}>{offer.title.slice(0, 50)}...</span>
      </nav>

      {/* Conteúdo principal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Coluna esquerda: Imagem */}
        <div>
          <div style={{
            background: '#f8fafc',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            position: 'relative',
            paddingTop: '100%',
          }}>
            {offer.imageUrl ? (
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                fill
                priority
                style={{ objectFit: 'contain', padding: '1.5rem' }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '5rem',
              }}>📦</div>
            )}
          </div>

          {/* Histórico de preços */}
          <div style={{
            marginTop: '1.5rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
          }}>
            <PriceHistory
              history={history}
              currentPrice={priceCurrent}
              minPrice={priceMinimum > 0 ? priceMinimum : null}
            />
          </div>
        </div>

        {/* Coluna direita: Detalhes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Badges */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {offer.isMinHistoric && (
              <span style={{
                background: '#dc2626',
                color: '#fff',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}>
                🔥 MÍNIMO HISTÓRICO
              </span>
            )}
            {discountPct > 0 && (
              <span style={{
                background: '#16a34a',
                color: '#fff',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}>
                -{Math.round(discountPct)}% desconto
              </span>
            )}
          </div>

          {/* Título */}
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.3 }}>
            {offer.title}
          </h1>

          {/* Loja e data */}
          <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            Vendido por <strong>{offer.store.name}</strong> · Publicado {formatTimeAgo(offer.publishedAt)}
          </div>

          {/* Preços */}
          <div style={{
            background: 'var(--muted)',
            borderRadius: 'var(--radius)',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)' }}>
                {formatPrice(priceCurrent)}
              </span>
              {priceOriginal > priceCurrent && (
                <span style={{ fontSize: '1.1rem', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>
                  {formatPrice(priceOriginal)}
                </span>
              )}
            </div>
            {priceMinimum > 0 && priceMinimum < priceCurrent && (
              <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.5rem' }}>
                📊 Mínimo histórico registado: {formatPrice(priceMinimum)}
              </div>
            )}
          </div>

          {/* Deal Score */}
          <DealScoreBadge score={dealScore} />

          {/* Cupão */}
          {offer.couponCode && (
            <CouponBox code={offer.couponCode} affiliateUrl={offer.affiliateUrl} />
          )}

          {/* CTA Principal */}
          <AffiliateButton
            offerId={offer.id}
            affiliateUrl={offer.affiliateUrl}
            storeName={offer.store.name}
          />

          {/* Botão de Partilha */}
          <ShareButtonBig 
            title={offer.title} 
            slug={offer.slug} 
            price={formatPrice(priceCurrent)} 
          />

          {/* Aviso */}
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            ⚠️ Os preços e disponibilidade podem variar após a publicação. Verifica sempre o preço final na loja antes de comprar. Links com * podem gerar comissão para o RadarOfertas.
          </p>

          {/* Descrição */}
          {offer.description && (
            <div style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1rem',
            }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                Sobre este produto
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.7 }}>
                {offer.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radarofertas.pt' },
              ...(offer.categories?.[0] ? [{
                '@type': 'ListItem',
                position: 2,
                name: offer.categories[0].name,
                item: `https://radarofertas.pt/categoria/${offer.categories[0].slug}`,
              }] : []),
              { '@type': 'ListItem', position: 3, name: offer.title },
            ],
          }),
        }}
      />
    </div>
  )
}
