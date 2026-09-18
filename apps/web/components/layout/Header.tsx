import Link from 'next/link'
import { getCategories } from '@/lib/api'
import type { Category } from '@/lib/types'

export async function Header() {
  let categories: Category[] = []
  try {
    const res = await getCategories()
    categories = res.data
  } catch {}

  return (
    <header style={{
      background: 'linear-gradient(180deg, #161622 0%, #0d0d14 100%)',
      borderBottom: '1px solid #2a2a3a',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Barra principal */}
      <div className="container" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Logo text */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }} aria-label="Página Inicial">
            <span style={{ fontSize: '1.5rem' }}>🎯</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#f97316', letterSpacing: '-0.02em' }}>RADAR<span style={{ color: '#fff' }}>OFERTAS</span></span>
          </Link>

          {/* Pesquisa */}
          <form action="/pesquisa" method="get" style={{ flex: 1, maxWidth: '32rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="search"
                name="q"
                placeholder="Pesquisar ofertas..."
                style={{
                  width: '100%',
                  padding: '0.5rem 2.5rem 0.5rem 1rem',
                  border: '1px solid #2a2a3a',
                  borderRadius: '0.5rem',
                  background: '#1a1a2a',
                  color: '#f1f5f9',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button type="submit" style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
              }}>🔍</button>
            </div>
          </form>
        </div>
      </div>

      {/* Barra de categorias */}
      {categories.length > 0 && (
        <nav style={{
          borderTop: '1px solid #2a2a3a',
          background: '#1a1a2a',
          overflowX: 'auto',
        }}>
          <div className="container">
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              padding: '0.5rem 0',
              whiteSpace: 'nowrap',
            }}>
              <Link href="/" style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: '#f97316',
                color: '#fff',
              }}>
                🏠 Todas
              </Link>
              {categories.map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#94a3b8',
                  }}
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
