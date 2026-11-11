'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'

interface StickyMobileCtaProps {
  offerId: number
  title: string
  priceCurrent: number
  priceOriginal: number
  discountPct: number
  affiliateUrl: string
  storeName: string
  couponCode?: string | null
  imageUrl?: string | null
  isAmazon?: boolean
}

export function StickyMobileCta({
  offerId,
  title,
  priceCurrent,
  priceOriginal,
  discountPct,
  affiliateUrl,
  storeName,
  couponCode,
  imageUrl,
  isAmazon = false,
}: StickyMobileCtaProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    if (!couponCode) return
    try {
      await navigator.clipboard.writeText(couponCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  function handleTrack() {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'click_affiliate', {
        event_category: 'affiliate_mobile_sticky',
        event_label: storeName,
        value: offerId,
      })
    }
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify({ offerId }),
    }).catch(() => {})
  }

  return (
    <div
      className="md:hidden glass-hud"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        padding: '0.65rem 1rem',
        paddingBottom: 'calc(0.65rem + env(safe-area-inset-bottom, 0px))',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        {/* Preço e Poupança */}
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f97316', lineHeight: 1.1 }}>
              {isAmazon ? 'Amazon.es' : formatPrice(priceCurrent)}
            </span>
            {!isAmazon && discountPct > 0 && (
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#fff',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                padding: '0.1rem 0.35rem',
                borderRadius: '0.25rem',
                fontFamily: 'monospace',
              }}>
                -{Math.round(discountPct)}%
              </span>
            )}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {storeName}
          </span>
        </div>

        {/* Ações: Cupão (se houver) + Botão de Compra */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
          {couponCode && (
            <button
              onClick={handleCopy}
              style={{
                background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: copied ? '1px solid #10b981' : '1px dashed rgba(255, 255, 255, 0.25)',
                borderRadius: '0.5rem',
                padding: '0.45rem 0.6rem',
                color: copied ? '#34d399' : '#f8fafc',
                fontSize: '0.72rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              title="Copiar cupão de desconto"
            >
              {copied ? '✓ COPIADO' : `🏷️ ${couponCode}`}
            </button>
          )}

          <a
            href={affiliateUrl}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="cyber-cta"
            onClick={handleTrack}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '9999px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span>{isAmazon ? 'Ver na Amazon' : 'Ir para a Loja'}</span>
            <span style={{ fontSize: '0.9rem' }}>↗</span>
          </a>
        </div>
      </div>
    </div>
  )
}
