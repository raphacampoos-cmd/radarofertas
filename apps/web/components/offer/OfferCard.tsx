'use client'

import Link from 'next/link'
import type { Offer } from '@/lib/types'
import { VoteButtons } from './VoteButtons'
import { TimeAgo } from '../ui/TimeAgo'
import { formatPrice, truncate } from '@/lib/utils'

interface OfferCardProps {
  offer: Offer
}

export function OfferCard({ offer }: OfferCardProps) {
  const priceCurrent = parseFloat(offer.priceCurrent || '0')
  const priceOriginal = parseFloat(offer.priceOriginal || '0')
  const discountPct = parseFloat(offer.discountPct || '0')
  const dealScore = parseFloat(offer.dealScore || '0')

  return (
    <article className="offer-card" style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      display: 'flex',
      transition: 'box-shadow 0.2s, border-color 0.2s',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 25px rgba(249, 115, 22, 0.12)'
      e.currentTarget.style.borderColor = 'var(--primary)'
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.borderColor = 'var(--border)'
    }}
    >
      {/* Imagem */}
      <Link
        href={`/oferta/${offer.slug}`}
        style={{
          display: 'block', flexShrink: 0, position: 'relative',
          width: '160px', background: 'var(--muted)',
        }}
      >
        {offer.isMinHistoric && (
          <span style={{
            position: 'absolute', top: '0.4rem', left: '0.4rem', zIndex: 2,
            background: '#ef4444', color: '#fff', fontSize: '0.6rem',
            fontWeight: 800, padding: '0.2rem 0.4rem', borderRadius: '0.3rem',
            lineHeight: 1.2, textAlign: 'center',
          }}>
            🔥 MÍNIMO<br />HISTÓRICO
          </span>
        )}

        {discountPct > 0 && (
          <span style={{
            position: 'absolute', top: '0.4rem', right: '0.4rem', zIndex: 2,
            background: '#f97316', color: '#fff', fontSize: '0.75rem',
            fontWeight: 800, padding: '0.25rem 0.45rem', borderRadius: '0.35rem',
          }}>
            -{Math.round(discountPct)}%
          </span>
        )}

        {offer.imageUrl ? (
          <img
            src={offer.imageUrl}
            alt={`Oferta: ${offer.title}`}
            style={{ width: '160px', height: '160px', objectFit: 'contain', padding: '0.75rem' }}
            loading="lazy"
          />
        ) : (
          <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
            📦
          </div>
        )}

        {/* Etiqueta de preço sobreposta */}
        <span style={{
          position: 'absolute', bottom: '0.4rem', right: '0.4rem',
          background: '#facc15', color: '#1a1a1a', fontWeight: 800,
          fontSize: '0.9rem', padding: '0.2rem 0.5rem', borderRadius: '0.3rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}>
          {formatPrice(priceCurrent)}
        </span>
      </Link>

      {/* Conteúdo */}
      <div style={{ flex: 1, minWidth: 0, padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {/* Topo: votos + score + data */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--muted-foreground)' }}>
          <VoteButtons
            offerId={offer.id}
            initialUpvotes={offer.upvotes}
            initialDownvotes={offer.downvotes}
            compact
          />
          {dealScore > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#f97316', fontWeight: 700 }}>
              🎯 {Math.round(dealScore)}
            </span>
          )}
          <span style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            <TimeAgo date={offer.updatedAt || offer.publishedAt} />
          </span>
        </div>

        {/* Título */}
        <Link href={`/oferta/${offer.slug}`} style={{
          textDecoration: 'none', color: 'var(--foreground)', fontSize: '1rem',
          fontWeight: 700, lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {offer.title}
        </Link>

        {/* Preços */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f97316' }}>
            {formatPrice(priceCurrent)}
          </span>
          {priceOriginal > priceCurrent && (
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>
              {formatPrice(priceOriginal)}
            </span>
          )}
          {offer.couponCode && (
            <span style={{
              background: 'rgba(34, 197, 94, 0.1)', border: '1px dashed #22c55e',
              borderRadius: '0.375rem', padding: '0.1rem 0.4rem',
              fontSize: '0.72rem', fontWeight: 700, color: '#22c55e',
            }}>
              🏷️ {offer.couponCode}
            </span>
          )}
        </div>

        {/* Loja */}
        <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
          Disponível na <strong style={{ color: 'var(--foreground)' }}>{offer.store.name}</strong>
        </div>

        {/* Descrição */}
        {offer.description && (
          <p style={{
            fontSize: '0.82rem', color: 'var(--muted-foreground)', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {truncate(offer.description, 140)}
          </p>
        )}

        {/* Rodapé: comentários + partilha + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: 'auto', paddingTop: '0.3rem' }}>
          <Link
            href={`/oferta/${offer.slug}#comentarios`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.8rem' }}
            title="Comentários"
          >
            💬 {offer.commentCount ?? 0}
          </Link>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 ${offer.title} por ${formatPrice(priceCurrent)}!\n\nhttps://radarofertas-psi.vercel.app/oferta/${offer.slug}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.95rem' }}
            aria-label="Partilhar" title="Partilhar"
          >
            📤
          </a>

          <a
            href={offer.affiliateUrl}
            target="_blank" rel="nofollow noopener sponsored"
            onClick={() => {
              fetch('/api/track', { method: 'POST', body: JSON.stringify({ offerId: offer.id }) }).catch(() => {})
            }}
            style={{
              marginLeft: 'auto', background: '#f97316', color: '#fff',
              padding: '0.5rem 1rem', borderRadius: '9999px',
              textDecoration: 'none', fontWeight: 700, fontSize: '0.8rem',
              transition: 'opacity 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Abrir desconto →
          </a>
        </div>
      </div>
    </article>
  )
}
