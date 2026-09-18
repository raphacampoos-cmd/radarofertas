'use client'

import { useState } from 'react'
import { trackClick } from '@/lib/api'

interface AffiliateButtonProps {
  offerId: number
  affiliateUrl: string
  storeName: string
}

export function AffiliateButton({ offerId, affiliateUrl, storeName }: AffiliateButtonProps) {
  const [redirecting, setRedirecting] = useState(false)

  async function handleClick() {
    setRedirecting(true)
    await trackClick(offerId, 'web')
    setTimeout(() => {
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer')
      setRedirecting(false)
    }, 1200)
  }

  return (
    <button
      onClick={handleClick}
      disabled={redirecting}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '0.9rem 1.5rem',
        background: redirecting ? '#16a34a' : 'var(--primary)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius)',
        fontSize: '1.05rem',
        fontWeight: 800,
        cursor: redirecting ? 'wait' : 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseOver={(e) => {
        if (!redirecting) {
          e.currentTarget.style.opacity = '0.88'
          e.currentTarget.style.transform = 'scale(1.01)'
        }
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {redirecting ? (
        <>
          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '1.1rem' }}>⏳</span>
          A redirecionar para {storeName}...
        </>
      ) : (
        <>🛒 Ver Oferta na {storeName} →</>
      )}
    </button>
  )
}
