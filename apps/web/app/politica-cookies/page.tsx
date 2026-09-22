import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Cookies | RadarOfertas',
  description: 'Saiba como o RadarOfertas utiliza cookies para melhorar a sua experiência, gerir preferências, medir audiência e veicular publicidade em conformidade com o RGPD e a Diretiva ePrivacy.',
  alternates: {
    canonical: 'https://radarofertas-psi.vercel.app/politica-cookies',
  },
}

export default function PoliticaCookiesPage() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '860px' }}>
      <div style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Transparência & Gestão de Consentimento
        </span>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem', marginBottom: '0.75rem', lineHeight: 1.2 }}>
          Política de Cookies
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.95rem' }}>
          Em conformidade com a Diretiva 2002/58/CE (Diretiva Privacidade Eletrónica / ePrivacy) e o Regulamento (UE) 2016/679 (RGPD).
        </p>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
          <em>Última atualização: 22 de Setembro de 2026</em>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: '1.7', color: 'var(--foreground)' }}>
        
        {/* 1. O que são Cookies */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            1. O que são Cookies?
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Cookies são pequenos ficheiros de texto armazenados no seu computador, smartphone ou tablet pelo navegador web quando visita um website. Estes ficheiros permitem ao website reconhecer o seu dispositivo em visitas subsequentes, recordar as suas preferências de navegação (como modo escuro ou filtros) e garantir o funcionamento correto de funcionalidades essenciais.
          </p>
        </section>

        {/* 2. Categorias de Cookies Usados */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            2. Tipologia de Cookies Utilizados no RadarOfertas
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
            O RadarOfertas classifica os cookies utilizados nas seguintes categorias rigorosas:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Categoria 1 */}
            <div style={{ padding: '1.25rem', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--foreground)', fontSize: '1.05rem' }}>🟢 1. Cookies Estritamente Necessários (Essenciais)</strong>
                <span style={{ fontSize: '0.75rem', background: '#16a34a', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>Sempre Ativos</span>
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: 0 }}>
                São indispensáveis para o funcionamento básico do website, garantindo navegação segura, balanceamento de carga, carregamento de páginas e armazenamento da sua decisão de consentimento de cookies. Não recolhem informações para fins de marketing e não podem ser desativados nos nossos sistemas.
              </p>
            </div>

            {/* Categoria 2 */}
            <div style={{ padding: '1.25rem', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--foreground)', fontSize: '1.05rem' }}>📊 2. Cookies de Estatística e Desempenho (Analíticos)</strong>
                <span style={{ fontSize: '0.75rem', background: 'var(--muted)', color: 'var(--foreground)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Requer Consentimento</span>
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: 0 }}>
                Permitem-nos contar visitas e fontes de tráfego para que possamos medir e melhorar o desempenho da plataforma. Usamos o <strong>Google Analytics 4</strong> com anonimização de IP ativada. Toda a informação recolhida é agregada e tratada de forma anónima.
              </p>
            </div>

            {/* Categoria 3 */}
            <div style={{ padding: '1.25rem', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--foreground)', fontSize: '1.05rem' }}>📢 3. Cookies de Publicidade e Personalização (Google AdSense)</strong>
                <span style={{ fontSize: '0.75rem', background: 'var(--muted)', color: 'var(--foreground)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Requer Consentimento</span>
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: 0 }}>
                Configurados através do nosso site por parceiros de publicidade certificados (Google AdSense). Podem ser utilizados para criar um perfil dos seus interesses e mostrar anúncios relevantes noutros websites. Não armazenam diretamente informações pessoais confidenciais, baseando-se na identificação exclusiva do seu navegador e dispositivo de Internet.
              </p>
            </div>

            {/* Categoria 4 */}
            <div style={{ padding: '1.25rem', background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--foreground)', fontSize: '1.05rem' }}>🛒 4. Cookies Técnicos de Programas de Afiliados</strong>
                <span style={{ fontSize: '0.75rem', background: 'var(--muted)', color: 'var(--foreground)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>Funcionais de Parceria</span>
              </div>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: 0 }}>
                Ao clicar numa oferta do RadarOfertas para aceder a uma loja parceira (como Amazon, Awin ou Impact), é gravado um identificador técnico para validar que a compra proveio do RadarOfertas, permitindo-nos receber a comissão sem qualquer custo extra para o consumidor.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Tabela Detalhada de Cookies */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            3. Tabela de Cookies Mais Frequentes
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--muted)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem' }}>Cookie</th>
                  <th style={{ padding: '0.75rem' }}>Fornecedor</th>
                  <th style={{ padding: '0.75rem' }}>Finalidade</th>
                  <th style={{ padding: '0.75rem' }}>Duração</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--muted-foreground)' }}>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--foreground)' }}>radarofertas_cookie_consent</td>
                  <td style={{ padding: '0.75rem' }}>RadarOfertas</td>
                  <td style={{ padding: '0.75rem' }}>Regista a opção de consentimento do utilizador no banner.</td>
                  <td style={{ padding: '0.75rem' }}>12 meses</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--foreground)' }}>_ga, _ga_*</td>
                  <td style={{ padding: '0.75rem' }}>Google Analytics</td>
                  <td style={{ padding: '0.75rem' }}>Distingue utilizadores únicos para gerar relatórios estatísticos de uso.</td>
                  <td style={{ padding: '0.75rem' }}>2 anos</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: 'var(--foreground)' }}>IDE, __gads, DSID</td>
                  <td style={{ padding: '0.75rem' }}>Google AdSense / DoubleClick</td>
                  <td style={{ padding: '0.75rem' }}>Utilizado para veiculação de anúncios direcionados e controlo de frequência de exibição.</td>
                  <td style={{ padding: '0.75rem' }}>13 meses</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Como Gerir ou Desativar Cookies */}
        <section style={{ background: 'var(--muted)', padding: '1.5rem', borderRadius: 'var(--radius)' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--foreground)' }}>
            4. Como pode gerir ou revogar o seu consentimento?
          </h2>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
            Pode a qualquer momento alterar as suas preferências de cookies no nosso website ou configurar o seu próprio navegador de internet para recusar ou apagar cookies armazenados:
          </p>
          <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/pt-PT/kb/ativar-e-desativar-cookies-que-os-websites-utilizam" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/pt-pt/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/pt-pt/windows/eliminar-e-gerir-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Microsoft Edge</a></li>
          </ul>
        </section>

        {/* 5. Contacto */}
        <section>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
            5. Dúvidas e Mais Informações
          </h2>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Para mais detalhes sobre o tratamento de dados pessoais no RadarOfertas, consulte a nossa <Link href="/privacidade" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Política de Privacidade (RGPD)</Link> ou entre em contacto com a nossa equipa através do endereço: <a href="mailto:privacidade@radarofertas.pt" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>privacidade@radarofertas.pt</a>.
          </p>
        </section>

      </div>
    </div>
  )
}
