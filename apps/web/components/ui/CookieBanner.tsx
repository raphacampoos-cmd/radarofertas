'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('radarofertas_cookie_consent')
    if (!consent) {
      setShow(true)
    }

    // Listener para reabrir configurações de cookies pelo footer ou links
    const handleReopen = () => setShow(true)
    window.addEventListener('reopen-cookie-banner', handleReopen)
    return () => window.removeEventListener('reopen-cookie-banner', handleReopen)
  }, [])

  const acceptAll = () => {
    localStorage.setItem('radarofertas_cookie_consent', 'accepted')
    setShow(false)
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: 'accepted' }))
  }

  const rejectNonEssential = () => {
    localStorage.setItem('radarofertas_cookie_consent', 'rejected')
    setShow(false)
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: 'rejected' }))
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-label="Gestão de Consentimento de Cookies"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(22, 22, 34, 0.98)',
        backdropFilter: 'blur(10px)',
        padding: '1.25rem 1rem',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.5)',
        zIndex: 9999,
        borderTop: '1px solid #2a2a3a',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1 1 340px', fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>
          <p style={{ margin: 0 }}>
            🍪 <strong>Valorizamos a sua privacidade (RGPD):</strong> Utilizamos cookies próprios e de terceiros (como Google AdSense e Analytics) para assegurar o funcionamento do site, analisar métricas e apresentar anúncios e ofertas personalizadas. Saiba mais na nossa{' '}
            <Link href="/politica-cookies" style={{ color: '#f97316', textDecoration: 'underline', fontWeight: 600 }}>
              Política de Cookies
            </Link>{' '}
            e na{' '}
            <Link href="/privacidade" style={{ color: '#f97316', textDecoration: 'underline', fontWeight: 600 }}>
              Política de Privacidade
            </Link>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={rejectNonEssential}
            style={{
              padding: '0.6rem 1.1rem',
              background: '#1a1a2a',
              color: '#e2e8f0',
              border: '1px solid #2a2a3a',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = '#242438')}
            onMouseOut={(e) => (e.currentTarget.style.background = '#1a1a2a')}
          >
            Apenas Necessários
          </button>
          <button
            onClick={acceptAll}
            style={{
              padding: '0.6rem 1.25rem',
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              boxShadow: '0 2px 10px rgba(249, 115, 22, 0.3)',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  )
}
