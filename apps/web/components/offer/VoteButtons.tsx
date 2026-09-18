'use client'

import { useState, useEffect } from 'react'

interface VoteButtonsProps {
  offerId: number
  initialUpvotes?: number
  initialDownvotes?: number
}

export function VoteButtons({ offerId, initialUpvotes = 0, initialDownvotes = 0 }: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [downvotes, setDownvotes] = useState(initialDownvotes)
  const [hasVoted, setHasVoted] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const vote = localStorage.getItem(`radarofertas_voted_${offerId}`)
    if (vote) setHasVoted(vote)
  }, [offerId])

  const handleVote = async (type: 'up' | 'down') => {
    if (hasVoted || isLoading) return
    
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/offers/${offerId}/vote`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })

      if (res.ok) {
        const data = await res.json()
        setUpvotes(data.data.upvotes)
        setDownvotes(data.data.downvotes)
        setHasVoted(type)
        localStorage.setItem(`radarofertas_voted_${offerId}`, type)
      }
    } catch (err) {
      console.error('Failed to vote', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', width: '100%' }}>
      <button
        onClick={() => handleVote('up')}
        disabled={hasVoted !== null || isLoading}
        style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          padding: '0.6rem',
          border: hasVoted === 'up' ? '2px solid #22c55e' : '1px solid var(--border)',
          borderRadius: '0.5rem',
          background: hasVoted === 'up' ? '#f0fdf4' : '#fff',
          color: hasVoted === 'up' ? '#16a34a' : 'var(--foreground)',
          fontSize: '0.85rem', fontWeight: 600,
          cursor: hasVoted ? 'default' : 'pointer',
          transition: 'all 0.2s',
          opacity: (hasVoted && hasVoted !== 'up') ? 0.6 : 1
        }}
        title="Oferta Fixe!"
      >
        👍 Fixe <span style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '1rem', fontSize: '0.75rem' }}>{upvotes}</span>
      </button>

      <button
        onClick={() => handleVote('down')}
        disabled={hasVoted !== null || isLoading}
        style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          padding: '0.6rem',
          border: hasVoted === 'down' ? '2px solid #ef4444' : '1px solid var(--border)',
          borderRadius: '0.5rem',
          background: hasVoted === 'down' ? '#fef2f2' : '#fff',
          color: hasVoted === 'down' ? '#dc2626' : 'var(--foreground)',
          fontSize: '0.85rem', fontWeight: 600,
          cursor: hasVoted ? 'default' : 'pointer',
          transition: 'all 0.2s',
          opacity: (hasVoted && hasVoted !== 'down') ? 0.6 : 1
        }}
        title="Oferta Terminada / Erro de Preço Expirado"
      >
        🔕 Terminado <span style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '1rem', fontSize: '0.75rem' }}>{downvotes}</span>
      </button>
    </div>
  )
}
