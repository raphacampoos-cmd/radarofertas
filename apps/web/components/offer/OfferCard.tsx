'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Offer } from '@/lib/types'
import { DealScoreBadge } from './DealScoreBadge'
import { formatTimeAgo, formatPrice } from '@/lib/utils'

interface OfferCardProps {
  offer: Offer
}

export function OfferCard({ offer }: OfferCardProps) {
  const priceCurrent = parseFloat(offer.priceCurrent || '0')
  const priceOriginal = parseFloat(offer.priceOriginal || '0')
  const discountPct = parseFloat(offer.discountPct || '0')
  const dealScore = parseFloat(offer.dealScore || '0')

  return (
    <article style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s',
      position: 'relative',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      {/* Badges superiores */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        left: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        zIndex: 10,
      }}>
        {offer.isMinHistoric && (
          <span style={{
            background: '#dc2626',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: '9999px',
            letterSpacing: '0.03em',
          }}>
            🔥 MÍNIMO HISTÓRICO
          </span>
        )}
        {discountPct > 0 && (
          <span style={{
            background: '#16a34a',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.2rem 0.5rem',
            borderRadius: '9999px',
          }}>
            -{Math.round(discountPct)}%
          </span>
        )}
      </div>

      {/* Deal Score */}
      {dealScore > 0 && (
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10 }}>
          <DealScoreBadge score={dealScore} compact />
        </div>
      )}

      {/* Imagem */}
      <Link href={`/oferta/${offer.slug}`} style={{ display: 'block', background: '#f8fafc' }}>
        <div style={{ position: 'relative', width: '100%', paddingTop: '75%', background: '#f1f5f9' }}>
          {offer.imageUrl ? (
            <Image
              src={offer.imageUrl}
              alt={offer.title}
              fill
              style={{ objectFit: 'contain', padding: '0.75rem' }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', color: 'var(--muted-foreground)',
            }}>📦</div>
          )}
        </div>
      </Link>

      {/* Conteúdo */}
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {/* Loja */}
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
          {offer.store.name} · {formatTimeAgo(offer.publishedAt)}
        </div>

        {/* Título */}
        <Link href={`/oferta/${offer.slug}`} style={{
          textDecoration: 'none',
          color: 'var(--foreground)',
          fontSize: '0.875rem',
          fontWeight: 600,
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {offer.title}
        </Link>

        {/* Preços */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
            {formatPrice(priceCurrent)}
          </span>
          {priceOriginal > priceCurrent && (
            <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>
              {formatPrice(priceOriginal)}
            </span>
          )}
        </div>

        {/* Cupão */}
        {offer.couponCode && (
          <div style={{
            background: '#fef3c7',
            border: '1px dashed #d97706',
            borderRadius: '0.375rem',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#92400e',
          }}>
            🏷️ Cupão: {offer.couponCode}
          </div>
        )}

        {/* Botão */}
        <a
          href={offer.affiliateUrl}
          target="_blank"
          rel="nofollow noopener sponsored"
          onClick={async (e) => {
            // Track click
            fetch('/api/track', { method: 'POST', body: JSON.stringify({ offerId: offer.id }) }).catch(() => {})
          }}
          style={{
            display: 'block',
            background: 'var(--primary)',
            color: '#fff',
            textAlign: 'center',
            padding: '0.6rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            marginTop: 'auto',
            transition: 'opacity 0.15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Ver Oferta →
        </a>
      </div>
    </article>
  )
}
