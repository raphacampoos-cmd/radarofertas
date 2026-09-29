'use client'

import { useState, useEffect } from 'react'

const DEFAULT_WHATSAPP_URL = 'https://chat.whatsapp.com/BBbFPE8rae60KUo7lynSnj'
const DEFAULT_TELEGRAM_URL = 'https://t.me/radarofertaspt'

export function CommunityFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDismissed, setIsDismissed] = useState(true)

  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_INVITE_URL || DEFAULT_WHATSAPP_URL
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_INVITE_URL || DEFAULT_TELEGRAM_URL

  useEffect(() => {
    // Verificar se já fechou nesta sessão
    const dismissed = sessionStorage.getItem('radarofertas_vip_widget_dismissed')
    if (!dismissed) {
      setIsDismissed(false)
      // Abre automaticamente após 3 segundos para converter o visitante
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem('radarofertas_vip_widget_dismissed', 'true')
    setIsOpen(false)
    setIsDismissed(true)
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <>
      {/* Botão Flutuante Discreto (Pill Trigger) quando minimizado */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          aria-label="Abrir alertas VIP"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9990,
            background: 'linear-gradient(135deg, #1e1e2e 0%, #161622 100%)',
            color: '#f1f5f9',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            borderRadius: '9999px',
            padding: '0.65rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4), 0 0 12px rgba(249,115,22,0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.85rem',
            fontWeight: 700,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.borderColor = '#f97316'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.4)'
          }}
        >
          <span style={{ position: 'relative', display: 'flex', height: '10px', width: '10px' }}>
            <span style={{
              position: 'absolute',
              display: 'inline-flex',
              height: '100%',
              width: '100%',
              borderRadius: '9999px',
              backgroundColor: '#22c55e',
              opacity: 0.75,
              animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
            <span style={{
              position: 'relative',
              display: 'inline-flex',
              borderRadius: '9999px',
              height: '10px',
              width: '10px',
              backgroundColor: '#22c55e'
            }} />
          </span>
          <span>🔥 Alertas VIP (WhatsApp & Telegram)</span>
        </button>
      )}

      {/* Card Flutuante Principal */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="vip-modal-title"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            width: 'calc(100vw - 3rem)',
            maxWidth: '350px',
            background: 'linear-gradient(180deg, #1a1a2a 0%, #12121c 100%)',
            border: '1px solid rgba(249, 115, 22, 0.35)',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '0 16px 36px rgba(0,0,0,0.5), 0 0 20px rgba(249, 115, 22, 0.15)',
            color: '#f1f5f9',
            animation: 'fadeInUp 0.25s ease-out',
          }}
        >
          {/* Botão Fechar */}
          <button
            onClick={handleDismiss}
            aria-label="Fechar"
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff'
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94a3b8'
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            }}
          >
            ✕
          </button>

          {/* Badge Topo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#4ade80',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              🟢 Em Direto · Portugal
            </span>
          </div>

          {/* Título & Descrição */}
          <h3
            id="vip-modal-title"
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              margin: '0 0 0.4rem 0',
              color: '#fff',
              lineHeight: 1.3,
            }}
          >
            🔥 Não percas os Erros de Preço!
          </h3>

          <p style={{
            fontSize: '0.82rem',
            color: '#94a3b8',
            lineHeight: 1.45,
            margin: '0 0 1rem 0',
          }}>
            Recebe quedas drásticas de preço e cupões de lojas em Portugal (Amazon, Worten, Fnac) antes de esgotarem.
          </p>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* WhatsApp */}
            <a
              href="/entrar?canal=whatsapp"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#22c55e',
                color: '#fff',
                padding: '0.65rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.25)',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span>Entrar no WhatsApp VIP</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: '#0284c7',
                color: '#fff',
                padding: '0.65rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.535-.195 1.006.128.832.928z"/>
              </svg>
              <span>Canal de Telegram Oficial</span>
            </a>
          </div>

          {/* Micro-prova social */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.72rem',
            color: '#64748b',
          }}>
            <span>⚡ 100% Grátis</span>
            <span>·</span>
            <span>🛡️ Sem Spam</span>
            <span>·</span>
            <span>🔔 Em Direto</span>
          </div>
        </div>
      )}
    </>
  )
}
