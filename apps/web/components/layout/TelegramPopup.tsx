'use client'

import { useState, useEffect } from 'react'

export function TelegramPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosed, setIsClosed] = useState(false)

  useEffect(() => {
    // Verificar se já fechou o popup nesta sessão
    const closed = sessionStorage.getItem('telegram-popup-closed')
    if (closed) {
      setIsClosed(true)
      return
    }

    // Aparece passado 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (isClosed || !isVisible) return null

  function handleClose() {
    setIsVisible(false)
    setIsClosed(true)
    sessionStorage.setItem('telegram-popup-closed', 'true')
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      background: '#161622',
      border: '1px solid #2a2a3a',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(249, 115, 22, 0.1)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      maxWidth: '350px',
      animation: 'slideUp 0.5s ease-out forwards',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Ícone Telegram */}
      <div style={{
        background: '#fff',
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="#0088cc">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.285-.346-.096l-6.405 4.042-2.76-.86c-.6-.188-.61-.6.125-.89l10.825-4.17c.5-.195.952.126.852.887z"/>
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Canal Telegram <span style={{ fontSize: '1.2rem' }}>✈️</span>
        </h3>
        <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.4 }}>
          Recebe os descontos no Telegram, assim que saem!
        </p>
        <a 
          href="https://t.me/radarofertaspt"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#0088cc',
            color: '#fff',
            textDecoration: 'none',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#0077b3'}
          onMouseOut={e => e.currentTarget.style.background = '#0088cc'}
        >
          Entrar no canal
        </a>
      </div>

      <button 
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '0.25rem',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ×
      </button>
    </div>
  )
}
