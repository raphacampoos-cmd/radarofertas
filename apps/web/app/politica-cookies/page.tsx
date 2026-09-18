import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies',
}

export default function CookiesPolicy() {
  return (
    <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Política de Cookies</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: 1.8, color: 'var(--muted-foreground)' }}>
        <p>Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos ficheiros descarregados para o seu computador, para melhorar a sua experiência.</p>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginTop: '1rem' }}>1. O que são cookies?</h2>
        <p>Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando acede à maioria dos websites na internet. Eles permitem que o website se lembre das suas ações e preferências.</p>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginTop: '1rem' }}>2. Como usamos os cookies?</h2>
        <p>Utilizamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão da indústria para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site.</p>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginTop: '1rem' }}>3. Cookies que definimos</h2>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>Cookies de preferências do site:</strong> Para proporcionar uma ótima experiência neste site, fornecemos a funcionalidade para definir as suas preferências de como este site é executado quando o usa. Por exemplo, salvar a sua escolha sobre fechar widgets ou banners (como o de cookies ou Telegram).</li>
          <li><strong>Cookies de estatísticas/análise:</strong> Usamos o Google Analytics, uma das soluções de análise mais difundidas e confiáveis ​​da Web, para nos ajudar a entender como usa o site e como podemos melhorar a sua experiência.</li>
          <li><strong>Cookies de Afiliados:</strong> Quando clica numa oferta, redes de afiliados (como Awin ou Amazon) podem definir cookies para registar que a visita teve origem no nosso site, permitindo-nos receber uma comissão se efetuar uma compra.</li>
        </ul>
        
        <h2 style={{ fontSize: '1.5rem', color: 'var(--foreground)', marginTop: '1rem' }}>4. Desativar Cookies</h2>
        <p>Pode impedir a configuração de cookies ajustando as configurações do seu navegador (consulte a Ajuda do navegador para saber como fazer isso). Esteja ciente de que a desativação de cookies afetará a funcionalidade deste e de muitos outros sites que visita.</p>
      </div>
    </div>
  )
}
