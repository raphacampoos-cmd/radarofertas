import Link from 'next/link'
import { getRecentComments, getCategories } from '@/lib/api'
import { formatTimeAgo, truncate } from '@/lib/utils'
import { CategorySelect } from './CategorySelect'

export async function Sidebar() {
  let comments: Awaited<ReturnType<typeof getRecentComments>>['data'] = []
  let categories: Awaited<ReturnType<typeof getCategories>>['data']['categories'] = []

  try {
    const [commentsRes, catRes] = await Promise.all([
      getRecentComments(6),
      getCategories(),
    ])
    comments = commentsRes.data
    categories = catRes.data.categories.filter((c: any) => c.count > 0)
  } catch {}

  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Pesquisar */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
          PESQUISAR
        </h3>
        <form action="/pesquisa" method="get" style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="search"
            name="q"
            placeholder="O que procuras?"
            style={{
              flex: 1, padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
              border: '1px solid var(--border)', background: 'var(--muted)',
              color: 'var(--foreground)', fontSize: '0.85rem', outline: 'none',
            }}
          />
          <button type="submit" style={{
            padding: '0.6rem 1rem', borderRadius: '0.5rem', border: 'none',
            background: 'var(--primary)', color: '#fff', fontWeight: 700,
            fontSize: '0.85rem', cursor: 'pointer',
          }}>
            Pesquisar
          </button>
        </form>
      </div>

      {/* Comentários recentes */}
      {comments.length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
            COMENTÁRIOS RECENTES
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {comments.map(comment => (
              <Link
                key={comment.id}
                href={`/oferta/${comment.offer.slug}`}
                style={{ display: 'flex', gap: '0.6rem', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  width: '40px', height: '40px', flexShrink: 0, borderRadius: '0.5rem',
                  background: 'var(--muted)', overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {comment.offer.imageUrl ? (
                    <img src={comment.offer.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--foreground)' }}>
                    <strong>{comment.name}</strong> em <span style={{ color: 'var(--primary)' }}>{truncate(comment.offer.title, 40)}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginBottom: '0.2rem' }}>
                    {formatTimeAgo(comment.createdAt)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {comment.content}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categorias */}
      {categories.length > 0 && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--muted-foreground)', marginBottom: '0.75rem' }}>
            CATEGORIAS
          </h3>
          <CategorySelect categories={categories as any} />
        </div>
      )}
    </aside>
  )
}
