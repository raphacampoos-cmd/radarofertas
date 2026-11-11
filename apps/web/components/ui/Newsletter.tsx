'use client'

import { useState } from 'react'

interface NewsletterProps {
  source?: string
  title?: string
  description?: string
  buttonText?: string
  placeholder?: string
}

export function Newsletter({
  source = 'web',
  title = 'Rastreio VIP: Nunca mais percas um Mínimo Histórico',
  description = 'Junta-te aos utilizadores que recebem alertas instantâneos quando o nosso algoritmo deteta quedas brutais de preço e cupões relâmpago. Zero spam.',
  buttonText = 'Ativar Alertas VIP ↗',
  placeholder = 'O teu melhor email...',
}: NewsletterProps = {}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setStatus('loading')
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
      })
      
      if (res.ok) {
        setStatus('success')
        setMessage('Obrigado! Radar ativado para o teu email com sucesso. 🎉')
        if (typeof window !== 'undefined' && (window as any).gtag) {
          try {
            (window as any).gtag('event', 'newsletter_signup', {
              event_category: 'engagement',
              event_label: source,
            })
          } catch {}
        }
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Ocorreu um erro ao registar o teu email. Tenta novamente.')
      }
    } catch {
      setStatus('error')
      setMessage('Erro de ligação. Por favor tenta novamente.')
    }
  }

  return (
    <section style={{
      position: 'relative',
      borderRadius: '1.25rem',
      padding: '3rem 1.75rem',
      margin: '3.5rem auto 2.5rem',
      maxWidth: '1200px',
      background: 'linear-gradient(135deg, rgba(24, 26, 45, 0.8) 0%, rgba(12, 13, 23, 0.95) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(16px)',
      overflow: 'hidden',
      textAlign: 'center',
    }}>
      {/* Luz ambiente de fundo */}
      <div style={{
        position: 'absolute',
        top: '-40%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '250px',
        background: 'radial-gradient(ellipse, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        borderRadius: '9999px',
      }} />

      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Pílula de Telemetria */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '1rem',
          fontSize: '0.75rem',
          color: '#94a3b8',
        }}>
          <span className="radar-beacon-dot" />
          <span style={{ fontFamily: 'monospace', letterSpacing: '0.05em', color: '#e2e8f0' }}>
            RADAR VIP // ALERTAS EXCLUSIVOS
          </span>
        </div>

        <h2 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
          fontWeight: 900,
          color: '#f8fafc',
          marginBottom: '0.75rem',
          lineHeight: 1.25,
          letterSpacing: '-0.025em',
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '0.98rem',
          color: '#94a3b8',
          marginBottom: '2rem',
          lineHeight: 1.6,
        }}>
          {description}
        </p>
        
        {status === 'success' ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            fontWeight: 800,
            fontSize: '1rem',
          }}>
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '9999px',
              padding: '0.35rem 0.5rem 0.35rem 1.25rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
              <input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                style={{
                  flex: 1,
                  minWidth: '220px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '0.95rem',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email.includes('@')}
                className="cyber-cta"
                style={{
                  padding: '0.7rem 1.6rem',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  opacity: (!email.includes('@') || status === 'loading') ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {status === 'loading' ? 'A ligar ao Radar...' : buttonText}
              </button>
            </div>
            {status === 'error' && (
              <p style={{ color: '#f87171', marginTop: '0.5rem', fontSize: '0.85rem' }}>{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
