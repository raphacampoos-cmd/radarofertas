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
  }, [])

  const accept = () => {
    localStorage.setItem('radarofertas_cookie_consent', 'accepted')
    setShow(false)
    // Here we would load Google Analytics if needed
  }

  const reject = () => {
    localStorage.setItem('radarofertas_cookie_consent', 'rejected')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#fff',
      padding: '1.5rem',
      boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      borderTop: '1px solid var(--border)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 300px', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
          <p style={{ margin: 0 }}>
            Utilizamos cookies para melhorar a sua experiência, personalizar conteúdo e analisar o nosso tráfego. 
            Ao clicar em "Aceitar", concorda com a nossa{' '}
            <Link href="/politica-cookies" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Política de Cookies</Link> e{' '}
            <Link href="/politica-privacidade" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Política de Privacidade</Link>.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={reject}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Apenas Necessários
          </button>
          <button
            onClick={accept}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  )
}
