'use client'

import { useState, useEffect } from 'react'

// Link real do grupo/canal (ex: https://chat.whatsapp.com/XXXX). Sem isto o widget fica oculto,
// em vez de mostrar um botão que aponta para um convite inexistente.
const INVITE_URL = process.env.NEXT_PUBLIC_WHATSAPP_INVITE_URL

export function WhatsAppWidget() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!INVITE_URL) return
    // Show after 3 seconds, but only if not dismissed in this session
    const isDismissed = sessionStorage.getItem('radarofertas_wa_dismissed')
    if (!isDismissed) {
      const timer = setTimeout(() => setShow(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem('radarofertas_wa_dismissed', 'true')
    setShow(false)
  }

  if (!INVITE_URL || !show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 9998,
      background: '#fff',
      padding: '1.25rem',
      borderRadius: '1rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      width: '300px',
      border: '1px solid var(--border)',
      animation: 'slideUp 0.3s ease-out'
    }}>
      <button 
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          color: 'var(--muted-foreground)',
          cursor: 'pointer',
          padding: '0.2rem'
        }}
        aria-label="Fechar"
      >
        ×
      </button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: '#25D366', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          🔔
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Canal WhatsApp</h4>
        </div>
      </div>
      
      <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
        Junta-te à nossa comunidade! Recebe os melhores erros de preço antes que esgotem.
      </p>
      
      <a 
        href={INVITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          // Opcional: ocultar após entrar
          handleDismiss()
        }}
        style={{
          display: 'block',
          width: '100%',
          padding: '0.75rem',
          background: '#25D366',
          color: '#fff',
          textAlign: 'center',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.95rem'
        }}
      >
        Entrar no canal
      </a>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  )
}
