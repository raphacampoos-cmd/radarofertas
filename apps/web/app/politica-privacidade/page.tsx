import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
}

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Política de Privacidade</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.8, color: 'var(--muted-foreground)' }}>
        <p>A sua privacidade é importante para nós. É política do RadarOfertas respeitar a sua privacidade em relação a qualquer informação sua que possamos recolher no site RadarOfertas, e noutros sites que possuímos e operamos.</p>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginTop: '1rem' }}>1. Recolha de Informação</h2>
        <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos a recolher e como será usado.</p>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginTop: '1rem' }}>2. Uso de Informação</h2>
        <p>Apenas retemos as informações recolhidas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginTop: '1rem' }}>3. Partilha de Informação</h2>
        <p>Não partilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. O nosso site pode ter links para sites externos (como Amazon ou parceiros Awin) que não são operados por nós. Esteja ciente de que não temos controlo sobre o conteúdo e práticas desses sites.</p>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginTop: '1rem' }}>4. Os Seus Direitos</h2>
        <p>É livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.</p>
        
        <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>Esta política é efetiva a partir de Janeiro de 2024.</p>
      </div>
    </div>
  )
}
