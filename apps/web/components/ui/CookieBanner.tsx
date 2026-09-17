'use client'

import { useState, useEffect } from 'react'

export function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--card)',
      borderTop: '1px solid var(--border)',
      padding: '1rem',
      boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '1200px', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--muted-foreground)', flex: '1 1 300px' }}>
          🍪 <strong>Utilizamos cookies</strong> para analisar o tráfego do site, personalizar anúncios e proporcionar-lhe a melhor experiência possível. Ao continuar a navegar, concorda com a nossa <a href="/privacidade" style={{ color: 'var(--primary)' }}>Política de Privacidade (RGPD)</a>.
        </p>
        <button 
          onClick={acceptCookies}
          style={{
            background: 'var(--foreground)',
            color: 'var(--background)',
            border: 'none',
            padding: '0.6rem 1.5rem',
            borderRadius: '9999px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Aceitar e Fechar
        </button>
      </div>
    </div>
  )
}
