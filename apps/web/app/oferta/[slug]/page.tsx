import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getOffer, getPriceHistory, getOffers } from '@/lib/api'
import { DealScoreBadge } from '@/components/offer/DealScoreBadge'
import { PriceHistory } from '@/components/offer/PriceHistory'
import { formatPrice, formatTimeAgo } from '@/lib/utils'
import { AffiliateButton } from '@/components/offer/AffiliateButton'
import { CouponBox } from '@/components/offer/CouponBox'
import { ShareButtonBig } from '@/components/offer/ShareButtonBig'
import { VoteButtons } from '@/components/offer/VoteButtons'
import { CommentsSection } from '@/components/offer/CommentsSection'
import { OfferSpecsSection } from '@/components/offer/OfferSpecsSection'
import { OfferImage } from '@/components/offer/OfferImage'
import { VipAlertBanner } from '@/components/offer/VipAlertBanner'
import { PriceAlertButton } from '@/components/offer/PriceAlertButton'
import { OfferCard } from '@/components/offer/OfferCard'
import { StickyMobileCta } from '@/components/offer/StickyMobileCta'
import { isAmazonOffer } from '@/lib/amazon-compliance'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const res = await getOffer(slug)
    const offer = res.data
    const isAmazon = isAmazonOffer(offer)
    const price = parseFloat(offer.priceCurrent || '0')
    const discount = parseFloat(offer.discountPct || '0')
    const title = !isAmazon && discount > 0
      ? `${offer.title} — ${Math.round(discount)}% Desconto`
      : offer.title

    const description = isAmazon
      ? `${offer.title} na ${offer.store.name}. Consulta o preço atualizado em tempo real e opções de envio diretamente na loja.`
      : `${offer.title} por ${formatPrice(price)} na ${offer.store.name}. Deal Score: ${Math.round(parseFloat(offer.dealScore || '0'))}/100. ${offer.isMinHistoric ? '🔥 Mínimo histórico!' : ''}`

    const ogDescription = isAmazon
      ? `Disponível na ${offer.store.name}. Consulta o preço em tempo real.`
      : `${formatPrice(price)} na ${offer.store.name}`

    return {
      title,
      description,
      openGraph: {
        title: offer.title,
        description: ogDescription,
        images: offer.imageUrl ? [{ url: offer.imageUrl, width: 800, height: 600 }] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: offer.title,
        description: ogDescription,
        images: offer.imageUrl ? [offer.imageUrl] : [],
      },
      robots: { index: true, follow: true },
      alternates: {
        canonical: `https://radarofertas-psi.vercel.app/oferta/${slug}`,
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
  let relatedOffers: any[] = []

  try {
    const offerRes = await getOffer(slug)
    offer = offerRes.data

    try {
      const historyRes = await getPriceHistory(offer.id, 90)
      history = historyRes.data
    } catch {
      history = []
    }

    try {
      const catSlug = offer.categories?.[0]?.slug
      if (catSlug) {
        const relatedRes = await getOffers({ category: catSlug, limit: 4, qualified: true })
        relatedOffers = (relatedRes.data || []).filter((o: any) => o.id !== offer.id).slice(0, 3)
      }
    } catch {
      relatedOffers = []
    }
  } catch {
    notFound()
  }

  if (!offer) notFound()

  const isAmazon = isAmazonOffer(offer)
  const priceCurrent = parseFloat(offer.priceCurrent || '0')
  const priceOriginal = parseFloat(offer.priceOriginal || '0')
  const priceMinimum = parseFloat(offer.priceMinimum || '0')
  const discountPct = parseFloat(offer.discountPct || '0')
  const dealScore = parseFloat(offer.dealScore || '0')
  const savingsEur = priceOriginal > priceCurrent ? priceOriginal - priceCurrent : 0

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
      ...(isAmazon ? {} : { price: priceCurrent.toFixed(2), priceCurrency: 'EUR' }),
      availability: offer.availability === 'InStock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: offer.expiresAt
        ? new Date(offer.expiresAt).toISOString().split('T')[0]
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: { '@type': 'Organization', name: offer.store.name },
      url: offer.affiliateUrl,
    },
    ...(!isAmazon && dealScore > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Math.min(5, (dealScore / 100) * 5).toFixed(1),
        bestRating: '5',
        worstRating: '1',
        reviewCount: Math.max(1, offer.clickCount || 1),
      },
    } : {}),
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
      {/* Breadcrumb HUD */}
      <nav style={{
        fontSize: '0.8rem',
        color: '#94a3b8',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        flexWrap: 'wrap',
      }}>
        <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        {offer.categories?.[0] && (
          <>
            <Link href={`/categoria/${offer.categories[0].slug}`} style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              {offer.categories[0].name}
            </Link>
            <span>›</span>
          </>
        )}
        <span style={{ color: '#f97316', fontWeight: 600 }}>
          {offer.title.length > 45 ? offer.title.slice(0, 45) + '…' : offer.title}
        </span>
      </nav>

      {/* Conteúdo principal Bento */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
        marginBottom: '2.5rem',
      }}>
        {/* Coluna esquerda: Imagem & Histórico */}
        <div>
          <div className="glass-card" style={{
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, rgba(13, 14, 25, 0.9) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <OfferImage
              src={offer.imageUrl}
              alt={offer.title}
              storeName={offer.store?.name}
              storeLogo={offer.store?.logoUrl}
            />
          </div>

          {/* Histórico de preços */}
          {!isAmazon && (
            <div className="glass-card" style={{
              marginTop: '1.5rem',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
            }}>
              <PriceHistory
                history={history}
                currentPrice={priceCurrent}
                minPrice={priceMinimum > 0 ? priceMinimum : null}
              />
            </div>
          )}
        </div>

        {/* Coluna direita: Detalhes & Compra */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Badges de Destaque */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {!isAmazon && offer.isMinHistoric && (
              <span style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                color: '#fff',
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.03em',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                🔥 MÍNIMO HISTÓRICO
              </span>
            )}
            {!isAmazon && discountPct > 0 && (
              <span style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#fff',
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                boxShadow: '0 0 12px rgba(249, 115, 22, 0.35)',
              }}>
                -{Math.round(discountPct)}% DESCONTO
              </span>
            )}
            <span style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
            }}>
              ● VERIFICADO POR IA
            </span>
          </div>

          {/* Título Principal */}
          <h1 style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
            fontWeight: 900,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}>
            {offer.titlePt || offer.title}
          </h1>

          {/* Loja e Data */}
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Disponível na</span>
            <Link
              href={`/loja/${offer.store.slug}`}
              style={{
                color: '#38bdf8',
                fontWeight: 700,
                textDecoration: 'none',
                background: 'rgba(56, 189, 248, 0.08)',
                padding: '0.15rem 0.5rem',
                borderRadius: '0.35rem',
              }}
              title={`Ver todos os cupões e promoções da ${offer.store.name}`}
            >
              {offer.store.name}
            </Link>
            <span>·</span>
            <span>Publicado {formatTimeAgo(offer.publishedAt)}</span>
          </div>

          {/* Caixa de Preço HUD */}
          {isAmazon ? (
            <div className="glass-card" style={{
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
            }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.35rem' }}>
                📦 Preço atualizado em direto na Amazon.es
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                Os preços na Amazon oscilam dinamicamente ao longo do dia consoante o stock e os vendedores. Consulta o valor atualizado e condições de envio diretamente na página oficial da Amazon.
              </p>
            </div>
          ) : (
            <div className="glass-card" style={{
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(13, 14, 25, 0.8) 100%)',
              borderColor: 'rgba(249, 115, 22, 0.3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f97316', letterSpacing: '-0.03em' }}>
                  {formatPrice(priceCurrent)}
                </span>
                {priceOriginal > priceCurrent && (
                  <span style={{ fontSize: '1.2rem', color: '#64748b', textDecoration: 'line-through' }}>
                    {formatPrice(priceOriginal)}
                  </span>
                )}
              </div>
              {savingsEur > 0 && (
                <div style={{
                  fontSize: '0.85rem',
                  color: '#10b981',
                  fontWeight: 700,
                  marginTop: '0.35rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}>
                  <span>⚡ Poupança direta de {formatPrice(savingsEur)}</span>
                </div>
              )}
              {priceMinimum > 0 && priceMinimum < priceCurrent && (
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem', fontFamily: 'monospace' }}>
                  📊 Mínimo histórico registado: {formatPrice(priceMinimum)}
                </div>
              )}
            </div>
          )}

          {/* Deal Score Badge */}
          {!isAmazon && <DealScoreBadge score={dealScore} />}

          {/* Cupão de Desconto */}
          {offer.couponCode && (
            <CouponBox code={offer.couponCode} affiliateUrl={offer.affiliateUrl} />
          )}

          {/* CTA Principal de Afiliado */}
          <AffiliateButton
            offerId={offer.id}
            affiliateUrl={offer.affiliateUrl}
            storeName={offer.store.name}
            customLabel={isAmazon ? 'Ver preço atual na Amazon →' : undefined}
          />

          {/* Alerta de Preço & Partilha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <PriceAlertButton offerId={offer.id} currentPrice={priceCurrent} />
            <ShareButtonBig 
              title={offer.title} 
              slug={offer.slug} 
              price={isAmazon ? '' : formatPrice(priceCurrent)} 
            />
          </div>

          {/* Votos Fixe / Terminado */}
          <VoteButtons 
            offerId={offer.id} 
            initialUpvotes={offer.upvotes} 
            initialDownvotes={offer.downvotes} 
          />

          {/* Banner de Captação VIP (WhatsApp e Telegram) */}
          <VipAlertBanner storeName={offer.store?.name} />

          {/* Aviso Legal de Afiliado */}
          <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5 }}>
            ⚠️ Os preços e disponibilidade podem variar após a publicação. Verifica sempre o preço final na loja antes de comprar. Links com * podem gerar comissão para o RadarOfertas sem qualquer custo para ti.
          </p>
        </div>
      </div>

      {/* Secção Completa de Especificações, Detalhes e Garantias */}
      <OfferSpecsSection
        offer={offer}
        priceCurrent={priceCurrent}
        priceOriginal={priceOriginal}
        discountPct={discountPct}
      />

      {/* Ofertas Relacionadas Cross-Sell */}
      {relatedOffers.length > 0 && (
        <section style={{ marginTop: '3rem', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>⚡</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Mais Oportunidades em {offer.categories?.[0]?.name || 'Destaque'}
            </h2>
          </div>
          <div>
            {relatedOffers.map((rel) => (
              <OfferCard key={rel.id} offer={rel} />
            ))}
          </div>
        </section>
      )}

      <CommentsSection offerId={offer.id} />

      {/* Sticky Mobile CTA Bar */}
      <StickyMobileCta
        offerId={offer.id}
        title={offer.titlePt || offer.title}
        priceCurrent={priceCurrent}
        priceOriginal={priceOriginal}
        discountPct={discountPct}
        affiliateUrl={offer.affiliateUrl}
        storeName={offer.store?.name || 'Loja'}
        couponCode={offer.couponCode}
        imageUrl={offer.imageUrl}
        isAmazon={isAmazon}
      />

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
              { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radarofertas-psi.vercel.app' },
              ...(offer.categories?.[0] ? [{
                '@type': 'ListItem',
                position: 2,
                name: offer.categories[0].name,
                item: `https://radarofertas-psi.vercel.app/categoria/${offer.categories[0].slug}`,
              }] : []),
              { '@type': 'ListItem', position: 3, name: offer.title },
            ],
          }),
        }}
      />
    </div>
  )
}
