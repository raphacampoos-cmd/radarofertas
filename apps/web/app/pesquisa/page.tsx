'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchOffers } from '@/lib/api'
import { OfferCard } from '@/components/offer/OfferCard'
import type { Offer } from '@/lib/types'

function PesquisaInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const q = searchParams.get('q') || ''

  const [query, setQuery] = useState(q)
  const [results, setResults] = useState<Offer[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (q) {
      setQuery(q)
      runSearch(q)
    }
    inputRef.current?.focus()
  }, [q])

  async function runSearch(term: string) {
    if (!term.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await searchOffers(term)
      setResults(res.data)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/pesquisa?q=${encodeURIComponent(query.trim())}`)
  }

  const quickPillSearches = [
    { label: 'PS5 Slim', icon: '🎮' },
    { label: 'Air Fryer', icon: '🍟' },
    { label: 'EarFun', icon: '🎧' },
    { label: 'Whey Protein', icon: '💪' },
    { label: 'Robô Aspirador', icon: '🤖' },
    { label: 'Prozis', icon: '⚡' },
    { label: 'Café Expresso', icon: '☕' },
  ]

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

      {/* Caixa de Pesquisa HUD 2027 */}
      <section style={{
        position: 'relative',
        borderRadius: '1.25rem',
        padding: '2.5rem 1.75rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(24, 26, 45, 0.75) 0%, rgba(12, 13, 23, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Glow de Fundo */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '250px',
          background: 'radial-gradient(ellipse, rgba(56, 189, 248, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
          borderRadius: '9999px',
        }} />

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
          <span style={{ fontFamily: 'monospace', letterSpacing: '0.05em', color: '#e2e8f0' }}>RADAR SCAN // MOTOR DE BUSCA</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.3rem)',
          fontWeight: 900,
          letterSpacing: '-0.025em',
          color: '#f8fafc',
          marginBottom: '0.6rem',
        }}>
          Rastreio de <span className="gradient-text-orange">Preços & Descontos</span>
        </h1>
        <p style={{
          fontSize: '0.95rem',
          color: '#94a3b8',
          maxWidth: '560px',
          margin: '0 auto 1.75rem',
          lineHeight: 1.5,
        }}>
          Pesquisa por nome de produto, marca ou categoria e consulta o histórico algorítmico em Portugal.
        </p>

        {/* Barra de Pesquisa HUD */}
        <form onSubmit={handleSubmit} style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '9999px',
            padding: '0.35rem 0.5rem 0.35rem 1.25rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}>
            <span style={{ fontSize: '1.2rem', color: '#94a3b8', marginRight: '0.65rem' }}>🔍</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ex: PS5, Robô aspirador, EarFun, Whey..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f8fafc',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="cyber-cta"
              style={{
                border: 'none',
                color: '#fff',
                padding: '0.65rem 1.4rem',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {loading ? (
                <><span>⏳</span><span>A Procurar</span></>
              ) : (
                <><span>Rastrear</span><span>→</span></>
              )}
            </button>
          </div>
        </form>

        {/* Atalhos Rápidos */}
        <div style={{
          display: 'flex',
          gap: '0.45rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '1.25rem',
        }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', alignSelf: 'center', marginRight: '0.2rem' }}>
            Populares:
          </span>
          {quickPillSearches.map(pill => (
            <button
              key={pill.label}
              onClick={() => {
                setQuery(pill.label)
                router.push(`/pesquisa?q=${encodeURIComponent(pill.label)}`)
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.7rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: '#cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)'
                e.currentTarget.style.color = '#fb923c'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                e.currentTarget.style.color = '#cbd5e1'
              }}
            >
              <span>{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Loading HUD */}
      {loading && (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          borderRadius: 'var(--radius)',
          color: '#94a3b8',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }} className="animate-pulse">📡</div>
          <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
            A rastrear a base de dados com DealScore...
          </p>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            A consultar histórico de preços e cupões verificados em Portugal.
          </p>
        </div>
      )}

      {/* Sem resultados */}
      {!loading && searched && results.length === 0 && (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          borderRadius: 'var(--radius)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛰️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Nenhuma oferta localizada para &quot;{query}&quot;
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
            Tenta procurar por uma palavra mais genérica (ex: &quot;Aspirador&quot; em vez do modelo completo) ou consulta os cupões ativos.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/cupoes"
              className="cyber-cta"
              style={{
                textDecoration: 'none',
                color: '#fff',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              🎟️ Ver Cupões Ativos
            </Link>
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                color: '#cbd5e1',
                padding: '0.6rem 1.25rem',
                borderRadius: '9999px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              ← Voltar ao Início
            </Link>
          </div>
        </div>
      )}

      {/* Resultados Encontrados */}
      {!loading && results.length > 0 && (
        <>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem' }}>🎯</span>
              <span style={{ fontSize: '0.92rem', color: '#cbd5e1', fontWeight: 600 }}>
                Resultados para <strong style={{ color: '#fb923c' }}>&quot;{query}&quot;</strong>
              </span>
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              background: 'rgba(249, 115, 22, 0.12)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              color: '#fb923c',
              fontWeight: 800,
            }}>
              {results.length} OFERTA{results.length !== 1 ? 'S' : ''} DETETADA{results.length !== 1 ? 'S' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {results.map((offer, index) => (
              <OfferCard key={offer.id} offer={offer} eager={index < 4} />
            ))}
          </div>
        </>
      )}

      {/* Estado Inicial sem pesquisa */}
      {!searched && !loading && (
        <div className="glass-card" style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          borderRadius: 'var(--radius)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📡</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Pronto para Rastrear Ofertas em Portugal
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '440px', margin: '0 auto', lineHeight: 1.5 }}>
            Digita o nome do produto desejado acima para pesquisar entre mais de 1.700 oportunidades ativas na Amazon, Worten, Fnac, EarFun e parceiros.
          </p>
        </div>
      )}
    </div>
  )
}

export default function PesquisaPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
        <p style={{ fontSize: '1rem', color: '#f8fafc' }}>A carregar motor de busca...</p>
      </div>
    }>
      <PesquisaInner />
    </Suspense>
  )
}
