import type { Metadata } from 'next'
import Link from 'next/link'
import { getStores } from '@/lib/api'
import type { Store } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Todas as Lojas e Marcas com Descontos em Portugal | RadarOfertas',
  description: 'Explora todas as lojas parceiras com cupões de desconto e ofertas qualificadas em Portugal: Amazon, Worten, Prozis, Zumub, ESR, Padel Market e muito mais.',
  openGraph: {
    title: 'Todas as Lojas e Marcas com Descontos em Portugal | RadarOfertas',
    description: 'Encontra códigos promocionais e promoções verificadas em dezenas de lojas online em Portugal.',
    url: 'https://radarofertas-psi.vercel.app/lojas',
    type: 'website',
  },
  alternates: {
    canonical: 'https://radarofertas-psi.vercel.app/lojas',
  },
}

export const revalidate = 600 // 10 minutos

export default async function StoresPage() {
  let storesList: Store[] = []
  try {
    const res = await getStores()
    storesList = res.data || []
  } catch {}

  // Ordenar alfabeticamente por nome
  storesList.sort((a, b) => a.name.localeCompare(b.name, 'pt-PT'))

  const totalOffers = storesList.reduce((acc, s) => acc + (s.activeOffersCount || 0), 0)

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <span style={{ color: '#f1f5f9', fontWeight: 600 }}>Lojas</span>
      </nav>

      {/* Header HUD 2027 */}
      <div className="glass-card" style={{
        borderRadius: 'var(--radius)',
        padding: '2.25rem 2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(24, 26, 45, 0.75) 0%, rgba(12, 13, 23, 0.85) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.72rem',
            fontFamily: 'monospace',
            color: '#10b981',
          }}>
            <span className="radar-beacon-dot" />
            <span>DIRETÓRIO OFICIAL • {storesList.length} LOJAS MONITORIZADAS</span>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            {totalOffers} ofertas ativas
          </span>
        </div>

        <h1 className="gradient-text-orange" style={{
          fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)',
          fontWeight: 900,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '0.65rem',
        }}>
          Lojas com Códigos Promocionais e Descontos
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '750px', lineHeight: 1.55, margin: 0 }}>
          Descobre os melhores descontos, pechinchas e cupões em Portugal organizados pelas tuas lojas favoritas. Clica numa loja para aceder à lista completa de ofertas qualificadas e códigos promocionais ativos.
        </p>
      </div>

      {/* Grid de Lojas por Ordem Alfabética */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.25rem',
      }}>
        {storesList.map((store) => {
          const activeCount = store.activeOffersCount ?? 0
          const couponsCount = store.couponsCount ?? 0

          return (
            <Link
              key={store.id}
              href={`/loja/${store.slug}`}
              style={{
                textDecoration: 'none',
                borderRadius: 'var(--radius)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
              className="store-card glass-card"
            >
              {/* Logo da Loja */}
              <div style={{
                width: '64px',
                height: '64px',
                background: '#ffffff',
                borderRadius: '0.5rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}>
                {store.logoUrl ? (
                  <img
                    src={store.logoUrl}
                    alt={`Logótipo ${store.name}`}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <span style={{ fontSize: '1.75rem' }}>🏬</span>
                )}
              </div>

              {/* Informações da Loja */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#f1f5f9',
                  marginBottom: '0.35rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {store.slug === 'amazon' ? 'Amazon.es' : store.name}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    color: activeCount > 0 ? '#f97316' : '#64748b',
                    fontWeight: 600,
                  }}>
                    {activeCount > 0 ? `🔥 ${activeCount} ${activeCount === 1 ? 'oferta ativa' : 'ofertas ativas'}` : '0 ofertas no momento'}
                  </span>

                  {couponsCount > 0 && (
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#22c55e',
                      fontWeight: 700,
                    }}>
                      🏷️ {couponsCount} {couponsCount === 1 ? 'cupão ativo' : 'cupões ativos'}
                    </span>
                  )}
                </div>
              </div>

              {/* Seta */}
              <div style={{ color: '#64748b', fontSize: '1.1rem', paddingLeft: '0.25rem' }}>
                →
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
