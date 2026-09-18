'use client'

import { useState } from 'react'
import type { Offer } from '@/lib/types'
import { OfferCard } from './OfferCard'

interface OfferGridProps {
  initialOffers: Offer[]
}

type SortOption = 'recent' | 'discount' | 'score' | 'price-low' | 'price-high'

export function OfferGrid({ initialOffers }: OfferGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [visibleCount, setVisibleCount] = useState(20)

  const sorted = [...initialOffers].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return parseFloat(b.discountPct || '0') - parseFloat(a.discountPct || '0')
      case 'score':
        return parseFloat(b.dealScore || '0') - parseFloat(a.dealScore || '0')
      case 'price-low':
        return parseFloat(a.priceCurrent || '0') - parseFloat(b.priceCurrent || '0')
      case 'price-high':
        return parseFloat(b.priceCurrent || '0') - parseFloat(a.priceCurrent || '0')
      case 'recent':
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  const visible = sorted.slice(0, visibleCount)
  const hasMore = visibleCount < sorted.length

  const sortOptions: { key: SortOption; label: string; icon: string }[] = [
    { key: 'recent', label: 'Recentes', icon: '🕐' },
    { key: 'discount', label: 'Maior Desconto', icon: '🔥' },
    { key: 'score', label: 'Melhor Score', icon: '🎯' },
    { key: 'price-low', label: 'Mais Baratos', icon: '💰' },
    { key: 'price-high', label: 'Mais Caros', icon: '💎' },
  ]

  return (
    <>
      {/* Sort controls */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        marginBottom: '1rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
        whiteSpace: 'nowrap',
      }}>
        {sortOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => { setSortBy(opt.key); setVisibleCount(20) }}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '9999px',
              border: sortBy === opt.key ? '1px solid #f97316' : '1px solid #2a2a3a',
              background: sortBy === opt.key ? 'rgba(249, 115, 22, 0.15)' : '#1a1a2a',
              color: sortBy === opt.key ? '#f97316' : '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: sortBy === opt.key ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {opt.icon} {opt.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        {visible.map(offer => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => setVisibleCount(prev => prev + 20)}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '9999px',
              border: '1px solid #f97316',
              background: 'rgba(249, 115, 22, 0.1)',
              color: '#f97316',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#f97316'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)'
              e.currentTarget.style.color = '#f97316'
            }}
          >
            Carregar Mais ({sorted.length - visibleCount} restantes)
          </button>
        </div>
      )}

      {/* Total count */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
        A mostrar {visible.length} de {sorted.length} ofertas
      </div>
    </>
  )
}
