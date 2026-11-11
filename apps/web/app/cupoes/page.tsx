import type { Metadata } from 'next'
import Link from 'next/link'
import { CouponHub } from '@/components/coupon/CouponHub'
import { ALL_COUPONS } from '@/lib/coupons-data'

export const metadata: Metadata = {
  title: 'Cupões de Desconto e Códigos Promocionais 2026 | RadarOfertas',
  description: 'Lista completa de cupões de desconto e códigos promocionais verificados em Portugal: EarFun, Prozis, Zumub, Gshopper, Alibaba, OutIn, Worten, Fnac. Poupança direta no carrinho.',
  openGraph: {
    title: 'Cupões de Desconto e Códigos Promocionais 2026 | RadarOfertas',
    description: 'Poupa até 50% com cupões de desconto verificados em lojas de tecnologia, suplementos, casa e moda em Portugal.',
    url: 'https://radarofertas-psi.vercel.app/cupoes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cupões de Desconto e Códigos Promocionais 2026',
    description: 'Cupões oficiais verificados em Portugal.',
  },
  alternates: {
    canonical: 'https://radarofertas-psi.vercel.app/cupoes',
  },
}

export default function CupoesPage() {
  // Schema.org ItemList para cupões
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cupões de Desconto e Códigos Promocionais',
    description: 'Cupões verificados em lojas de comércio eletrónico em Portugal',
    itemListElement: ALL_COUPONS.map((cp, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: `${cp.discount} na ${cp.storeName} - Código: ${cp.code}`,
      description: cp.description,
      url: 'https://radarofertas-psi.vercel.app/cupoes',
    })),
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Hero Command Center de Cupões 2027 */}
      <section style={{
        position: 'relative',
        borderRadius: '1.25rem',
        padding: '2.25rem 2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(24, 26, 45, 0.75) 0%, rgba(12, 13, 23, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}>
        {/* Luz difusa de fundo */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-5%',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          borderRadius: '9999px',
        }} />

        {/* Pílula de telemetria */}
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
          <span style={{ fontWeight: 700, color: '#10b981', fontFamily: 'monospace' }}>CENTRAL DE CUPÕES</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: '#94a3b8' }}>1.593 ofertas com cupão verificado</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span style={{ color: '#fb923c', fontWeight: 600 }}>100% Testados & Ativos</span>
        </div>

        <h1 className="gradient-text-orange" style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 900,
          marginBottom: '0.65rem',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
        }}>
          Cupões de Desconto & Códigos Promocionais
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '1rem',
          maxWidth: '44rem',
          lineHeight: 1.55,
          marginBottom: '1.25rem',
        }}>
          Copia os códigos promocionais oficiais e garante o preço mais baixo diretamente no checkout. Testamos e validamos diariamente cupões para <strong style={{ color: '#f1f5f9' }}>EarFun</strong>, <strong style={{ color: '#f1f5f9' }}>Prozis</strong>, <strong style={{ color: '#f1f5f9' }}>Gshopper</strong>, <strong style={{ color: '#f1f5f9' }}>Alibaba EU</strong>, <strong style={{ color: '#f1f5f9' }}>Zumub</strong> e <strong style={{ color: '#f1f5f9' }}>OutIn</strong>.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link
            href="/black-friday"
            className="glass-pill"
            style={{
              padding: '0.35rem 0.8rem',
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
            <span>🔥 Ver Ofertas Black Friday</span>
          </Link>
          <a
            href="https://t.me/radarofertaspt"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-pill"
            style={{
              padding: '0.35rem 0.8rem',
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
            <span>⚡ Receber Cupões Relâmpago no Telegram ↗</span>
          </a>
        </div>
      </section>

      {/* Hub Interativo de Cupões */}
      <CouponHub />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://radarofertas-psi.vercel.app' },
              { '@type': 'ListItem', position: 2, name: 'Cupões de Desconto' },
            ],
          }),
        }}
      />
    </div>
  )
}
