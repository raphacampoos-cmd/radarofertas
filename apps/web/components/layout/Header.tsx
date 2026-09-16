import Link from 'next/link'
import { getCategories } from '@/lib/api'

export async function Header() {
  let categories = []
  try {
    const res = await getCategories()
    categories = res.data
  } catch {
    // se a API não está online, mostra header vazio
  }

  return (
    <header style={{
      background: 'var(--card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Barra principal */}
      <div className="container" style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📡</span>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '-0.02em',
            }}>
              RadarOfertas
            </span>
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
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  background: 'var(--muted)',
                  color: 'var(--foreground)',
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
          borderTop: '1px solid var(--border)',
          background: 'var(--muted)',
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
                background: 'var(--primary)',
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
                    color: 'var(--foreground)',
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
