export const metadata = {
  title: 'Política de Privacidade | RadarOfertas',
  description: 'Política de Privacidade e proteção de dados do RadarOfertas (RGPD).',
}

export default function Privacidade() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Política de Privacidade (RGPD)</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6', color: 'var(--muted-foreground)' }}>
        <p>A sua privacidade é importante para nós. É política do <strong>RadarOfertas</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos recolher no nosso site.</p>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>1. Recolha e Tratamento de Dados (RGPD)</h2>
        <p>Solicitamos informações pessoais, como o seu endereço de email, apenas quando é estritamente necessário para lhe fornecer um serviço (ex: subscrição da Newsletter). Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento expresso.</p>
        
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>2. Retenção de Dados</h2>
        <p>Apenas retemos as informações recolhidas pelo tempo necessário para fornecer o serviço solicitado. Os dados que armazenamos são protegidos dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>3. Partilha de Dados e Terceiros</h2>
        <p>Não partilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. Utilizamos ferramentas de análise de tráfego, como o <strong>Google Analytics</strong>, que recolhem dados anónimos sobre a sua navegação para nos ajudar a melhorar a plataforma.</p>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>4. Links de Afiliados e Cookies de Terceiros</h2>
        <p>O RadarOfertas atua como um agregador de promoções. Quando clica numa oferta (ex: Amazon), será redirecionado para o site da loja. Essas lojas utilizam os seus próprios cookies para rastrear a origem da visita (programa de afiliados). Recomendamos a leitura da política de privacidade dessas mesmas lojas.</p>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>5. Os Seus Direitos</h2>
        <p>Ao abrigo do Regulamento Geral de Proteção de Dados (RGPD), tem o direito de solicitar o acesso, retificação, apagamento ("direito ao esquecimento") ou limitação do tratamento dos seus dados pessoais. Para cancelar a sua subscrição da Newsletter ou exercer estes direitos, contacte-nos ou clique no link de cancelamento presente nos nossos emails.</p>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--foreground)', marginTop: '1rem' }}>6. Consentimento</h2>
        <p>O uso continuado do nosso site será considerado como aceitação das nossas práticas em torno de privacidade e informações pessoais. Se tiver alguma dúvida sobre como lidamos com os dados do utilizador, entre em contacto connosco.</p>
        
        <p style={{ marginTop: '2rem', fontSize: '0.85rem' }}><em>Última atualização: Setembro de 2026</em></p>
      </div>
    </div>
  )
}
