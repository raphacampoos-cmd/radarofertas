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
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        color: 'var(--foreground)',
        fontWeight: 600,
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = '#f1f5f9')}
      onMouseOut={(e) => (e.currentTarget.style.background = '#f8fafc')}
    >
      {copied ? <Check size={18} color="#16a34a" /> : <Share2 size={18} />}
      {copied ? 'Link copiado!' : 'Partilhar Oferta'}
    </button>
  )
}
