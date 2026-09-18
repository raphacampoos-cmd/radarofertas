'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: number
  name: string
  content: string
  createdAt: string
}

interface CommentsSectionProps {
  offerId: number
}

export function CommentsSection({ offerId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://radarofertas-api-production.up.railway.app'}/api/offers/${offerId}/comments`)
      .then(res => res.json())
      .then(data => {
        if (data.data) setComments(data.data)
      })
      .catch(console.error)
  }, [offerId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://radarofertas-api-production.up.railway.app'}/api/offers/${offerId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, content })
      })

      if (res.ok) {
        setStatus('success')
        setName('')
        setEmail('')
        setContent('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid #2a2a3a', paddingTop: '2rem' }}>
      
      {/* Lista de Comentários Aprovados */}
      {comments.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
            Comentários da Comunidade ({comments.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {comments.map(c => (
              <div key={c.id} style={{ background: '#161622', padding: '1.5rem', borderRadius: '12px', border: '1px solid #2a2a3a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2a2a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{c.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {new Date(c.createdAt).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.6 }}>{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulário de Novo Comentário */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Deixa um comentário</h2>
        
        <div style={{ 
          background: '#161622', 
          border: '1px solid #2a2a3a', 
          borderRadius: '12px', 
          padding: '2rem' 
        }}>
          
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem', marginTop: 0 }}>
            O seu endereço de email não será publicado. Campos obrigatórios marcados com *
          </p>

          {status === 'success' ? (
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              ✅ O teu comentário foi enviado com sucesso e aguarda aprovação da nossa equipa!
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea 
                  required
                  rows={4}
                  placeholder="Compraste? Vale a pena? Conta à comunidade..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0d0d14',
                    border: '1px solid #2a2a3a',
                    borderRadius: '8px',
                    padding: '1rem',
                    color: '#fff',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nome *</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#0d0d14',
                      border: '1px solid #2a2a3a',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Email *</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#0d0d14',
                      border: '1px solid #2a2a3a',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                    }}
                  />
                </div>
              </div>

              {status === 'error' && (
                <div style={{ color: '#ef4444', fontSize: '0.9rem' }}>
                  ❌ Ocorreu um erro ao enviar o comentário. Tenta novamente.
                </div>
              )}

              <div>
                <button 
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    background: '#f97316',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: status === 'loading' ? 'wait' : 'pointer',
                    opacity: status === 'loading' ? 0.7 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  {status === 'loading' ? 'A enviar...' : 'Publicar comentário'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  )
}
