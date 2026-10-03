import { getArticle } from '@/lib/api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const { data: article } = await getArticle(slug)
    if (!article) return { title: 'Artigo não encontrado' }
    
    return {
      title: article.title,
      description: article.content.substring(0, 160).replace(/[#*`_\[\]]/g, ''),
      openGraph: {
        title: article.title,
        images: article.coverImage ? [article.coverImage] : [],
        type: 'article',
      }
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

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
        <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Início</a>
        {' › '}
        <a href="/guias" style={{ color: 'inherit', textDecoration: 'none' }}>Guias</a>
        {' › '}
        <span style={{ color: 'var(--foreground)' }}>{article.title}</span>
      </nav>

      {article.coverImage && (
        <div style={{ width: '100%', height: '350px', marginBottom: '2rem', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2 }}>
        {article.title}
      </h1>
      
      <div style={{ color: 'var(--muted-foreground)', marginBottom: '3rem', display: 'flex', gap: '1rem' }}>
        <span>Publicado a {new Date(article.createdAt || '').toLocaleDateString('pt-PT')}</span>
        <span>•</span>
        <span>Por RadarOfertas</span>
      </div>

      <div 
        className="prose prose-lg dark:prose-invert max-w-none"
        style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--foreground)' }}
      >
        {/* Simple markdown parsing for the AI generated content */}
        {article.content.split('\n').map((paragraph, idx) => {
          if (!paragraph.trim()) return <br key={idx} />
          
          if (paragraph.startsWith('### ')) {
            return <h3 key={idx} style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>{paragraph.replace('### ', '')}</h3>
          }
          if (paragraph.startsWith('## ')) {
            return <h2 key={idx} style={{ fontSize: '2rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem' }}>{paragraph.replace('## ', '')}</h2>
          }
          if (paragraph.startsWith('# ')) {
            return <h1 key={idx} style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '3rem', marginBottom: '1rem' }}>{paragraph.replace('# ', '')}</h1>
          }
          if (paragraph.startsWith('- ')) {
            return <li key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{paragraph.replace('- ', '')}</li>
          }
          
          return <p key={idx} style={{ marginBottom: '1.25rem' }}>{paragraph}</p>
        })}
      </div>
    </div>
  )
}
