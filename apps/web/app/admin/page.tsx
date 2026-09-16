'use client'

import { useState } from 'react'

interface OfferForm {
  title: string
  storeId: string
  priceCurrent: string
  priceOriginal: string
  affiliateUrl: string
  imageUrl: string
  description: string
  couponCode: string
  categoryIds: string
}

const STORES = [
  { id: 1, name: 'Amazon' },
  { id: 2, name: 'Prozis' },
  { id: 3, name: 'Zumub' },
  { id: 4, name: 'Worten' },
  { id: 5, name: 'PCDIGA' },
  { id: 6, name: 'Fnac' },
]

const CATEGORIES = [
  { id: 1, name: '🕹️ Gaming' },
  { id: 2, name: '🎮 Consolas' },
  { id: 3, name: '🕹️ Jogos' },
  { id: 4, name: '⌨️ Periféricos' },
  { id: 5, name: '🏡 Casa & Electrodomésticos' },
  { id: 6, name: '🤖 Robots de Limpeza' },
  { id: 7, name: '🍟 Air Fryers' },
  { id: 8, name: '💪 Suplementação' },
  { id: 9, name: '🥛 Proteínas' },
  { id: 10, name: '💊 Vitaminas & Minerais' },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const ADMIN_KEY = 'radar_admin_secret_change_in_production'

export default function AdminPage() {
  const [form, setForm] = useState<OfferForm>({
    title: '', storeId: '1', priceCurrent: '', priceOriginal: '',
    affiliateUrl: '', imageUrl: '', description: '', couponCode: '', categoryIds: '1',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)
  const [tab, setTab] = useState<'criar' | 'listar'>('criar')
  const [offers, setOffers] = useState<any[]>([])
  const [loadingOffers, setLoadingOffers] = useState(false)

  function set(field: keyof OfferForm, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const payload = {
        title: form.title,
        storeId: parseInt(form.storeId),
        priceCurrent: parseFloat(form.priceCurrent),
        priceOriginal: parseFloat(form.priceOriginal) || undefined,
        affiliateUrl: form.affiliateUrl,
        imageUrl: form.imageUrl || undefined,
        description: form.description || undefined,
        couponCode: form.couponCode || undefined,
        categoryIds: form.categoryIds.split(',').map(s => parseInt(s.trim())).filter(Boolean),
      }
      const res = await fetch(`${API_URL}/api/admin/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        setResult({ ok: true, msg: `✅ Oferta criada! Deal Score: ${data.data?.dealScore}/100` })
        setForm({ title: '', storeId: '1', priceCurrent: '', priceOriginal: '', affiliateUrl: '', imageUrl: '', description: '', couponCode: '', categoryIds: '1' })
      } else {
        setResult({ ok: false, msg: `❌ Erro: ${data.error || res.statusText}` })
      }
    } catch (err: any) {
      setResult({ ok: false, msg: `❌ Erro de ligação: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  async function loadOffers() {
    setLoadingOffers(true)
    try {
      const res = await fetch(`${API_URL}/api/offers?limit=50`)
      const data = await res.json()
      setOffers(data.data || [])
    } catch {
      setOffers([])
    } finally {
      setLoadingOffers(false)
    }
  }

  async function deleteOffer(id: number, title: string) {
    if (!confirm(`Apagar "${title}"?`)) return
    await fetch(`${API_URL}/api/admin/offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
      body: JSON.stringify({ status: 'deleted' }),
    })
    loadOffers()
  }

  const fieldStyle = {
    width: '100%', padding: '0.6rem 0.75rem',
    border: '1px solid var(--border)', borderRadius: '0.5rem',
    background: 'var(--muted)', color: 'var(--foreground)', fontSize: '0.9rem',
  }
  const labelStyle = { display: 'block', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.25rem', color: 'var(--muted-foreground)' }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🔧</span>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Painel Admin</h1>
        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', background: '#dc2626', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
          DEV ONLY
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['criar', 'listar'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); if (t === 'listar') loadOffers() }}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.9rem',
              border: 'none', cursor: 'pointer',
              background: tab === t ? 'var(--primary)' : 'var(--muted)',
              color: tab === t ? '#fff' : 'var(--foreground)',
            }}>
            {t === 'criar' ? '➕ Nova Oferta' : '📋 Listar Ofertas'}
          </button>
        ))}
      </div>

      {/* Criar oferta */}
      {tab === 'criar' && (
        <div style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
              {/* Título */}
              <div>
                <label style={labelStyle}>TÍTULO *</label>
                <input required value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="Ex: Sony PlayStation 5 Slim Digital Edition" style={fieldStyle} />
              </div>

              {/* Loja + Categorias */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>LOJA *</label>
                  <select value={form.storeId} onChange={e => set('storeId', e.target.value)} style={fieldStyle}>
                    {STORES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>CATEGORIAS (IDs separados por vírgula)</label>
                  <input value={form.categoryIds} onChange={e => set('categoryIds', e.target.value)}
                    placeholder="1,2" style={fieldStyle} />
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>
                    {CATEGORIES.map(c => `${c.id}=${c.name.split(' ')[1]}`).join(' · ')}
                  </div>
                </div>
              </div>

              {/* Preços */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>PREÇO ATUAL (€) *</label>
                  <input required type="number" step="0.01" min="0" value={form.priceCurrent}
                    onChange={e => set('priceCurrent', e.target.value)} placeholder="349.99" style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>PREÇO ORIGINAL (€)</label>
                  <input type="number" step="0.01" min="0" value={form.priceOriginal}
                    onChange={e => set('priceOriginal', e.target.value)} placeholder="449.99" style={fieldStyle} />
                </div>
              </div>

              {/* URL Afiliado */}
              <div>
                <label style={labelStyle}>URL AFILIADO *</label>
                <input required value={form.affiliateUrl} onChange={e => set('affiliateUrl', e.target.value)}
                  placeholder="https://www.amazon.es/dp/B0CL5KNB9M?tag=radarofertas-21" style={fieldStyle} />
              </div>

              {/* Imagem */}
              <div>
                <label style={labelStyle}>URL DA IMAGEM</label>
                <input value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)}
                  placeholder="https://m.media-amazon.com/images/..." style={fieldStyle} />
              </div>

              {/* Cupão */}
              <div>
                <label style={labelStyle}>CÓDIGO DE CUPÃO</label>
                <input value={form.couponCode} onChange={e => set('couponCode', e.target.value)}
                  placeholder="RADAROFERTAS" style={fieldStyle} />
              </div>

              {/* Descrição */}
              <div>
                <label style={labelStyle}>DESCRIÇÃO</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={3} placeholder="Breve descrição do produto..." style={{ ...fieldStyle, resize: 'vertical' }} />
              </div>
            </div>

            {/* Resultado */}
            {result && (
              <div style={{
                padding: '0.75rem 1rem', borderRadius: '0.5rem',
                background: result.ok ? '#dcfce7' : '#fee2e2',
                color: result.ok ? '#166534' : '#991b1b',
                fontWeight: 600, fontSize: '0.9rem',
              }}>
                {result.msg}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              padding: '0.75rem', background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)', fontWeight: 700,
              fontSize: '1rem', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? '⏳ A criar...' : '➕ Criar Oferta'}
            </button>
          </form>
        </div>
      )}

      {/* Listar ofertas */}
      {tab === 'listar' && (
        <div>
          {loadingOffers ? (
            <p style={{ color: 'var(--muted-foreground)' }}>A carregar...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                    {['ID', 'Título', 'Loja', 'Preço', 'Score', 'Estado', 'Ações'].map(h => (
                      <th key={h} style={{ padding: '0.6rem 0.75rem', fontWeight: 700, color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {offers.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--muted-foreground)' }}>{o.id}</td>
                      <td style={{ padding: '0.6rem 0.75rem', maxWidth: '300px' }}>
                        <a href={`/oferta/${o.slug}`} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                          {o.title.length > 50 ? o.title.slice(0, 50) + '…' : o.title}
                        </a>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{o.store?.name}</td>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>€{parseFloat(o.priceCurrent).toFixed(2)}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span style={{
                          background: parseFloat(o.dealScore) >= 65 ? '#16a34a' : parseFloat(o.dealScore) >= 45 ? '#d97706' : '#6b7280',
                          color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
                        }}>{Math.round(parseFloat(o.dealScore))}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span style={{ color: o.status === 'active' ? '#16a34a' : '#6b7280' }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <button onClick={() => deleteOffer(o.id, o.title)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem' }}
                          title="Apagar">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {offers.length === 0 && (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>Sem ofertas.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
