'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_COUPONS, type CouponItem } from '@/lib/coupons-data'

export function CouponHub() {
  const [selectedStore, setSelectedStore] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Lojas únicas
  const stores = useMemo(() => {
    const list = Array.from(new Set(ALL_COUPONS.map(c => c.storeName)))
    return ['all', ...list]
  }, [])

  // Filtragem
  const filtered = useMemo(() => {
    return ALL_COUPONS.filter((c) => {
      if (selectedStore !== 'all' && c.storeName !== selectedStore) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          c.storeName.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        if (!match) return false
      }
      return true
    })
  }, [selectedStore, searchQuery])

  function handleCopy(code: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
    }
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  return (
    <div>
      {/* Controlo de Pesquisa & Filtros HUD */}
      <div className="glass-card" style={{
        borderRadius: 'var(--radius)',
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {/* Barra de Pesquisa */}
        <div style={{ position: 'relative' }}>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar cupão por loja, marca ou categoria (ex: EarFun, Prozis, Café, MagSafe)..."
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#f8fafc',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            🔍
          </span>
        </div>

        {/* Chips de Lojas */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, fontFamily: 'monospace', marginRight: '0.25rem' }}>
            LOJA:
          </span>
          {stores.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStore(st)}
              className="glass-pill"
              style={{
                border: 'none',
                borderRadius: '9999px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedStore === st ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : undefined,
                color: selectedStore === st ? '#fff' : '#94a3b8',
                boxShadow: selectedStore === st ? '0 2px 10px rgba(249, 115, 22, 0.35)' : undefined,
              }}
            >
              {st === 'all' ? 'Todas as Lojas' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cupões 2027 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
        gap: '1.25rem',
      }}>
        {filtered.map((cp) => {
          const isCopied = copiedCode === cp.code
          return (
            <div
              key={cp.id}
              className="glass-card"
              style={{
                borderRadius: 'var(--radius)',
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                position: 'relative',
                border: isCopied ? '1px solid #10b981' : cp.highlight ? '1px solid rgba(249, 115, 22, 0.35)' : undefined,
                boxShadow: isCopied ? '0 0 25px rgba(16, 185, 129, 0.35)' : undefined,
              }}
            >
              {/* Topo do Cupão */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                    {cp.category}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                    {cp.storeName}
                  </h3>
                </div>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: '#fb923c',
                  background: 'rgba(249, 115, 22, 0.14)',
                  border: '1px solid rgba(249, 115, 22, 0.35)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '0.45rem',
                  boxShadow: '0 0 10px rgba(249, 115, 22, 0.2)',
                }}>
                  {cp.discount}
                </span>
              </div>

              {/* Descrição */}
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.45, margin: '0.25rem 0 auto' }}>
                {cp.description}
              </p>

              {/* Validade */}
              <div style={{ fontSize: '0.7rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>⏳</span>
                <span>Validade: {cp.validUntil}</span>
              </div>

              {/* Caixa de Código e Botão Copiar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <code style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  padding: '0.55rem 0.75rem',
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  color: isCopied ? '#34d399' : '#f8fafc',
                  textAlign: 'center',
                  letterSpacing: '0.05em',
                }}>
                  {isCopied ? 'COPIADO! ✓' : cp.code}
                </code>

                <button
                  onClick={() => handleCopy(cp.code)}
                  className="cyber-cta"
                  style={{
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    padding: '0.55rem 1rem',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: isCopied ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined,
                  }}
                  title="Copiar cupão para a área de transferência"
                >
                  {isCopied ? 'Ativo' : 'Copiar'}
                </button>
              </div>

              {/* Link para ofertas da loja */}
              <Link
                href={cp.affiliateUrl}
                style={{
                  fontSize: '0.75rem',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontWeight: 700,
                  textAlign: 'center',
                  marginTop: '0.2rem',
                }}
              >
                Ver ofertas da loja {cp.storeName} →
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
