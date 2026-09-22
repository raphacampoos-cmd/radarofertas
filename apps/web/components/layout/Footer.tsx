import Link from 'next/link'
import { ManageCookiesButton } from '@/components/ui/ManageCookiesButton'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer style={{
      background: '#0d0d14',
      borderTop: '1px solid #2a2a3a',
      marginTop: '4rem',
      padding: '3rem 0 0',
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
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f97316' }}>RADAR<span style={{ color: '#fff' }}>OFERTAS</span></span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              O teu radar diário para os melhores descontos e promoções em Portugal. Rastreamos as principais lojas para não pagares a mais.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#f97316' }}>Categorias</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/categoria/gaming" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Gaming & Consolas</Link></li>
              <li><Link href="/categoria/casa-electrodomesticos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Casa & Eletrodomésticos</Link></li>
              <li><Link href="/categoria/suplementacao" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Suplementação</Link></li>
            </ul>
          </div>

          {/* Comunidade */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#f97316' }}>Comunidade</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="https://chat.whatsapp.com/BBbFPE8rae60KUo7lynSnj" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>💬 Grupo de WhatsApp</a></li>
              <li><a href="https://t.me/radarofertaspt" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>✈️ Canal de Telegram</a></li>
              <li><a href="https://www.facebook.com/profile.php?id=61594332515982" target="_blank" rel="noopener noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>📘 Página Facebook</a></li>
            </ul>
          </div>

          {/* Informação */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: '#f97316' }}>Sobre o Site</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/como-funciona" style={{ color: '#94a3b8', fontSize: '0.875rem', textDecoration: 'none' }}>Como funciona</Link></li>
              <li><Link href="/termos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Termos de Utilização</Link></li>
              <li><Link href="/privacidade" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Política de Privacidade (RGPD)</Link></li>
              <li><Link href="/politica-cookies" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>Política de Cookies</Link></li>
              <li><ManageCookiesButton /></li>
            </ul>
          </div>
        </div>

        {/* Orange bar + Disclaimer */}
        <div style={{
          borderTop: '2px solid #f97316',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '800px', lineHeight: 1.6 }}>
            <strong style={{ color: '#94a3b8' }}>Aviso de Transparência:</strong> O RadarOfertas participa em programas de afiliados (incluindo a Amazon EU Associates Programme). 
            Isto significa que recebemos uma pequena comissão nas compras qualificadas feitas através dos nossos links, <strong style={{ color: '#94a3b8' }}>sem qualquer custo extra para ti</strong>.
          </p>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            &copy; {currentYear} RadarOfertas. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
