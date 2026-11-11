import type { Metadata } from 'next'
import Link from 'next/link'
import type { Offer } from '@/lib/types'
import { getOffers } from '@/lib/api'
import { OfferGrid } from '@/components/offer/OfferGrid'
import { Sidebar } from '@/components/layout/Sidebar'
import { ActivityTicker } from '@/components/ui/ActivityTicker'

export const metadata: Metadata = {
  title: 'RadarOfertas — O Algoritmo Caçador de Descontos em Portugal',
  description: 'Encontra as melhores ofertas em Portugal com histórico de preços real, Deal Score algorítmico e cupões verificados. Amazon, Worten, Fnac, EarFun.',
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
    const res = await getOffers({ limit: 100, sort: 'published_at', store, qualified: true })
    offers = res.data
    total = res.pagination?.total ?? res.data.length
  } catch {
    error = true
  }

  const storeName = store ? (offers[0]?.store.name ?? store) : null
  const isBlackFridaySeason = new Date() >= new Date('2026-11-01T00:00:00Z')

  return (
    <div className="container" style={{ paddingTop: '1.75rem', paddingBottom: '3rem' }}>

      {/* Hero Command Center 2027 */}
      <section style={{
        position: 'relative',
        borderRadius: '1.25rem',
        padding: '2rem 1.75rem',
        marginBottom: '1.75rem',
        background: 'linear-gradient(135deg, rgba(24, 26, 45, 0.7) 0%, rgba(12, 13, 23, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}>
        {/* Luz difusa de fundo */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          borderRadius: '9999px',
        }} />

        {/* Pílula de telemetria HUD */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '1rem',
          fontSize: '0.75rem',
          color: '#e2e8f0',
        }}>
          <span className="radar-beacon-dot" />
          <span style={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace' }}>SCANNER ONLINE</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: '#94a3b8' }}>{total > 0 ? `${total} ofertas ativas verificadas` : '1.626 ofertas ativas'}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>Algoritmo anti-inflação</span>
        </div>

        {/* Título Principal com Gradiente Luminoso */}
        <h1 className="gradient-text-orange" style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
          fontWeight: 900,
          marginBottom: '0.65rem',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        }}>
          O Algoritmo Caçador de Descontos em Portugal
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '1rem',
          maxWidth: '44rem',
          lineHeight: 1.55,
          marginBottom: '1.25rem',
        }}>
          O nosso radar monitoriza continuamente lojas de referência como <strong style={{ color: '#f1f5f9' }}>Amazon</strong>, <strong style={{ color: '#f1f5f9' }}>Worten</strong>, <strong style={{ color: '#f1f5f9' }}>EarFun</strong>, <strong style={{ color: '#f1f5f9' }}>PC Componentes</strong> e <strong style={{ color: '#f1f5f9' }}>Alibaba EU</strong>, filtrando promoções enganosas para entregar apenas mínimos históricos reais e cupões válidos.
        </p>

        {/* Cyber Filter Chips (Acesso Rápido) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link
            href="/black-friday"
            className="glass-pill"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.4)',
              background: 'rgba(239, 68, 68, 0.12)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>🔥 Black Friday 2026</span>
          </Link>

          <Link
            href="/categoria/casa"
            className="glass-pill"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#fde047',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>🍳 Cozinha & Casa (Novidades)</span>
          </Link>

          <Link
            href="/loja/earfun"
            className="glass-pill"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>🎧 EarFun ANC & Áudio</span>
          </Link>

          <Link
            href="/categoria/informatica"
            className="glass-pill"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#c084fc',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>⚡ Tecnologia & Gaming</span>
          </Link>

          <Link
            href="/categoria/beleza-e-saude"
            className="glass-pill"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#4ade80',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <span>🌿 Saúde & Bem-Estar</span>
          </Link>
        </div>
      </section>

      {/* Banner Holográfico Telegram VIP */}
      <Link
        href="https://t.me/radarofertaspt"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: 'linear-gradient(90deg, rgba(14, 165, 233, 0.14) 0%, rgba(249, 115, 22, 0.12) 100%)',
          border: '1px solid rgba(14, 165, 233, 0.35)',
          borderRadius: 'var(--radius)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          textDecoration: 'none',
          color: 'var(--foreground)',
          boxShadow: '0 4px 20px -2px rgba(14, 165, 233, 0.15)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.2rem',
            height: '2.2rem',
            borderRadius: '0.5rem',
            background: 'rgba(14, 165, 233, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}>
            ⚡
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            <strong style={{ color: '#38bdf8' }}>Alertas VIP em Direto:</strong> Recebe notificações de descidas bruscas de preço e cupões relâmpago antes de esgotarem!
          </div>
        </div>
        <span style={{
          fontWeight: 700,
          color: '#ffffff',
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
        }}>
          Juntar-me Grátis ➔
        </span>
      </Link>

      <ActivityTicker />

      {/* Grid Principal Feed + Sidebar */}
      <div className="home-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          {/* Cabeçalho da Secção */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔥</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                {storeName ? `Ofertas em ${storeName}` : 'Feed de Oportunidades'}
              </h2>
            </div>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontFamily: 'monospace' }}>
              {storeName && (
                <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'none', marginRight: '0.75rem', fontWeight: 600 }}>
                  ✕ Limpar filtro
                </Link>
              )}
              {total} OFERTAS ATIVAS
            </span>
          </div>

          {/* Lista de ofertas */}
          {error ? (
            <div className="glass-card" style={{
              borderRadius: 'var(--radius)',
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
              <p>A sincronizar ofertas. Por favor recarrega dentro de momentos.</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="glass-card" style={{
              borderRadius: 'var(--radius)',
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--muted-foreground)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p>Nenhuma oferta encontrada para os critérios selecionados.</p>
            </div>
          ) : (
            <OfferGrid initialOffers={offers} totalCount={total} />
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
