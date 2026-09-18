'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { Category, Store } from '@/lib/types'

interface CategoryDropdownProps {
  categories: (Category & { count: number })[]
  stores: (Store & { count: number })[]
}

export function CategoryDropdown({ categories, stores }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? '#f97316' : '#1a1a2a',
          color: isOpen ? '#fff' : '#f1f5f9',
          border: '1px solid #2a2a3a',
          padding: '0.6rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s'
        }}
      >
        <span>Todas as Categorias</span>
        <svg 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          left: 0,
          width: '600px',
          maxWidth: '90vw',
          background: '#161622',
          border: '1px solid #2a2a3a',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          padding: '1.5rem',
          zIndex: 100,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Categorias */}
          <div>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid #2a2a3a', paddingBottom: '0.5rem' }}>
              Por Produto
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/categoria/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    textDecoration: 'none', color: '#f1f5f9', fontSize: '0.9rem',
                    padding: '0.4rem 0.5rem', borderRadius: '0.4rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#1a1a2a'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{cat.icon}</span> {cat.name}
                  </span>
                  <span style={{ fontSize: '0.75rem', background: '#2a2a3a', padding: '0.1rem 0.4rem', borderRadius: '1rem', color: '#94a3b8' }}>
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Lojas */}
          <div>
            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid #2a2a3a', paddingBottom: '0.5rem' }}>
              Por Loja
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {stores.length > 0 ? stores.map(store => (
                <Link 
                  key={store.id} 
                  href={`/?store=${store.slug}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    textDecoration: 'none', color: '#f1f5f9', fontSize: '0.9rem',
                    padding: '0.4rem 0.5rem', borderRadius: '0.4rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#1a1a2a'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>{store.name}</span>
                  <span style={{ fontSize: '0.75rem', background: '#2a2a3a', padding: '0.1rem 0.4rem', borderRadius: '1rem', color: '#94a3b8' }}>
                    {store.count}
                  </span>
                </Link>
              )) : (
                <div style={{ fontSize: '0.85rem', color: '#64748b', padding: '0.5rem' }}>Nenhuma oferta ativa no momento.</div>
              )}
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}} />
        </div>
      )}
    </div>
  )
}
