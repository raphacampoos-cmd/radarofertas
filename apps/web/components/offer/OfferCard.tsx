'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Offer } from '@/lib/types'
import { DealScoreBadge } from './DealScoreBadge'
import { VoteButtons } from './VoteButtons'
import { formatTimeAgo, formatPrice } from '@/lib/utils'

interface OfferCardProps {
  offer: Offer
}

export function OfferCard({ offer }: OfferCardProps) {
  const priceCurrent = parseFloat(offer.priceCurrent || '0')
  const priceOriginal = parseFloat(offer.priceOriginal || '0')
  const discountPct = parseFloat(offer.discountPct || '0')
  const dealScore = parseFloat(offer.dealScore || '0')
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <article style={{
      background: '#161622',
      border: '1px solid #2a2a3a',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
      position: 'relative',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 25px rgba(249, 115, 22, 0.15)'
      e.currentTarget.style.transform = 'translateY(-2px)'
      e.currentTarget.style.borderColor = '#f97316'
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.borderColor = '#2a2a3a'
    }}
    >
      {/* Badges superiores */}
      <div style={{
        position: 'absolute', top: '0.5rem', left: '0.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 10,
      }}>
        {offer.isMinHistoric && (
          <span style={{
            background: '#ef4444', color: '#fff', fontSize: '0.7rem',
            fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '9999px',
          }}>🔥 MÍNIMO HISTÓRICO</span>
        )}
        {discountPct > 0 && (
          <span style={{
            background: '#f97316', color: '#fff', fontSize: '0.75rem',
            fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '9999px',
          }}>-{Math.round(discountPct)}%</span>
        )}
      </div>

      {/* Deal Score */}
      {dealScore > 0 && (
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10 }}>
          <DealScoreBadge score={dealScore} compact />
        </div>
      )}

      {/* Imagem */}
      <Link href={`/oferta/${offer.slug}`} style={{ display: 'block', background: '#1a1a2a', position: 'relative', width: '100%', paddingTop: '75%' }}>
        {offer.imageUrl ? (
          <img
            src={offer.imageUrl}
            alt={`Oferta: ${offer.title}`}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'contain', padding: '0.75rem',
            }}
            loading="lazy"
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem', color: '#cbd5e1'
          }}>
            📦
          </div>
        )}
      </Link>

      {/* Conteúdo */}
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {/* Loja + verificado */}
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ color: '#f97316' }}>{offer.store.name}</span>
          <span>·</span>
          <span style={{ color: '#22c55e' }}>atualizado em {new Date(offer.updatedAt || offer.publishedAt).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })}, {new Date(offer.updatedAt || offer.publishedAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Título */}
        <Link href={`/oferta/${offer.slug}`} style={{
          textDecoration: 'none', color: '#f1f5f9', fontSize: '0.875rem',
          fontWeight: 600, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {offer.title}
        </Link>

        {/* Preços */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f97316' }}>
            {formatPrice(priceCurrent)}
          </span>
          {priceOriginal > priceCurrent && (
            <span style={{ fontSize: '0.85rem', color: '#64748b', textDecoration: 'line-through' }}>
              {formatPrice(priceOriginal)}
            </span>
          )}
        </div>

        {/* Economiza badge */}
        {priceOriginal > priceCurrent && (
          <div style={{
            background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)',
            borderRadius: '0.375rem', padding: '0.2rem 0.5rem',
            fontSize: '0.72rem', fontWeight: 700, color: '#f97316', display: 'inline-block', alignSelf: 'flex-start',
          }}>
            Economize {formatPrice(priceOriginal - priceCurrent)}
          </div>
        )}

        {/* Cupão */}
        {offer.couponCode && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)', border: '1px dashed #22c55e',
            borderRadius: '0.375rem', padding: '0.25rem 0.5rem',
            fontSize: '0.75rem', fontWeight: 700, color: '#22c55e',
          }}>
            🏷️ Cupão: {offer.couponCode}
          </div>
        )}

        {/* Botões: WA + TG + Comprar */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 32px 1fr', gap: '0.35rem', marginTop: 'auto' }}>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 ${offer.title} por ${formatPrice(priceCurrent)}!\n\nhttps://radarofertas-psi.vercel.app/oferta/${offer.slug}`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#25D366', borderRadius: '0.5rem',
              color: '#fff', fontSize: '0.9rem', textDecoration: 'none', padding: '0.4rem',
            }}
            aria-label="Partilhar no WhatsApp" title="Partilhar no WhatsApp"
          >💬</a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(`https://radarofertas-psi.vercel.app/oferta/${offer.slug}`)}&text=${encodeURIComponent(`🔥 ${offer.title} por ${formatPrice(priceCurrent)}!`)}`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#0088cc', borderRadius: '0.5rem',
              color: '#fff', fontSize: '0.9rem', textDecoration: 'none', padding: '0.4rem',
            }}
            aria-label="Partilhar no Telegram" title="Partilhar no Telegram"
          >✈️</a>

          <a
            href={offer.affiliateUrl}
            target="_blank" rel="nofollow noopener sponsored"
            onClick={() => {
              fetch('/api/track', { method: 'POST', body: JSON.stringify({ offerId: offer.id }) }).catch(() => {})
            }}
            style={{
              display: 'block', background: '#f97316', color: '#fff',
              textAlign: 'center', padding: '0.6rem', borderRadius: '0.5rem',
              textDecoration: 'none', fontWeight: 700, fontSize: '0.875rem',
              transition: 'opacity 0.15s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.88')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Ver Oferta →
          </a>
        </div>
        
        <VoteButtons 
          offerId={offer.id} 
          initialUpvotes={offer.upvotes} 
          initialDownvotes={offer.downvotes} 
        />
      </div>
    </article>
  )
}
