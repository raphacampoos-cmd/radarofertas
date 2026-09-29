import type { Metadata } from 'next'
import Link from 'next/link'
import { EntrarClient } from './EntrarClient'

export const metadata: Metadata = {
  title: 'Comunidade VIP RadarOfertas 🇵🇹 | Alertas de Erros de Preço e Cupons',
  description: 'Junta-te aos nossos canais gratuitos no WhatsApp e Telegram. Recebe bugs de preço e promoções da Amazon, Worten, Fnac e PCDiga antes que esgotem.',
  openGraph: {
    title: 'Comunidade VIP RadarOfertas 🇵🇹 — Erros de Preço e Cupons',
    description: 'Recebe alertas instantâneos de descontos e erros de sistema das principais lojas de Portugal.',
    url: 'https://radarofertas-psi.vercel.app/entrar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comunidade VIP RadarOfertas 🇵🇹',
    description: 'Alertas imediatos de quedas de preço e cupões de desconto em Portugal.',
  },
  alternates: {
    canonical: 'https://radarofertas-psi.vercel.app/entrar',
  },
}

export default function EntrarPage() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        background: 'linear-gradient(180deg, #161622 0%, #0f0f18 100%)',
        border: '1px solid #2a2a3a',
        borderRadius: '1.25rem',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        textAlign: 'center',
      }}>
        {/* Logo / Ícone */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(34, 197, 94, 0.2) 100%)',
          border: '1px solid rgba(249, 115, 22, 0.4)',
          fontSize: '2rem',
          marginBottom: '1rem',
        }}>
          🎯
        </div>

        {/* Título Principal */}
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 900,
          color: '#fff',
          letterSpacing: '-0.02em',
          marginBottom: '0.5rem',
        }}>
          Alertas VIP <span style={{ color: '#f97316' }}>RadarOfertas 🇵🇹</span>
        </h1>

        <p style={{
          fontSize: '0.95rem',
          color: '#94a3b8',
          lineHeight: 1.5,
          marginBottom: '1.75rem',
        }}>
          Rastreamos as maiores lojas de Portugal 24h por dia. Quando surge uma descida brusca de preço ou cupão secreto, avisamos logo no teu telemóvel!
        </p>

        {/* Componente Interativo Client-Side com Rotacionador */}
        <EntrarClient />

        {/* Vantagens / Garantias */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #2a2a3a',
        }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>⚡</div>
            <strong>Em Direto</strong>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Sem atrasos</p>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>🛡️</div>
            <strong>Zero Spam</strong>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Apenas promoções</p>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>🎁</div>
            <strong>100% Grátis</strong>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Sempre livre</p>
          </div>
        </div>

        {/* Voltar ao site */}
        <div style={{ marginTop: '1.5rem' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.85rem',
              color: '#64748b',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            ← Voltar para o feed de ofertas
          </Link>
        </div>
      </div>
    </div>
  )
}
