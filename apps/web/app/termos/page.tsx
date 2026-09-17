export const metadata = {
  title: 'Termos e Condições | RadarOfertas',
  description: 'Termos e condições de utilização do RadarOfertas.',
}

export default function Termos() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Termos e Condições</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6', color: 'var(--muted-foreground)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>1. Aceitação dos Termos</h2>
        <p>Ao aceder ao site <strong>RadarOfertas</strong>, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. Se não concordar com algum destes termos, está proibido de usar ou aceder a este site.</p>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>2. Natureza do Serviço</h2>
        <p>O RadarOfertas é uma plataforma informativa que agrega promoções e descontos disponíveis na internet. <strong>Não somos uma loja online</strong>. Não vendemos produtos, não processamos pagamentos e não gerimos envios ou garantias. Toda a transação comercial é feita diretamente no site da loja parceira (ex: Amazon, Worten, etc.).</p>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>3. Exatidão de Preços e Disponibilidade</h2>
        <p>Os preços, cupões e disponibilidade dos produtos são verificados no momento da publicação. No entanto, as lojas parceiras podem alterar os preços ou esgotar o stock a qualquer momento e sem aviso prévio. O RadarOfertas não garante que a oferta se mantenha ativa no momento do seu clique.</p>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>4. Transparência de Afiliados</h2>
        <p>Participamos em programas de afiliados, como o Programa de Afiliados da Amazon EU e outros. Isto significa que, se clicar num dos nossos links e fizer uma compra, poderemos receber uma pequena comissão da loja, <strong>sem qualquer custo adicional para si</strong>. Isto é o que permite manter a plataforma gratuita.</p>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>5. Isenção de Responsabilidade</h2>
        <p>Os materiais no site do RadarOfertas são fornecidos "como estão". Não oferecemos garantias quanto à qualidade dos produtos comprados em sites de terceiros, falhas de entrega ou problemas de serviço pós-venda. Qualquer litígio deverá ser resolvido com a loja onde a compra foi efetuada.</p>
        
        <p style={{ marginTop: '2rem', fontSize: '0.85rem' }}><em>Última atualização: Setembro de 2026</em></p>
      </div>
    </div>
  )
}
