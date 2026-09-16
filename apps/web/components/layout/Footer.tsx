import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--muted)',
      padding: '2rem 0',
      marginTop: '3rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          {/* Marca */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📡</span>
              <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>RadarOfertas</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
              Encontra as melhores ofertas em Portugal com histórico de preços real e Deal Score.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Categorias</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { name: '🕹️ Gaming', slug: 'gaming' },
                { name: '🏡 Casa', slug: 'casa' },
                { name: '💪 Suplementação', slug: 'suplementacao' },
              ].map(cat => (
                <li key={cat.slug}>
                  <Link href={`/categoria/${cat.slug}`} style={{
                    textDecoration: 'none',
                    color: 'var(--muted-foreground)',
                    fontSize: '0.85rem',
                  }}>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem' }}>Informação</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {[
                { name: 'Sobre Nós', href: '/sobre' },
                { name: 'Política de Privacidade', href: '/privacidade' },
                { name: 'Contacto', href: '/contacto' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} style={{
                    textDecoration: 'none',
                    color: 'var(--muted-foreground)',
                    fontSize: '0.85rem',
                  }}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer afiliados */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '1rem',
          fontSize: '0.75rem',
          color: 'var(--muted-foreground)',
          lineHeight: 1.6,
        }}>
          <p>
            © {year} RadarOfertas. Como participante do Programa de Associados da Amazon, recebemos comissões pelas compras qualificadas. 
            Os preços e disponibilidade podem variar após publicação. Sempre verifique o preço final na loja antes de comprar.
          </p>
        </div>
      </div>
    </footer>
  )
}
