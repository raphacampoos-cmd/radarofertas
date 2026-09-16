import Link from 'next/link'
import { Logo } from '../ui/Logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      background: 'var(--card)',
      borderTop: '1px solid var(--border)',
      marginTop: '4rem',
      padding: '3rem 0',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          {/* Logo e Missão */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Logo width={140} height={35} />
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', lineHeight: 1.6 }}>
              O teu radar diário para os melhores descontos e promoções em Portugal. Rastreamos as principais lojas para não pagares a mais.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Categorias</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/categoria/gaming" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.875rem' }}>Gaming & Consolas</Link></li>
              <li><Link href="/categoria/casa-electrodomesticos" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.875rem' }}>Casa & Eletrodomésticos</Link></li>
              <li><Link href="/categoria/suplementacao" style={{ color: 'var(--muted-foreground)', textDecoration: 'none', fontSize: '0.875rem' }}>Suplementação</Link></li>
            </ul>
          </div>

          {/* Informação */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Sobre o Site</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', cursor: 'pointer' }}>Como funciona</span></li>
              <li><span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', cursor: 'pointer' }}>Termos de Utilização</span></li>
              <li><span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', cursor: 'pointer' }}>Privacidade</span></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Afiliados e Copyright */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', maxWidth: '800px', lineHeight: 1.6 }}>
            <strong>Aviso de Transparência:</strong> O RadarOfertas participa em programas de afiliados (incluindo a Amazon EU Associates Programme). 
            Isto significa que recebemos uma pequena comissão nas compras qualificadas feitas através dos nossos links, <strong>sem qualquer custo extra para ti</strong>. 
            É isto que mantém o projeto vivo e 100% gratuito.
          </p>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            &copy; {currentYear} RadarOfertas. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
