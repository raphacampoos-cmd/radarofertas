'use client'

import { useState } from 'react'
import type { Offer } from '@/lib/types'
import { OfferCard } from './OfferCard'

interface OfferGridProps {
  initialOffers: Offer[]
}

type SortOption = 'recent' | 'discount' | 'score' | 'votes' | 'comments'

export function OfferGrid({ initialOffers }: OfferGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [visibleCount, setVisibleCount] = useState(20)

  const sorted = [...initialOffers].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return parseFloat(b.discountPct || '0') - parseFloat(a.discountPct || '0')
      case 'score':
        return parseFloat(b.dealScore || '0') - parseFloat(a.dealScore || '0')
      case 'votes':
        return (b.upvotes ?? 0) - (a.upvotes ?? 0)
      case 'comments':
        return (b.commentCount ?? 0) - (a.commentCount ?? 0)
      case 'recent':
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  const visible = sorted.slice(0, visibleCount)
  const hasMore = visibleCount < sorted.length

  const tabs: { key: SortOption; label: string; icon: string }[] = [
    { key: 'recent', label: 'Novos', icon: '⚡' },
    { key: 'discount', label: 'Destaques', icon: '🔥' },
    { key: 'votes', label: 'Mais Votados', icon: '👍' },
    { key: 'comments', label: 'Comentados', icon: '💬' },
    { key: 'score', label: 'Melhor Score', icon: '🎯' },
  ]

  return (
    <>
      {/* Tabs de ordenação */}
      <div style={{
        display: 'flex',
        gap: '0.25rem',
        marginBottom: '1rem',
        overflowX: 'auto',
        borderBottom: '1px solid var(--border)',
        whiteSpace: 'nowrap',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setSortBy(tab.key); setVisibleCount(20) }}
            style={{
              padding: '0.6rem 1rem',
              border: 'none',
              borderBottom: sortBy === tab.key ? '2px solid var(--primary)' : '2px solid transparent',
              background: 'transparent',
              color: sortBy === tab.key ? 'var(--primary)' : 'var(--muted-foreground)',
              fontSize: '0.85rem',
              fontWeight: sortBy === tab.key ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Lista de ofertas (cards horizontais) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
