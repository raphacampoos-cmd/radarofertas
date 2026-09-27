import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getStore } from '@/lib/api'
import { OfferCard } from '@/components/offer/OfferCard'
import { StoreCouponCard } from '@/components/store/StoreCouponCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

function getFormattedMonthYear(): string {
  const now = new Date()
  const raw = now.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
  // "setembro de 2026" -> "Setembro 2026"
  const parts = raw.split(' de ')
  if (parts.length === 2) {
    const month = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    return `${month} ${parts[1]}`
  }
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const monthYear = getFormattedMonthYear()

  try {
    const res = await getStore(slug)
    const rawData = res.data
    const store = (rawData as any)?.store || rawData
    if (!store || !store.name) {
      return { title: 'Loja não encontrada | RadarOfertas' }
    }
    const coupons = (rawData as any)?.coupons || []
    const offers = (rawData as any)?.offers || []
    const isEmpty = coupons.length === 0 && offers.length === 0

    const displayName = store.slug === 'amazon' ? 'Amazon.es' : store.name
    const title = `Códigos Promocionais e Descontos ${displayName} – ${monthYear}`
    const description = store.slug === 'amazon'
      ? `Descobre códigos promocionais, cupões e as melhores promoções da Amazon.es com entrega em Portugal em ${monthYear}. Poupa nas tuas compras online com o RadarOfertas.`
      : store.seoDescription || `Encontra os melhores cupões de desconto e promoções verificadas da ${store.name} para Portugal em ${monthYear}. Poupa nas tuas compras online com o RadarOfertas.`

    return {
      title,
      description,
      robots: isEmpty ? { index: false, follow: true } : { index: true, follow: true },
      openGraph: {
        title,
        description,
        url: `https://radarofertas-psi.vercel.app/loja/${slug}`,
        type: 'website',
        siteName: 'RadarOfertas',
        locale: 'pt_PT',
        images: store.logoUrl ? [{ url: store.logoUrl }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `https://radarofertas-psi.vercel.app/loja/${slug}`,
      },
    }
  } catch {
    return { title: 'Loja não encontrada | RadarOfertas' }
  }
}

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params
  const monthYear = getFormattedMonthYear()

  let storeData: any = null
  try {
    const res = await getStore(slug)
    storeData = res.data
  } catch {
    notFound()
  }

  const store = storeData?.store || storeData
  if (!store || !store.name) {
    notFound()
  }

  const coupons: any[] = storeData?.coupons || []
  const offers: any[] = storeData?.offers || []
  const faqs: Array<{ question: string; answer: string }> = store.seoFaqs || []
  const isEmpty = coupons.length === 0 && offers.length === 0
  const displayName = store.slug === 'amazon' ? 'Amazon.es' : store.name

  // Schema.org FAQPage em JSON-LD
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
      {/* JSON-LD Structured Data */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link href="/lojas" style={{ color: 'inherit', textDecoration: 'none' }}>Lojas</Link>
        <span>›</span>
        <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{displayName}</span>
      </nav>

      {/* Hero Header da Loja */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2a 0%, #161622 100%)',
        border: '1px solid #2a2a3a',
        borderRadius: 'var(--radius)',
        padding: '2rem',
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        {store.logoUrl ? (
          <div style={{
            width: '100px',
            height: '100px',
            background: '#ffffff',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            <img
              src={store.logoUrl}
              alt={`Logótipo da loja ${displayName}`}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div style={{
            width: '100px',
            height: '100px',
            background: '#1a1a2a',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            border: '1px solid #2a2a3a',
            flexShrink: 0,
          }}>
            🏬
          </div>
        )}

        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            {store.affiliateNetwork && store.active && !isEmpty && (
              <span style={{
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                color: '#f97316',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
              }}>
                ⭐ Loja Parceira
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {offers.length} {offers.length === 1 ? 'oferta qualificada' : 'ofertas qualificadas'}
            </span>
            {coupons.length > 0 && (
              <span style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#22c55e',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
              }}>
                🏷️ {coupons.length} {coupons.length === 1 ? 'cupão ativo' : 'cupões ativos'}
              </span>
            )}
          </div>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 900,
            color: '#f1f5f9',
            lineHeight: 1.3,
            marginBottom: '0.5rem',
          }}>
            Códigos Promocionais e Descontos {displayName} – {monthYear}
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0, maxWidth: '750px', lineHeight: 1.5 }}>
            {store.slug === 'amazon'
              ? 'Todos os cupões de desconto e melhores promoções da Amazon.es com entrega em Portugal verificados pelo RadarOfertas.'
              : `Todos os cupões de desconto e melhores pechinchas da ${store.name} verificados automaticamente pelo RadarOfertas para Portugal.`}
          </p>
        </div>
      </div>

      {/* ── LOJA VAZIA: MENSAGEM HONESTA ────────────────────── */}
      {isEmpty && (
        <div style={{
          background: '#161622',
          border: '1px dashed #2a2a3a',
          borderRadius: 'var(--radius)',
          padding: '3rem 2rem',
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>⏳</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem' }}>
            De momento não temos códigos ativos para {displayName}.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            O RadarOfertas rastreia a loja diariamente à procura de descontos reais e cupões verificados. Segue o nosso Telegram para seres avisado assim que surgir uma nova oportunidade!
          </p>
          <a
            href="https://t.me/radarofertaspt"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#0088cc',
              color: '#fff',
              padding: '0.65rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
          >
            <span>✈️</span>
            <span>Seguir no Telegram para ser avisado</span>
          </a>
        </div>
      )}

      {/* ── 1. CUPÕES ATIVOS NO TOPO (se houver) ──────────────── */}
      {coupons.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏷️</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
              Cupões e Códigos de Desconto Ativos ({coupons.length})
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {coupons.map((coupon: any) => (
              <StoreCouponCard key={coupon.id} offer={coupon} storeName={displayName} />
            ))}
          </div>
        </section>
      )}

      {/* ── 2. OFERTAS QUALIFICADAS DA LOJA ─────────────────── */}
      {!isEmpty && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔥</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
                Melhores Promoções e Descontos {displayName} ({offers.length})
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Filtro ativo: Descontos ≥ 15% ou Mínimos Históricos
            </span>
          </div>

          {offers.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1rem',
            }}>
              {offers.map((offer: any) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <div style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              background: '#161622',
              border: '1px dashed #2a2a3a',
              borderRadius: 'var(--radius)',
            }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>🔍</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>
                Sem outras ofertas qualificadas de momento
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                Apenas são apresentadas ofertas com desconto comprovado igual ou superior a 15% ou no mínimo histórico.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ── 3. GUIA EDITÁVEL DE POUPANÇA (SEO TEXT) ───────────── */}
      {store.seoText && (
        <section style={{
          background: '#161622',
          border: '1px solid #2a2a3a',
          borderRadius: 'var(--radius)',
          padding: '2rem',
          marginBottom: '3rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.4rem' }}>💡</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f97316', margin: 0 }}>
              Guia de Poupança e Como Usar Cupões na {displayName}
            </h2>
          </div>

          <div style={{
            color: '#cbd5e1',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
          }}>
            {store.seoText}
          </div>
        </section>
      )}

      {/* ── 4. PERGUNTAS FREQUENTES (FAQ) COM SCHEMA.ORG ──────── */}
      {faqs.length > 0 && (
        <section style={{
          background: '#161622',
          border: '1px solid #2a2a3a',
          borderRadius: 'var(--radius)',
          padding: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>❓</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', margin: 0 }}>
              Perguntas Frequentes sobre Códigos e Promoções {displayName}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                open={idx === 0}
                style={{
                  background: '#1a1a2a',
                  border: '1px solid #2a2a3a',
                  borderRadius: '0.5rem',
                  padding: '1rem 1.25rem',
                }}
              >
                <summary style={{
                  fontWeight: 700,
                  color: '#f1f5f9',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}>
                  {faq.question}
                </summary>
                <div style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#94a3b8',
                  fontSize: '0.9rem',
                  lineHeight: 1.7,
                }}>
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
