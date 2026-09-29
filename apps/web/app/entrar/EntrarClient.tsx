'use client'

import { useEffect, useState, useMemo } from 'react'

const DEFAULT_WHATSAPP_GROUPS = [
  'https://chat.whatsapp.com/BBbFPE8rae60KUo7lynSnj',
]

const DEFAULT_TELEGRAM = 'https://t.me/radarofertaspt'

export function EntrarClient() {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0)
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null)
  const [targetChannel, setTargetChannel] = useState<'whatsapp' | 'telegram' | null>(null)

  // Lista de grupos configurados (suporta rotação automática)
  const whatsappGroups = useMemo(() => {
    const envGroups = process.env.NEXT_PUBLIC_WHATSAPP_GROUPS
    if (envGroups) {
      const parsed = envGroups.split(',').map(s => s.trim()).filter(Boolean)
      if (parsed.length > 0) return parsed
    }
    const single = process.env.NEXT_PUBLIC_WHATSAPP_INVITE_URL
    if (single) return [single]
    return DEFAULT_WHATSAPP_GROUPS
  }, [])

  const currentWhatsAppUrl = whatsappGroups[activeGroupIndex] || whatsappGroups[0]
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_INVITE_URL || DEFAULT_TELEGRAM

  useEffect(() => {
    // Rotação pseudo-aleatória ou equilibrada baseada no timestamp
    const index = Math.floor(Math.random() * whatsappGroups.length)
    setActiveGroupIndex(index)

    // Analisar parâmetros da URL se houver redirecionamento automático
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const canal = params.get('canal')
      const auto = params.get('auto')

      if (auto === 'true' || auto === '1') {
        if (canal === 'whatsapp') {
          setTargetChannel('whatsapp')
          setRedirectCountdown(2)
        } else if (canal === 'telegram') {
          setTargetChannel('telegram')
          setRedirectCountdown(2)
        }
      }
    }
  }, [whatsappGroups])

  // Contagem decrescente para auto-redirect se especificado
  useEffect(() => {
    if (redirectCountdown === null) return
    if (redirectCountdown <= 0) {
      const dest = targetChannel === 'telegram' ? telegramUrl : currentWhatsAppUrl
      window.location.href = dest
      return
    }

    const timer = setTimeout(() => {
      setRedirectCountdown(prev => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearTimeout(timer)
  }, [redirectCountdown, targetChannel, currentWhatsAppUrl, telegramUrl])

  const trackClick = (canal: 'whatsapp' | 'telegram') => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('event', 'join_community', {
        channel: canal,
        page: '/entrar',
      })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Alerta de redirecionamento automático se ativado */}
      {redirectCountdown !== null && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          borderRadius: '0.75rem',
          padding: '1rem',
          color: '#4ade80',
          fontSize: '0.9rem',
          fontWeight: 700,
        }}>
          ⏳ A redirecionar para o {targetChannel === 'whatsapp' ? 'WhatsApp' : 'Telegram'} em {redirectCountdown}s...
          <div style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#94a3b8' }}>
            Não foste redirecionado?{' '}
            <a
              href={targetChannel === 'telegram' ? telegramUrl : currentWhatsAppUrl}
              style={{ color: '#fff', textDecoration: 'underline' }}
            >
              Clica aqui para entrar imediatamente
            </a>
          </div>
        </div>
      )}

      {/* OPÇÃO 1: WHATSAPP VIP */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid #2a2a3a',
        borderRadius: '1rem',
        padding: '1.25rem',
        textAlign: 'left',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>💬</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Grupo VIP WhatsApp</span>
          </div>
          <span style={{
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#22c55e',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
          }}>
            Vagas Abertas
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
          Recebe diretamente no teu WhatsApp as melhores descidas de preço e erros de sistema em Portugal.
        </p>

        <a
          href={currentWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('whatsapp')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: '100%',
            background: '#22c55e',
            color: '#fff',
            padding: '0.85rem 1rem',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
            transition: 'transform 0.15s, opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
          </svg>
          <span>Entrar no Grupo WhatsApp →</span>
        </a>
      </div>

      {/* OPÇÃO 2: TELEGRAM OFICIAL */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid #2a2a3a',
        borderRadius: '1rem',
        padding: '1.25rem',
        textAlign: 'left',
        position: 'relative',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>✈️</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>Canal Telegram Oficial</span>
          </div>
          <span style={{
            background: 'rgba(2, 132, 199, 0.15)',
            color: '#38bdf8',
            fontSize: '0.7rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            textTransform: 'uppercase',
          }}>
            Ilimitado · Tempo Real
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
          Todas as ofertas em tempo real com histórico de preços, fotos de alta qualidade e links diretos.
        </p>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('telegram')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: '100%',
            background: '#0284c7',
            color: '#fff',
            padding: '0.85rem 1rem',
            borderRadius: '0.6rem',
            textDecoration: 'none',
            fontWeight: 800,
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            transition: 'transform 0.15s, opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.92')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.535-.195 1.006.128.832.928z"/>
          </svg>
          <span>Entrar no Canal de Telegram →</span>
        </a>
      </div>
    </div>
  )
}
