'use client'

import { useState } from 'react'

interface CouponBoxProps {
  code: string
  affiliateUrl: string
}

export function CouponBox({ code, affiliateUrl }: CouponBoxProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      // Abrir a loja após copiar
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback se clipboard não disponível
      const el = document.createElement('textarea')
      el.value = code
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  return (
    <div style={{
      border: '2px dashed #d97706',
      borderRadius: 'var(--radius)',
      padding: '1rem',
      background: '#fef3c7',
    }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>
        🏷️ Cupão de desconto
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <div style={{
          flex: 1,
          background: '#fff',
          border: '1px solid #d97706',
          borderRadius: '0.375rem',
          padding: '0.5rem 0.75rem',
          fontFamily: 'monospace',
          fontSize: '1.1rem',
          fontWeight: 800,
          color: '#92400e',
          letterSpacing: '0.1em',
          textAlign: 'center',
        }}>
          {code}
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: '0.5rem 1rem',
            background: copied ? '#16a34a' : '#d97706',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {copied ? '✓ Copiado!' : 'Copiar'}
        </button>
      </div>
      <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.5rem' }}>
        Clica em "Copiar" — o código é copiado e a loja abre automaticamente
      </div>
    </div>
  )
}
