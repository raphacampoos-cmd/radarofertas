'use client'

import { useState } from 'react'
import type { Offer } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

interface StoreCouponCardProps {
  offer: Offer
  storeName: string
}

export function StoreCouponCard({ offer, storeName }: StoreCouponCardProps) {
  const [copied, setCopied] = useState(false)
  const code = offer.couponCode || ''
  const discountPct = parseFloat(offer.discountPct || '0')
  const priceCurrent = parseFloat(offer.priceCurrent || '0')
  const priceOriginal = parseFloat(offer.priceOriginal || '0')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const el = document.createElement('textarea')
      el.value = code
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  function handleGoToStore() {
    window.open(offer.affiliateUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1e2e 0%, #161622 100%)',
      border: '1px solid rgba(249, 115, 22, 0.4)',
      borderRadius: '0.75rem',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative',
      boxShadow: '0 4px 20px rgba(249, 115, 22, 0.08)',
    }}>
      {/* Topo do cupão: badge de desconto */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            background: '#22c55e',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
          }}>
            {discountPct > 0 ? `-${Math.round(discountPct)}% OFF` : 'CUPÃO VERIFICADO'}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            🏷️ Válido na {storeName}
          </span>
        </div>
        {priceCurrent > 0 && (
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f97316' }}>
            {formatPrice(priceCurrent)}
            {priceOriginal > priceCurrent && (
              <span style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'line-through', marginLeft: '0.4rem' }}>
                {formatPrice(priceOriginal)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Título ou descrição da oferta associada */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.4, margin: 0 }}>
          {offer.titlePt || offer.title}
        </h3>
      </div>

      {/* Caixa do Código + Botões */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
        alignItems: 'center',
        background: '#0d0d14',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: '1px dashed #f97316',
      }}>
        <div style={{
          flex: '1 1 140px',
          fontFamily: 'monospace',
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#f97316',
          letterSpacing: '0.08em',
          textAlign: 'center',
          userSelect: 'all',
        }}>
          {code}
        </div>

        <button
          onClick={handleCopy}
          style={{
            padding: '0.6rem 1.1rem',
            background: copied ? '#22c55e' : '#f97316',
            color: '#fff',
            border: 'none',
            borderRadius: '0.4rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
          title="Copiar código promocional"
        >
          {copied ? '✅ Código Copiado!' : '📋 Copiar Código'}
        </button>

        <button
          onClick={handleGoToStore}
          style={{
            padding: '0.6rem 1.1rem',
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#f1f5f9',
            border: '1px solid #2a2a3a',
            borderRadius: '0.4rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
          title={`Abrir site da ${storeName}`}
        >
          Ir à loja →
        </button>
      </div>
    </div>
  )
}
