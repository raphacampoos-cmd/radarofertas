'use client'

import { Share2, Check, Copy } from 'lucide-react'
import { useState } from 'react'

export function ShareButtonBig({ title, slug, price }: { title: string, slug: string, price: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = `https://radarofertas-psi.vercel.app/oferta/${slug}`
    const text = `🔥 ${title} por apenas ${price}!\n\nVer oferta:`

    if (navigator.share) {
      try {
        await navigator.share({ title: 'RadarOfertas', text, url })
        return
      } catch (err) {
        // user cancelled
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        padding: '0.75rem',
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 'var(--radius)',
        color: '#f8fafc',
        fontWeight: 600,
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = '#334155';
        e.currentTarget.style.borderColor = '#475569';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = '#1e293b';
        e.currentTarget.style.borderColor = '#334155';
      }}
    >
      {copied ? <Check size={18} color="#22c55e" /> : <Share2 size={18} color="#94a3b8" />}
      <span style={{ color: copied ? '#22c55e' : '#f8fafc' }}>
        {copied ? 'Link copiado para a área de transferência!' : 'Partilhar Oferta'}
      </span>
    </button>
  )
}
