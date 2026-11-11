import Link from 'next/link'
import { getCategories } from '@/lib/api'
import type { Category, Store } from '@/lib/types'
import { CategoryDropdown } from './CategoryDropdown'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

export async function Header() {
  let categories: Category[] = []
  let stores: Store[] = []
  try {
    const res = await getCategories()
    if (res?.data) {
      categories = (res.data.categories || []).filter((c: any) => c.count > 0)
      stores = res.data.stores || []
    }
  } catch {}

  return (
    <header className="glass-hud" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Micro-telemetria superior HUD */}
      <div style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '0.25rem 1rem',
        fontSize: '0.72rem',
        color: '#94a3b8',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="radar-beacon-dot" />
              <strong style={{ color: '#10b981', letterSpacing: '0.04em', fontFamily: 'monospace' }}>RADAR IA 3.0</strong>
            </span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <span>1.626 ofertas ativas · Algoritmo anti-falsas promoções</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link
              href="https://t.me/radarofertaspt"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#38bdf8',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span>⚡ Alertas no Telegram</span>
              <span style={{ fontSize: '0.7rem' }}>↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Barra principal */}
      <div className="container" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Logo HUD */}
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              flexShrink: 0,
            }}
            aria-label="Página Inicial"
          >
            <div style={{
              width: '2.4rem',
              height: '2.4rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.05) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(249, 115, 22, 0.25)',
              fontSize: '1.25rem',
            }}>
              🎯
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  color: '#ffffff',
                }}>
                  RADAR<span style={{ color: '#f97316' }}>OFERTAS</span>
                </span>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '0.3rem',
                  background: 'rgba(249, 115, 22, 0.15)',
                  border: '1px solid rgba(249, 115, 22, 0.35)',
                  color: '#fb923c',
                }}>
                  2027
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.04em' }}>
                ALGORITMO DE POUPANÇA
              </span>
            </div>
          </Link>

          {/* Pesquisa Holográfica Capsule */}
          <form action="/pesquisa" method="get" style={{ flex: 1, maxWidth: '34rem' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              padding: '0.2rem 0.5rem 0.2rem 1rem',
              backdropFilter: 'blur(8px)',
            }}>
              <span style={{ color: '#94a3b8', marginRight: '0.5rem', fontSize: '0.9rem' }}>🔍</span>
              <input
                type="search"
                name="q"
                placeholder="Pesquisa com IA (ex: BioloMix, EarFun, Air Fryer, PS5)..."
                style={{
                  width: '100%',
                  padding: '0.45rem 0.5rem',
                  border: 'none',
                  background: 'transparent',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
              <span style={{
                fontSize: '0.68rem',
                fontFamily: 'monospace',
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.15rem 0.4rem',
                borderRadius: '0.35rem',
                marginRight: '0.25rem',
                whiteSpace: 'nowrap',
              }}>
                ↵ Enter
              </span>
              <button
                type="submit"
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: '9999px',
                  color: '#fff',
                  padding: '0.4rem 0.85rem',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(249, 115, 22, 0.3)',
                }}
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Ações rápidas */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0, marginLeft: 'auto' }}>
            <LanguageSelector />
            <a
              href="https://t.me/radarofertaspt"
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-cta"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.48rem 1rem',
                borderRadius: '9999px',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
              }}
              title="Alertas em direto no Telegram"
            >
              <span>⚡ Canal VIP</span>
            </a>
          </div>
        </div>
      </div>

      {/* Barra de categorias estilo Cyber-Pills */}
      {(categories.length > 0 || stores.length > 0) && (
        <nav style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(6, 7, 13, 0.75)',
          backdropFilter: 'blur(12px)',
        }}>
          <div className="container">
            <div className="category-bar" style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.35rem',
              padding: '0.45rem 1rem',
            }}>
              <Link href="/" style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: '#fff',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
              }}>
                ⭐ Destaques
              </Link>

              <Link href="/black-friday" style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                whiteSpace: 'nowrap',
              }}>
                🔥 Black Friday
              </Link>

              <Link href="/guias" className="glass-pill" style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#e2e8f0',
                whiteSpace: 'nowrap',
              }}>
                📚 Guias
              </Link>

              <Link href="/lojas" className="glass-pill" style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#e2e8f0',
                whiteSpace: 'nowrap',
              }}>
                🏬 Lojas
              </Link>

              {/* Categorias do catálogo */}
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className="glass-pill"
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#94a3b8',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}

              <CategoryDropdown categories={categories as any} stores={stores as any} />
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
