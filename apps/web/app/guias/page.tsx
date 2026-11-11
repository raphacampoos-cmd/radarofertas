import { getArticles } from '@/lib/api'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArticleImage } from '@/components/ui/ArticleImage'

export const metadata: Metadata = {
  title: 'Guias e Dicas de Compras 2026 | RadarOfertas',
  description: 'Guias de compra especializados, análises comparativas e dicas algorítmicas para poupar dinheiro em Portugal.',
  openGraph: {
    title: 'Guias e Dicas de Compras | RadarOfertas',
    description: 'Análises aprofundadas para comprar com inteligência e poupar em tecnologia, eletrodomésticos e fitness.',
    url: 'https://radarofertas-psi.vercel.app/guias',
    type: 'website',
  },
  alternates: {
    canonical: 'https://radarofertas-psi.vercel.app/guias',
  },
}

export const revalidate = 3600

export default async function GuiasPage() {
  let publishedArticles: any[] = []
  try {
    const res = await getArticles()
    publishedArticles = res.data || []
  } catch {
    publishedArticles = []
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

      {/* Hero Command Center 2027 */}
      <section style={{
        position: 'relative',
        borderRadius: '1.25rem',
        padding: '2.5rem 2rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(24, 26, 45, 0.75) 0%, rgba(12, 13, 23, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
      }}>
        {/* Glow de fundo */}
        <div style={{
          position: 'absolute',
          top: '-25%',
          right: '-5%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.14) 0%, transparent 70%)',
          pointerEvents: 'none',
          borderRadius: '9999px',
        }} />

        {/* Pílula de Telemetria */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '1rem',
          fontSize: '0.75rem',
          color: '#94a3b8',
        }}>
          <span className="radar-beacon-dot" />
          <span style={{ fontFamily: 'monospace', letterSpacing: '0.05em', color: '#e2e8f0' }}>
            RADAR INTEL // GUIAS DE COMPRA
          </span>
          <span style={{
            background: 'rgba(249, 115, 22, 0.2)',
            color: '#fb923c',
            padding: '0.1rem 0.45rem',
            borderRadius: '9999px',
            fontSize: '0.7rem',
            fontWeight: 800,
          }}>
            {publishedArticles.length} GUIAS
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(1.85rem, 4vw, 2.5rem)',
          fontWeight: 900,
          letterSpacing: '-0.025em',
          color: '#f8fafc',
          marginBottom: '0.65rem',
        }}>
          Guias de Compra & <span className="gradient-text-orange">Análises de Poupança</span>
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#94a3b8',
          maxWidth: '650px',
          lineHeight: 1.6,
          margin: 0,
        }}>
          Análises aprofundadas, testes de produtos e dicas estratégicas para nunca mais comprares ao preço errado em Portugal.
        </p>
      </section>

      {/* Grelha de Artigos Bento 2027 */}
      {publishedArticles.length === 0 ? (
        <div className="glass-card" style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          borderRadius: 'var(--radius)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Novos Guias em Produção
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '450px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            A nossa equipa algorítmica está a sintetizar novos comparativos de mercado e guias de compra.
          </p>
          <Link
            href="/"
            className="cyber-cta"
            style={{
              textDecoration: 'none',
              color: '#fff',
              padding: '0.6rem 1.4rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            ← Ver Ofertas Ativas
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {publishedArticles.map((article) => {
            const cleanSnippet = article.content
              ? article.content.replace(/[#*`_\[\]]/g, '').slice(0, 140).trim()
              : ''
            return (
              <Link
                key={article.id}
                href={`/guias/${article.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article
                  className="glass-card"
                  style={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Capa */}
                  <div style={{
                    width: '100%',
                    height: '210px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#090a14',
                  }}>
                    <ArticleImage src={article.coverImage} alt={article.title} />
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      background: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      color: '#fb923c',
                    }}>
                      GUIA // ANÁLISE
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}>
                    <h2 style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: '#f8fafc',
                      lineHeight: 1.35,
                      marginBottom: '0.65rem',
                    }}>
                      {article.title}
                    </h2>
                    {cleanSnippet && (
                      <p style={{
                        fontSize: '0.86rem',
                        color: '#94a3b8',
                        lineHeight: 1.55,
                        marginBottom: '1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1,
                      }}>
                        {cleanSnippet}...
                      </p>
                    )}

                    {/* Rodapé do Card */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      marginTop: 'auto',
                      fontSize: '0.78rem',
                      color: '#64748b',
                    }}>
                      <span>
                        📅 {new Date(article.createdAt || '').toLocaleDateString('pt-PT')}
                      </span>
                      <span style={{ color: '#fb923c', fontWeight: 700 }}>
                        Ler Guia →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
