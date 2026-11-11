import { getArticle } from '@/lib/api'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArticleImage } from '@/components/ui/ArticleImage'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const { data: article } = await getArticle(slug)
    if (!article) return { title: 'Artigo não encontrado' }
    
    const desc = article.content.substring(0, 160).replace(/[#*`_\[\]]/g, '').trim()
    const url = `https://radarofertas-psi.vercel.app/guias/${slug}`
    
    return {
      title: `${article.title} | RadarOfertas Guias`,
      description: desc,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: article.title,
        description: desc,
        url,
        images: article.coverImage ? [article.coverImage] : [],
        type: 'article',
        publishedTime: article.createdAt,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: desc,
        images: article.coverImage ? [article.coverImage] : [],
      },
    }
  } catch {
    return { title: 'Artigo não encontrado' }
  }
}

export default async function GuiaPage({ params }: PageProps) {
  const { slug } = await params
  
  let article
  try {
    const res = await getArticle(slug)
    article = res.data
  } catch {
    notFound()
  }

  if (!article || !article.published) {
    notFound()
  }

  const wordCount = article.content ? article.content.split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.content.substring(0, 160).replace(/[#*`_\[\]]/g, '').trim(),
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Organization',
      name: 'RadarOfertas',
      url: 'https://radarofertas-psi.vercel.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RadarOfertas',
      logo: {
        '@type': 'ImageObject',
        url: 'https://radarofertas-psi.vercel.app/opengraph-image.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://radarofertas-psi.vercel.app/guias/${slug}`,
    },
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '5rem', maxWidth: '860px', margin: '0 auto' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Breadcrumb HUD 2027 */}
      <nav style={{
        fontSize: '0.8rem',
        color: '#94a3b8',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        flexWrap: 'wrap',
      }}>
        <Link href="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Início</Link>
        <span>›</span>
        <Link href="/guias" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Guias</Link>
        <span>›</span>
        <span style={{ color: '#fb923c', fontWeight: 600 }}>{article.title}</span>
      </nav>

      {/* Capa com Moldura Glass */}
      <div style={{
        width: '100%',
        maxHeight: '420px',
        marginBottom: '2rem',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        background: '#090a14',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5)',
      }}>
        <ArticleImage src={article.coverImage} alt={article.title} />
      </div>

      {/* Header do Artigo */}
      <header style={{ marginBottom: '2.5rem' }}>
        {/* Pílula de telemetria */}
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
          <span style={{ fontFamily: 'monospace', color: '#e2e8f0' }}>GUIA ESPECIALIZADO</span>
          <span>•</span>
          <span>⏱️ {readingTime} min de leitura</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          fontWeight: 900,
          color: '#f8fafc',
          lineHeight: 1.2,
          letterSpacing: '-0.025em',
          marginBottom: '1rem',
        }}>
          {article.title}
        </h1>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.85rem',
          color: '#94a3b8',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <span>📅 Publicado a {new Date(article.createdAt || '').toLocaleDateString('pt-PT')}</span>
          <span>•</span>
          <span>✍️ Redação RadarOfertas</span>
        </div>
      </header>

      {/* Corpo do Artigo com Estilo Neon Obsidian */}
      <div 
        className="glass-card"
        style={{
          borderRadius: '1.25rem',
          padding: '2.5rem 2rem',
          fontSize: '1.1rem',
          lineHeight: 1.85,
          color: '#cbd5e1',
          marginBottom: '3rem',
        }}
      >
        {article.content.split('\n').map((paragraph: string, idx: number) => {
          if (!paragraph.trim()) return <br key={idx} />
          
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginTop: '2rem',
                marginBottom: '0.75rem',
              }}>
                {paragraph.replace('### ', '')}
              </h3>
            )
          }
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#f8fafc',
                marginTop: '2.5rem',
                marginBottom: '1rem',
                borderLeft: '3px solid #f97316',
                paddingLeft: '0.75rem',
              }}>
                {paragraph.replace('## ', '')}
              </h2>
            )
          }
          if (paragraph.startsWith('# ')) {
            return (
              <h1 key={idx} style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#f8fafc',
                marginTop: '3rem',
                marginBottom: '1rem',
              }}>
                {paragraph.replace('# ', '')}
              </h1>
            )
          }
          if (paragraph.startsWith('- ')) {
            return (
              <li key={idx} style={{
                marginLeft: '1.5rem',
                marginBottom: '0.5rem',
                color: '#e2e8f0',
              }}>
                {paragraph.replace('- ', '')}
              </li>
            )
          }
          
          return (
            <p key={idx} style={{ marginBottom: '1.35rem' }}>
              {paragraph}
            </p>
          )
        })}
      </div>

      {/* Caixa de Ação / Cross-sell 2027 */}
      <aside className="glass-card" style={{
        borderRadius: '1.25rem',
        padding: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
        border: '1px solid rgba(249, 115, 22, 0.25)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          Queres encontrar as melhores oportunidades agora?
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
          O nosso algoritmo rastreia centenas de lojas em tempo real e lista cupões com poupança direta no carrinho.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            className="cyber-cta"
            style={{
              textDecoration: 'none',
              color: '#fff',
              padding: '0.65rem 1.4rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.9rem',
            }}
          >
            🔥 Ver Ofertas em Tempo Real
          </Link>
          <Link
            href="/cupoes"
            style={{
              textDecoration: 'none',
              color: '#fbbf24',
              padding: '0.65rem 1.4rem',
              borderRadius: '9999px',
              background: 'rgba(251, 191, 36, 0.08)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              fontWeight: 800,
              fontSize: '0.9rem',
            }}
          >
            🎟️ Consultar Cupões Verificados
          </Link>
        </div>
      </aside>
    </div>
  )
}
