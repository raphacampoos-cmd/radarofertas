'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const ADMIN_KEY = 'radar_admin_secret_change_in_production'

export default function AdminDashboard() {
  const [tab, setTab] = useState<'overview' | 'ofertas' | 'criar' | 'subscritores'>('overview')
  const [stats, setStats] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tab === 'overview') loadStats()
    if (tab === 'ofertas') loadOffers()
    if (tab === 'subscritores') loadSubscribers()
  }, [tab])

  async function loadStats() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { 'X-Admin-Key': ADMIN_KEY }
      })
      const json = await res.json()
      setStats(json.data)
    } catch { }
    setLoading(false)
  }

  async function loadOffers() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/offers?limit=50`)
      const json = await res.json()
      setOffers(json.data || [])
    } catch { }
    setLoading(false)
  }

  async function loadSubscribers() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/subscribers`, {
        headers: { 'X-Admin-Key': ADMIN_KEY }
      })
      const json = await res.json()
      setSubscribers(json.data || [])
    } catch { }
    setLoading(false)
  }

  async function deleteOffer(id: number, title: string) {
    if (!confirm(`Tens a certeza que queres apagar "${title}"?`)) return
    await fetch(`${API_URL}/api/admin/offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
      body: JSON.stringify({ status: 'deleted' }),
    })
    loadOffers()
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', display: 'flex', gap: '2rem' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: '5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚙️</span> Dashboard
          </h1>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <TabButton active={tab === 'overview'} onClick={() => setTab('overview')} icon="📊" label="Visão Geral" />
            <TabButton active={tab === 'ofertas'} onClick={() => setTab('ofertas')} icon="🛍️" label="Gerir Ofertas" />
            <TabButton active={tab === 'criar'} onClick={() => setTab('criar')} icon="➕" label="Nova Oferta" />
            <TabButton active={tab === 'subscritores'} onClick={() => setTab('subscritores')} icon="📨" label="Subscritores" />
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, background: 'var(--card)', borderRadius: '1rem', border: '1px solid var(--border)', padding: '2rem', minHeight: '600px' }}>
        
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ponto de Situação</h2>
            {loading && !stats ? <p>A carregar métricas...</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <StatCard title="Total de Ofertas" value={stats?.totalOffers || 0} icon="📦" />
                <StatCard title="Ofertas Ativas" value={stats?.activeOffers || 0} icon="🟢" />
                <StatCard title="Cliques Gerados" value={stats?.totalClicks || 0} icon="🖱️" />
                <StatCard title="Subscritores" value={stats?.totalSubscribers || 0} icon="📧" />
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIBERS TAB */}
        {tab === 'subscritores' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Lista de Newsletter</h2>
              <button style={{ padding: '0.5rem 1rem', background: '#111', color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>
                ⬇️ Exportar CSV
              </button>
            </div>
            
            {loading ? <p>A carregar...</p> : (
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>Email</th>
                    <th style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>Data de Inscrição</th>
                    <th style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub: any) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{sub.email}</td>
                      <td style={{ padding: '1rem', color: 'var(--muted-foreground)' }}>
                        {new Date(sub.createdAt).toLocaleDateString('pt-PT')}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ background: sub.active ? '#dcfce7' : '#fee2e2', color: sub.active ? '#166534' : '#991b1b', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                          {sub.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center' }}>Sem subscritores ainda.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* OFERTAS TAB */}
        {tab === 'ofertas' && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Gerir Ofertas Atuais</h2>
            {loading ? <p>A carregar...</p> : (
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>Produto</th>
                    <th style={{ padding: '0.75rem' }}>Preço</th>
                    <th style={{ padding: '0.75rem' }}>Cliques</th>
                    <th style={{ padding: '0.75rem' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', maxWidth: '250px' }}>
                        <a href={`/oferta/${o.slug}`} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                          {o.title.substring(0, 40)}...
                        </a>
                      </td>
                      <td style={{ padding: '0.75rem', fontWeight: 700 }}>€{o.priceCurrent}</td>
                      <td style={{ padding: '0.75rem' }}>{o.clickCount || 0}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <button onClick={() => deleteOffer(o.id, o.title)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* CRIAR TAB */}
        {tab === 'criar' && (
           <div style={{ maxWidth: '700px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Adicionar Oferta Manualmente</h2>
             
             {/* Note: In a real environment, state for this form would be at the top level or a separate component. For simplicity, we can keep the basic inputs here */}
             <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>Podes adicionar ofertas manualmente (usando a ferramenta de API Postman) ou aguardar que o bot faça o trabalho. O formulário manual será reconstruído em breve para o novo layout.</p>
             <button style={{ padding: '0.75rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 700, cursor: 'not-allowed', opacity: 0.5 }}>
               Em Manutenção Visual
             </button>
           </div>
        )}

      </main>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: string, label: string }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '0.75rem 1rem',
      background: active ? 'var(--primary)' : 'transparent',
      color: active ? '#fff' : 'var(--foreground)',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: 600,
      fontSize: '0.9rem',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s'
    }}>
      <span style={{ fontSize: '1.1rem' }}>{icon}</span> {label}
    </button>
  )
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: string }) {
  return (
    <div style={{
      padding: '1.5rem',
      background: 'var(--muted)',
      borderRadius: '0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>{title}</span>
        <span style={{ fontSize: '1.25rem' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{value}</div>
    </div>
  )
}
