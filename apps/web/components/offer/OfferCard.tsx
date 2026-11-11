'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Offer } from '@/lib/types'
import { VoteButtons } from './VoteButtons'
import { TimeAgo } from '../ui/TimeAgo'
import { formatPrice, truncate, optimizeImageUrl } from '@/lib/utils'
import { isAmazonOffer } from '@/lib/amazon-compliance'

interface OfferCardProps {
  offer: Offer
  /** Cards acima da dobra carregam a imagem de imediato; os restantes em lazy. */
  eager?: boolean
}

export function OfferCard({ offer, eager = false }: OfferCardProps) {
  const isAmazon = isAmazonOffer(offer)
  const priceCurrent = parseFloat(offer.priceCurrent || '0')
  const priceOriginal = parseFloat(offer.priceOriginal || '0')
  const discountPct = parseFloat(offer.discountPct || '0')
  const dealScore = parseFloat(offer.dealScore || '0')
  // Imagens de lojas podem desaparecer (404): mostrar o ícone de reserva em vez de um quadrado vazio
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="offer-card glass-card" style={{
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      display: 'flex',
      marginBottom: '0.85rem',
      position: 'relative',
    }}>
      {/* Imagem do Produto em Berço Suave */}
      <Link
        href={`/oferta/${offer.slug}`}
        style={{
          display: 'block',
          flexShrink: 0,
          position: 'relative',
          width: '160px',
          background: 'radial-gradient(circle at center, #ffffff 65%, #f1f5f9 100%)',
          borderRadius: 'var(--radius) 0 0 var(--radius)',
          overflow: 'hidden',
        }}
      >
        {!isAmazon && offer.isMinHistoric && (
          <span style={{
            position: 'absolute',
            top: '0.45rem',
            left: '0.45rem',
            zIndex: 2,
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            color: '#fff',
            fontSize: '0.62rem',
            fontWeight: 800,
            padding: '0.2rem 0.45rem',
            borderRadius: '0.35rem',
            lineHeight: 1.15,
            textAlign: 'center',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)',
            letterSpacing: '0.02em',
          }}>
            🔥 MÍNIMO<br />HISTÓRICO
          </span>
        )}

        {!isAmazon && discountPct > 0 && (
          <span style={{
            position: 'absolute',
            top: '0.45rem',
            right: '0.45rem',
            zIndex: 2,
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.22rem 0.45rem',
            borderRadius: '0.35rem',
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.35)',
            fontFamily: 'monospace',
          }}>
            -{Math.round(discountPct)}%
          </span>
        )}

        {offer.imageUrl && !imageFailed ? (
          <img
            src={optimizeImageUrl(offer.imageUrl, 400) ?? offer.imageUrl}
            alt={`Oferta: ${offer.title}`}
            width={160}
            height={160}
            style={{
              width: '160px',
              height: '160px',
              objectFit: 'contain',
              padding: '0.85rem',
              transition: 'transform 0.3s ease',
            }}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setImageFailed(true)}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : offer.store?.logoUrl ? (
          <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem' }}>
            <img
              src={offer.store.logoUrl}
              alt={offer.store.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <div style={{ width: '160px', height: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', background: '#0f172a', color: '#94a3b8', padding: '0.5rem' }}>
            <span style={{ fontSize: '2rem' }}>🛍️</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textAlign: 'center', color: '#cbd5e1' }}>{offer.store?.name || 'RadarOfertas'}</span>
          </div>
        )}

        {/* Etiqueta de preço sobreposta futurista */}
        {!isAmazon && (
          <span style={{
            position: 'absolute',
            bottom: '0.45rem',
            right: '0.45rem',
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#fbbf24',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            fontWeight: 800,
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '0.35rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          }}>
            {formatPrice(priceCurrent)}
          </span>
        )}
      </Link>

      {/* Conteúdo do Card */}
      <div style={{ flex: 1, minWidth: 0, padding: '0.85rem 1.15rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {/* Topo: votos + score + data */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.72rem', color: '#94a3b8' }}>
          <VoteButtons
            offerId={offer.id}
            initialUpvotes={offer.upvotes}
            initialDownvotes={offer.downvotes}
            compact
          />
          {!isAmazon && dealScore > 0 && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: '#fb923c',
              fontWeight: 800,
              fontFamily: 'monospace',
              background: 'rgba(249, 115, 22, 0.12)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              padding: '0.12rem 0.45rem',
              borderRadius: '9999px',
            }}>
              ⚡ SCORE {Math.round(dealScore)}
            </span>
          )}
          <span style={{ marginLeft: 'auto', whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.7rem' }}>
            <TimeAgo date={offer.updatedAt || offer.publishedAt} />
          </span>
        </div>

        {/* Título */}
        <Link href={`/oferta/${offer.slug}`} style={{
          textDecoration: 'none',
          color: '#f8fafc',
          fontSize: '1rem',
          fontWeight: 700,
          lineHeight: 1.35,
          letterSpacing: '-0.01em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          transition: 'color 0.15s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = '#fb923c')}
        onMouseOut={(e) => (e.currentTarget.style.color = '#f8fafc')}
        >
          {offer.titlePt || offer.title}
        </Link>

        {/* Preços */}
        {isAmazon ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f97316', fontSize: '0.85rem', fontWeight: 700 }}>
            <span>📦 Preço em tempo real na Amazon</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f97316', letterSpacing: '-0.02em' }}>
              {formatPrice(priceCurrent)}
            </span>
            {priceOriginal > priceCurrent && (
              <span style={{ fontSize: '0.82rem', color: '#64748b', textDecoration: 'line-through' }}>
                {formatPrice(priceOriginal)}
              </span>
            )}
            {offer.couponCode && (
              <span style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px dashed rgba(16, 185, 129, 0.4)',
                borderRadius: '0.375rem',
                padding: '0.12rem 0.45rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#34d399',
                fontFamily: 'monospace',
              }}>
                🏷️ {offer.couponCode}
              </span>
            )}
          </div>
        )}

        {/* Loja */}
        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          Loja oficial:{' '}
          <Link
            href={`/loja/${offer.store.slug}`}
            style={{
              color: '#38bdf8',
              fontWeight: 700,
              textDecoration: 'none',
              background: 'rgba(56, 189, 248, 0.08)',
              padding: '0.1rem 0.4rem',
              borderRadius: '0.3rem',
            }}
            title={`Ver cupões e promoções da loja ${offer.store.name}`}
          >
            {offer.store.name}
          </Link>
        </div>

        {/* Descrição */}
        {offer.description && (
          <p style={{
            fontSize: '0.82rem',
            color: '#94a3b8',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {truncate(offer.description, 140)}
          </p>
        )}

        {/* Rodapé: comentários + partilha + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: 'auto', paddingTop: '0.4rem' }}>
          {(offer.commentCount ?? 0) > 0 && (
            <Link
              href={`/oferta/${offer.slug}#comentarios`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.8rem',
              }}
              title="Comentários"
            >
              💬 {offer.commentCount}
            </Link>
          )}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              isAmazon
                ? `🔥 ${offer.title} na Amazon!\n\nhttps://radarofertas-psi.vercel.app/oferta/${offer.slug}`
                : `🔥 ${offer.title} por ${formatPrice(priceCurrent)}!\n\nhttps://radarofertas-psi.vercel.app/oferta/${offer.slug}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.95rem' }}
            aria-label="Partilhar"
            title="Partilhar no WhatsApp"
          >
            📤
          </a>

          <a
            href={offer.affiliateUrl || `/oferta/${offer.slug}`}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="cyber-cta"
            onClick={() => {
              fetch('/api/track', { method: 'POST', body: JSON.stringify({ offerId: offer.id }) }).catch(() => {})
            }}
            style={{
              marginLeft: 'auto',
              color: '#fff',
              padding: '0.48rem 1.1rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.8rem',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}
          >
            {isAmazon ? 'Ver na Amazon ↗' : 'Ver Desconto ↗'}
          </a>
        </div>
      </div>
    </article>
  )
}
