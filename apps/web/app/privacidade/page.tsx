import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade e Proteção de Dados (RGPD) | RadarOfertas',
  description: 'Conheça a Política de Privacidade do RadarOfertas em total conformidade com o Regulamento Geral de Proteção de Dados (RGPD) da União Europeia e diretrizes de publicidade da Google.',
  alternates: {
    canonical: 'https://radarofertas-psi.vercel.app/privacidade',
  },
}

export default function PrivacidadePage() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '860px' }}>
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Conformidade Legal & Transparência
        </span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Política de Privacidade (RGPD)
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>
          Em estrito cumprimento do Regulamento (UE) 2016/679 (Regulamento Geral sobre a Proteção de Dados — RGPD) e da Lei n.º 58/2019 de 8 de agosto (Legislação Portuguesa de Proteção de Dados).
        </p>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          <em>Última atualização: 22 de Setembro de 2026</em>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', color: 'var(--foreground)' }}>
        
        {/* 1. Responsável pelo Tratamento */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            1. Responsável pelo Tratamento dos Dados
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            A plataforma <strong>RadarOfertas</strong> (doravante designada por "RadarOfertas", "nós" ou "nosso"), acessível através do endereço web <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>radarofertas-psi.vercel.app</Link>, é a entidade responsável pela recolha e tratamento dos dados pessoais dos utilizadores nos termos do RGPD.
          </p>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
            Para qualquer questão relativa à proteção de dados ou para o exercício dos seus direitos legais, pode contactar o nosso Encarregado de Proteção de Dados / Suporte através do email: <a href="mailto:privacidade@radarofertas.pt" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>privacidade@radarofertas.pt</a> ou através do nosso canal oficial no Telegram <a href="https://t.me/radarofertaspt" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>@radarofertaspt</a>.
          </p>
        </section>

        {/* 2. Princípios e Dados Recolhidos */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            2. Que Dados Pessoais Recolhemos e Finalidades
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
            O RadarOfertas rege-se pelo princípio da <strong>minimização dos dados</strong> (Artigo 5.º, n.º 1, alínea c) do RGPD). Não recolhemos dados pessoais sensíveis, números de identificação fiscal, nem dados bancários ou cartões de crédito. Os dados recolhidos restringem-se a:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted-foreground)' }}>
            <li>
              <strong>Subscrição da Newsletter e Alertas de Preço:</strong> Quando subscreve voluntariamente os nossos alertas, recolhemos o seu endereço de correio eletrónico (email). <em>Finalidade:</em> Enviar comunicações periódicas sobre descontos relevantes, novos cupões e mínimos históricos detetados.
            </li>
            <li>
              <strong>Comentários e Votações na Comunidade:</strong> Ao comentar ou votar numa oferta ("Fixe" / "Terminado"), registamos o texto submetido e um identificador técnico anonimizado (hash criptográfico com salt do endereço IP) para prevenir votos fraudulentos ou spam.
            </li>
            <li>
              <strong>Dados Técnicos de Navegação:</strong> Informações técnicas transmitidas pelo seu navegador (endereço IP anonimizado, tipo de navegador, sistema operativo, páginas consultadas, tempo de visita e resolução de ecrã) através de cookies estritamente necessários e analíticos.
            </li>
          </ul>
        </section>

        {/* 3. Base Jurídica */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            3. Base Jurídica para o Tratamento (Artigo 6.º do RGPD)
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            O tratamento dos seus dados pessoais fundamenta-se nas seguintes bases legais:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
            <li><strong>Consentimento Livre e Informado (Alínea a):</strong> Para envio de newsletters, notificações por email e ativação de cookies analíticos e de publicidade personalizada.</li>
            <li><strong>Interesse Legítimo (Alínea f):</strong> Para garantir a segurança cibernética do site, prevenir ataques de negação de serviço (DDoS), combater fraudes em votações e melhorar a estabilidade da plataforma.</li>
            <li><strong>Cumprimento de Obrigações Legais (Alínea c):</strong> Sempre que exigido por autoridades judiciais ou administrativas competentes nos termos da lei portuguesa e da União Europeia.</li>
          </ul>
        </section>

        {/* 4. Google AdSense e Publicidade */}
        <section style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: 'var(--radius)', borderLeft: '4px solid var(--primary)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            4. Publicidade Google AdSense e Cookies de Terceiros
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
            Este website utiliza o <strong>Google AdSense</strong>, um serviço de veiculação de publicidade fornecido pela Google LLC ("Google") e parceiros certificados pelo IAB Europe Transparency and Consent Framework.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--muted-foreground)', fontSize: '0.92rem' }}>
            <p>
              • <strong>Utilização de Cookies de Publicidade:</strong> Fornecedores terceiros, incluindo a Google, utilizam cookies para veicular anúncios personalizados com base nas visitas anteriores do utilizador ao RadarOfertas ou a outros websites na Internet.
            </p>
            <p>
              • <strong>Cookies do Google e Parceiros:</strong> A utilização de cookies de publicidade permite à Google e aos respetivos parceiros veicular anúncios para os utilizadores com base nas visitas efetuadas a este e/ou a outros sites na Web.
            </p>
            <p>
              • <strong>Desativação da Personalização de Anúncios:</strong> O utilizador pode, em qualquer momento, desativar a personalização de publicidade acedendo às <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>Definições de Anúncios da Google</a>. Em alternativa, pode desativar o uso de cookies de fornecedores terceiros para publicidade personalizada através da plataforma internacional <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>aboutads.info</a> ou no portal europeu <a href="https://www.youronlinechoices.com/pt/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: 600 }}>Your Online Choices Portugal</a>.
            </p>
          </div>
        </section>

        {/* 5. Redes de Afiliados e Compras */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            5. Redes de Afiliados e Compras nas Lojas Parceiras
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            O RadarOfertas é uma plataforma independente de agregação e curadoria de descontos. Participamos nos principais programas de afiliação europeus, nomeadamente:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
            <li><strong>Amazon EU Associates Programme:</strong> Programa de afiliados oficial da Amazon para a União Europeia.</li>
            <li><strong>Awin AG:</strong> Rede global de afiliação regulamentada na UE.</li>
            <li><strong>Impact.com:</strong> Plataforma de parcerias e afiliação comercial.</li>
          </ul>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.75rem' }}>
            <strong>Como funciona:</strong> Ao clicar no botão "Ver Oferta", o utilizador é redirecionado diretamente para o website oficial da loja vendedora (ex: Amazon, Worten, Prozis, etc.). O processo de compra, faturação, envio e pagamento é realizado <em>exclusivamente</em> nos servidores da loja terceira. O RadarOfertas <strong>nunca tem acesso aos seus dados de pagamento ou morada</strong>. As redes de afiliação podem gravar um cookie técnico temporário no seu dispositivo apenas para identificar que o clique teve origem no RadarOfertas para fins de atribuição de comissão de referência.
          </p>
        </section>

        {/* 6. Google Analytics e Análise de Tráfego */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            6. Google Analytics e Medição de Audiência
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Utilizamos o <strong>Google Analytics 4 (GA4)</strong> para compreender como os utilizadores interagem com o website e melhorar continuamente a experiência de navegação. A recolha opera com <strong>anonimização de IP ativada por defeito</strong>, impedindo a identificação direta do utilizador. Pode consultar a política de privacidade e proteção de dados da Google em <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>policies.google.com/privacy</a>.
          </p>
        </section>

        {/* 7. Retenção e Conservação de Dados */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            7. Prazo de Retenção e Conservação dos Dados
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Conservamos os seus dados pessoais apenas pelo período estritamente necessário para as finalidades para as quais foram recolhidos:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>
            <li><strong>Dados de Subscrição da Newsletter:</strong> Mantidos até que o utilizador solicite o cancelamento da subscrição ou exerça o direito ao apagamento.</li>
            <li><strong>Logs Técnicos e de Segurança:</strong> Mantidos por um período máximo de 30 a 90 dias para efeitos de auditoria de integridade de sistemas informáticos.</li>
            <li><strong>Cookies:</strong> Conforme os prazos de validade especificados na nossa <Link href="/politica-cookies" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Política de Cookies</Link> (geralmente entre a sessão do navegador e até 12 meses).</li>
          </ul>
        </section>

        {/* 8. Direitos do Titular dos Dados */}
        <section style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            8. Os Seus Direitos ao Abrigo do RGPD
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
            Nos termos dos Artigos 15.º a 22.º do Regulamento Geral de Proteção de Dados, é-lhe garantido, a qualquer momento e de forma gratuita:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: '0.25rem' }}>Direito de Acesso:</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Obter a confirmação de quais os seus dados que estão a ser tratados e aceder a cópia dos mesmos.</span>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: '0.25rem' }}>Direito de Retificação:</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Solicitar a correção ou atualização de dados pessoais inexatos ou incompletos.</span>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: '0.25rem' }}>Direito ao Apagamento ("Esquecimento"):</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Solicitar a eliminação total e definitiva dos seus dados pessoais dos nossos registos.</span>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: '0.25rem' }}>Direito à Limitação e Oposição:</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Contestar o tratamento com base em interesse legítimo ou limitar a utilização temporária dos dados.</span>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: '0.25rem' }}>Direito à Portabilidade:</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Receber os seus dados num formato estruturado, de uso corrente e leitura automática.</span>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--background)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: '0.25rem' }}>Direito de Revogar o Consentimento:</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>Retirar o consentimento previamente prestado a qualquer altura, sem comprometer a licitude anterior.</span>
            </div>
          </div>
          <p style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
            Para exercer qualquer um dos seus direitos, basta enviar uma mensagem para <a href="mailto:privacidade@radarofertas.pt" style={{ color: 'var(--primary)', fontWeight: 600 }}>privacidade@radarofertas.pt</a>. Responderemos no prazo máximo legal de 30 dias.
          </p>
        </section>

        {/* 9. Autoridade de Controlo */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            9. Direito de Reclamação à Autoridade de Controlo
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Sem prejuízo de qualquer outra via de recurso administrativo ou judicial, o titular dos dados tem o direito de apresentar uma reclamação formal junto da autoridade de controlo competente em Portugal:
          </p>
          <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'var(--muted)', borderRadius: 'var(--radius)', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
            <strong>CNPD — Comissão Nacional de Proteção de Dados</strong><br />
            Av. D. Carlos I, 134 - 1.º, 1200-651 Lisboa, Portugal<br />
            Website: <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>www.cnpd.pt</a> · Telefone: (+351) 213 928 400
          </div>
        </section>

        {/* 10. Atualizações */}
        <section style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            O RadarOfertas reserva-se o direito de atualizar periodicamente a presente Política de Privacidade para refletir alterações normativas, jurisprudenciais ou operacionais. Quaisquer alterações substanciais serão comunicadas através de aviso visível no website.
          </p>
        </section>

      </div>
    </div>
  )
}
