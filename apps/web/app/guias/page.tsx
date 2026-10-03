import { getArticles } from '@/lib/api'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guias e Dicas de Compras',
  description: 'Descobre os melhores guias de compras, tutoriais e dicas para poupar dinheiro em Portugal.',
}

export const revalidate = 3600

export default async function GuiasPage() {
  const { data: publishedArticles } = await getArticles()

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Guias e Dicas de Compras</h1>
      <p style={{ color: 'var(--muted-foreground)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
        Tudo o que precisas de saber para tomar as melhores decisões e poupar ao máximo.
      </p>

      {publishedArticles.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
          Em breve teremos novos guias e artigos publicados! Fica atento.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {publishedArticles.map((article) => (
            <Link key={article.id} href={`/guias/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div 
                className="group relative flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {article.coverImage ? (
                  <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--muted)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={article.coverImage} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '3rem' }}>📝</span>
                  </div>
                )}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {article.title}
                  </h2>
                  <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {/* Extrair um trecho do conteúdo removendo markdown basico */}
                    {article.content.replace(/[#*`_\[\]]/g, '').slice(0, 150)}...
                  </p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '1rem' }}>
                    {new Date(article.createdAt || '').toLocaleDateString('pt-PT')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
