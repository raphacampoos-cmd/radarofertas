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
        disabled={isLoading || hasVoted !== null}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          padding: '0.6rem',
          background: hasVoted === 'up' ? '#1e3a8a' : '#1e293b',
          color: hasVoted === 'up' ? '#60a5fa' : '#94a3b8',
          border: `1px solid ${hasVoted === 'up' ? '#2563eb' : '#334155'}`,
          borderRadius: 'var(--radius)',
          fontSize: '0.85rem',
          fontWeight: 600, cursor: (isLoading || hasVoted !== null) ? 'default' : 'pointer', transition: 'all 0.2s ease',
          opacity: (hasVoted && hasVoted !== 'up') ? 0.6 : 1
        }}
        onMouseOver={(e) => { if (!hasVoted) e.currentTarget.style.background = '#334155' }}
        onMouseOut={(e) => { if (!hasVoted) e.currentTarget.style.background = '#1e293b' }}
      >
        <span>👍</span> Fixe <span style={{ background: hasVoted === 'up' ? '#3b82f6' : '#334155', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '12px', fontSize: '0.7rem', marginLeft: '0.2rem' }}>{upvotes}</span>
      </button>

      <button
        onClick={() => handleVote('down')}
        disabled={isLoading || hasVoted !== null}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
          padding: '0.6rem',
          background: hasVoted === 'down' ? '#7f1d1d' : '#1e293b',
          color: hasVoted === 'down' ? '#f87171' : '#94a3b8',
          border: `1px solid ${hasVoted === 'down' ? '#dc2626' : '#334155'}`,
          borderRadius: 'var(--radius)',
          fontSize: '0.85rem',
          fontWeight: 600, cursor: (isLoading || hasVoted !== null) ? 'default' : 'pointer', transition: 'all 0.2s ease',
          opacity: (hasVoted && hasVoted !== 'down') ? 0.6 : 1
        }}
        onMouseOver={(e) => { if (!hasVoted) e.currentTarget.style.background = '#334155' }}
        onMouseOut={(e) => { if (!hasVoted) e.currentTarget.style.background = '#1e293b' }}
      >
        <span>🔕</span> Terminado <span style={{ background: hasVoted === 'down' ? '#ef4444' : '#334155', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '12px', fontSize: '0.7rem', marginLeft: '0.2rem' }}>{downvotes}</span>
      </button>
    </div>
  )
}
