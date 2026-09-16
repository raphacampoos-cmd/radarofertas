'use client'

import { trackClick } from '@/lib/api'

interface AffiliateButtonProps {
  offerId: number
  affiliateUrl: string
  storeName: string
}

export function AffiliateButton({ offerId, affiliateUrl, storeName }: AffiliateButtonProps) {
  async function handleClick() {
    await trackClick(offerId, 'web')
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '0.9rem 1.5rem',
        background: 'var(--primary)',
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--radius)',
        fontSize: '1.05rem',
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'opacity 0.15s, transform 0.15s',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.opacity = '0.88'
        e.currentTarget.style.transform = 'scale(1.01)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      🛒 Ver Oferta na {storeName} →
    </button>
  )
}
