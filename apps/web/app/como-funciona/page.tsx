import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Como Funciona | RadarOfertas PT',
  description: 'Descubra como calculamos o Deal Score do RadarOfertas para garantir que encontra sempre os melhores preços.',
}

export default function ComoFuncionaPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--foreground)' }}>
        Como funciona o <span style={{ color: 'var(--primary)' }}>RadarOfertas</span>
      </h1>

      <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>ℹ️</span> O que é o Deal Score RadarOfertas?
        </h2>
        <p style={{ lineHeight: 1.6, color: '#334155', marginBottom: '1rem' }}>
          O Deal Score é uma pontuação de <strong>0 a 100</strong> que ajuda a perceber, num único número, se uma oferta é realmente vantajosa. Quanto mais alto o score, maior a confiança de que se trata de um bom negócio no momento em que foi publicado.
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Como calculamos o score</h2>
        <p style={{ lineHeight: 1.6, color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
          O nosso motor de inteligência artificial analisa múltiplos fatores em tempo real de forma 100% imparcial:
        </p>

        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <strong>📉 Desconto face ao preço habitual (30%)</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>A descida percentual do preço em relação ao valor habitual (PVP) cobrado pela loja.</p>
          </li>
          <li style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <strong>📊 Histórico de preço do produto (40%)</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>Comparamos o preço atual não só com o mínimo histórico absoluto alguma vez registado (25%), mas também com a média do produto nos últimos 90 dias (15%).</p>
          </li>
          <li style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <strong>⭐ Fiabilidade da loja ou do parceiro (15%)</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>A reputação, velocidade de entrega e segurança da loja ou parceiro que está a vender o produto.</p>
          </li>
          <li style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <strong>⏳ Frescura da oferta (15%)</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>A urgência da promoção, o tempo restante até expirar ou a probabilidade de rutura de stock.</p>
          </li>
        </ul>
      </div>

      <div style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid #fcd34d' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#b45309' }}>O que o score não garante</h2>
        <p style={{ lineHeight: 1.6, color: '#92400e', margin: 0 }}>
          O Deal Score é uma ferramenta de orientação, calculada automaticamente, e não uma garantia. Preços e stock podem mudar sem aviso na loja de destino. Confirma sempre o preço final antes de comprar.
        </p>
      </div>
    </div>
  )
}
