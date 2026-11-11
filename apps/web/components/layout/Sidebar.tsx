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
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      {/* Card Alertas VIP WhatsApp e Telegram 2027 */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        borderColor: 'rgba(249, 115, 22, 0.35)',
        borderRadius: 'var(--radius)',
        padding: '1.35rem',
        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '0.5rem',
            background: 'rgba(249, 115, 22, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}>
            ⚡
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#ffffff', letterSpacing: '-0.01em' }}>
              Alertas VIP no Telemóvel
            </h3>
            <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700, fontFamily: 'monospace' }}>
              ● GRÁTIS EM TEMPO REAL
            </span>
          </div>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.5 }}>
          Erros de preço e cupões relâmpago da Amazon, Worten e Fnac antes que esgotem.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <a
            href="/entrar?canal=whatsapp"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff', padding: '0.6rem', borderRadius: '0.6rem',
              textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem',
              boxShadow: '0 3px 12px rgba(16, 185, 129, 0.35)',
              transition: 'transform 0.15s ease',
            }}
          >
            💬 Grupo VIP WhatsApp
          </a>
          <a
            href="https://t.me/radarofertaspt"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff', padding: '0.6rem', borderRadius: '0.6rem',
              textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem',
              boxShadow: '0 3px 12px rgba(2, 132, 199, 0.35)',
              transition: 'transform 0.15s ease',
            }}
          >
            ✈️ Canal Telegram Oficial
          </a>
        </div>
      </div>

      {/* Pesquisar HUD */}
      <div className="glass-card" style={{ borderRadius: 'var(--radius)', padding: '1.15rem' }}>
        <h3 style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.75rem', fontFamily: 'monospace' }}>
          FILTRO RÁPIDO
        </h3>
        <form action="/pesquisa" method="get" style={{ display: 'flex', gap: '0.45rem' }}>
          <input
            type="search"
            name="q"
            placeholder="O que procuras?"
            style={{
              flex: 1, padding: '0.55rem 0.75rem', borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(255, 255, 255, 0.04)',
              color: '#f8fafc', fontSize: '0.85rem', outline: 'none',
            }}
          />
          <button type="submit" className="cyber-cta" style={{
            padding: '0.55rem 0.95rem', borderRadius: '0.5rem', border: 'none',
            color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
          }}>
            Buscar
          </button>
        </form>
      </div>

      {/* Comentários recentes da Comunidade */}
      {comments.length > 0 && (
        <div className="glass-card" style={{ borderRadius: 'var(--radius)', padding: '1.15rem' }}>
          <h3 style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.85rem', fontFamily: 'monospace' }}>
            ATIVIDADE DA COMUNIDADE
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {comments.map(comment => (
              <Link
                key={comment.id}
                href={`/oferta/${comment.offer.slug}`}
                style={{ display: 'flex', gap: '0.65rem', textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  width: '42px', height: '42px', flexShrink: 0, borderRadius: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {comment.offer.imageUrl ? (
                    <img src={comment.offer.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : '📦'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.78rem', color: '#f8fafc', lineHeight: 1.3 }}>
                    <strong style={{ color: '#fb923c' }}>{comment.name}</strong> em {truncate(comment.offer.title, 32)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginBottom: '0.15rem', fontFamily: 'monospace' }}>
                    {formatTimeAgo(comment.createdAt)}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    «{comment.content}»
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categorias HUD */}
      {categories.length > 0 && (
        <div className="glass-card" style={{ borderRadius: 'var(--radius)', padding: '1.15rem' }}>
          <h3 style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', marginBottom: '0.75rem', fontFamily: 'monospace' }}>
            CATEGORIAS
          </h3>
          <CategorySelect categories={categories as any} />
        </div>
      )}
    </aside>
  )
}
