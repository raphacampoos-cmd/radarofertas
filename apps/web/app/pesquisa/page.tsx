'use client'

import { Suspense } from 'react'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
    router.push(`/pesquisa?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem' }}>

      {/* Caixa de pesquisa */}
      <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>
          🔍 Pesquisar Ofertas
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ex: PS5, air fryer, whey protein..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '2px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--card)',
                color: 'var(--foreground)',
                fontSize: '1rem',
                outline: 'none',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--primary)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {loading ? '...' : 'Pesquisar'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
          <p>A pesquisar...</p>
        </div>
      )}

      {/* Sem resultados */}
      {!loading && searched && results.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--muted)',
          borderRadius: 'var(--radius)',
          color: 'var(--muted-foreground)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</div>
          <p style={{ fontWeight: 600 }}>Sem resultados para <strong>"{query}"</strong></p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Tenta outros termos ou navega pelas categorias.
          </p>
        </div>
      )}

      {/* Resultados */}
      {!loading && results.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              {results.length} resultado{results.length !== 1 ? 's' : ''} para <em>"{query}"</em>
            </h2>
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            {results.map((offer, index) => (
              <OfferCard key={offer.id} offer={offer} eager={index < 4} />
            ))}
          </div>
        </>
      )}

      {/* Estado inicial */}
      {!searched && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📡</div>
          <p>Pesquisa nas melhores ofertas de Portugal</p>
          <div style={{
            display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem',
          }}>
            {['PS5', 'Air Fryer', 'Whey Protein', 'Roomba', 'Sony WH-1000XM5'].map(term => (
              <button key={term}
                onClick={() => router.push(`/pesquisa?q=${encodeURIComponent(term)}`)}
                style={{
                  padding: '0.4rem 0.9rem', borderRadius: '9999px',
                  border: '1px solid var(--border)', background: 'var(--card)',
                  color: 'var(--foreground)', cursor: 'pointer', fontSize: '0.85rem',
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PesquisaPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted-foreground)' }}>
        <div style={{ fontSize: '2rem' }}>🔍</div>
        <p>A carregar...</p>
      </div>
    }>
      <PesquisaInner />
    </Suspense>
  )
}
