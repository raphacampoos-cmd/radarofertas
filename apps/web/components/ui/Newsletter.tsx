'use client'

import { useState } from 'react'

export function Newsletter() {
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
        body: JSON.stringify({ email })
      })
      
      if (res.ok) {
        setStatus('success')
        setMessage('Obrigado! Foste subscrito com sucesso. 🎉')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Ocorreu um erro. Tenta novamente mais tarde.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Ocorreu um erro de rede. Tenta novamente.')
    }
  }

  return (
    <section style={{
      background: 'linear-gradient(to right, var(--primary), #047857)',
      color: '#fff',
      padding: '4rem 1.5rem',
      borderRadius: '1rem',
      margin: '4rem auto',
      maxWidth: '1200px',
      textAlign: 'center',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
          Não percas nenhum mínimo histórico!
        </h2>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
          Junta-te à nossa lista VIP. Enviamos um email (no máximo 1 por semana) com os maiores descontos que os nossos radares detetaram. Zero spam.
        </p>
        
        {status === 'success' ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontWeight: 700,
            fontSize: '1.1rem',
          }}>
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            gap: '0.5rem',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                placeholder="O teu melhor email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                style={{
                  flex: 1,
                  minWidth: '250px',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  color: '#111',
                }}
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email.includes('@')}
                style={{
                  padding: '1rem 2rem',
                  background: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#333')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#111')}
              >
                {status === 'loading' ? 'A subscrever...' : 'Quero receber as ofertas'}
              </button>
            </div>
            {status === 'error' && (
              <p style={{ color: '#fca5a5', marginTop: '0.5rem', fontSize: '0.875rem' }}>{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
