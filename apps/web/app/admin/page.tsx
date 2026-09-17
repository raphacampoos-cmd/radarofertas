'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const ADMIN_KEY = 'radar_admin_secret_change_in_production'

export default function AdminDashboard() {
  const [tab, setTab] = useState<'overview' | 'ofertas' | 'criar' | 'subscritores' | 'whatsapp'>('overview')
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
            <TabButton active={tab === 'whatsapp'} onClick={() => setTab('whatsapp')} icon="📱" label="WhatsApp Bot" />
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
           <div style={{ maxWidth: '800px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Adicionar Oferta Manualmente</h2>
             <CreateOfferForm onSuccess={() => { setTab('ofertas'); loadOffers(); }} />
           </div>
        )}

        {/* WHATSAPP TAB */}
        {tab === 'whatsapp' && (
           <div style={{ maxWidth: '800px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ligar WhatsApp Bot (Servidor Railway)</h2>
             <WhatsAppPanel />
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

function CreateOfferForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    
    // Processar Categorias
    const cats = []
    if (fd.get('cat_gaming')) cats.push(1, 2)
    if (fd.get('cat_casa')) cats.push(5)
    if (fd.get('cat_suple')) cats.push(8)
    if (cats.length === 0) cats.push(1) // Fallback para Gaming

    const payload = {
      title: fd.get('title'),
      storeId: 1, // Por defeito: Amazon
      priceCurrent: parseFloat(fd.get('priceCurrent') as string),
      priceOriginal: fd.get('priceOriginal') ? parseFloat(fd.get('priceOriginal') as string) : undefined,
      affiliateUrl: fd.get('affiliateUrl'),
      imageUrl: fd.get('imageUrl') || undefined,
      couponCode: fd.get('couponCode') || undefined,
      description: fd.get('description') || '',
      categoryIds: cats,
      source: 'manual'
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setMsg('✅ Oferta criada com sucesso!')
        ;(e.target as HTMLFormElement).reset()
        setTimeout(() => { setMsg(''); onSuccess(); }, 1500)
      } else {
        const error = await res.json()
        setMsg(`❌ Erro: ${error.error || 'Falha ao guardar'}`)
      }
    } catch {
      setMsg('❌ Erro na comunicação com a API')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--background)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
      {msg && <div style={{ padding: '1rem', background: msg.includes('✅') ? '#dcfce7' : '#fee2e2', color: msg.includes('✅') ? '#166534' : '#991b1b', borderRadius: '0.5rem', fontWeight: 600 }}>{msg}</div>}
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Título do Produto *</label>
          <input name="title" required placeholder="Ex: Consola PlayStation 5" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Preço Atual (€) *</label>
          <input name="priceCurrent" type="number" step="0.01" required placeholder="399.99" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Preço Anterior (€) (Opcional)</label>
          <input name="priceOriginal" type="number" step="0.01" placeholder="499.99" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Link de Afiliado *</label>
          <input name="affiliateUrl" type="url" required placeholder="https://www.amazon.es/dp/B0CL5KNB9M?tag=radaroferta0c-21" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>URL da Imagem * (Clica c/ direito na imagem da Amazon e copia)</label>
          <input name="imageUrl" type="url" required placeholder="https://m.media-amazon.com/images/I/51FjXk0L+rL._AC_SL1500_.jpg" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Cupão de Desconto (Opcional)</label>
          <input name="couponCode" placeholder="Ex: AMAZON20" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Categorias</label>
          <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--card)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><input type="checkbox" name="cat_gaming" /> 🎮 Gaming</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><input type="checkbox" name="cat_casa" /> 🏠 Casa</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}><input type="checkbox" name="cat_suple" /> 💪 Suplementação</label>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} style={{ padding: '1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', transition: 'opacity 0.2s' }}>
        {loading ? 'A Gravar...' : '💾 Gravar Oferta e Publicar no Telegram'}
      </button>
    </form>
  )
}

function WhatsAppPanel() {
  const [waData, setWaData] = useState<{ status: string, qr: string | null }>({ status: 'disconnected', qr: null })
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<{id: string, subject: string}[]>([])
  const [targetId, setTargetId] = useState<string>('')

  // Poll status every 3 seconds
  useEffect(() => {
    let interval = setInterval(checkStatus, 3000)
    checkStatus()
    return () => clearInterval(interval)
  }, [])

  async function checkStatus() {
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/status`, {
        headers: { 'X-Admin-Key': ADMIN_KEY }
      })
      const data = await res.json()
      setWaData(data)
    } catch {}
  }

  async function startConnection() {
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/admin/whatsapp/connect`, {
        method: 'POST',
        headers: { 'X-Admin-Key': ADMIN_KEY }
      })
      checkStatus()
    } catch {}
    setLoading(false)
  }

  async function loadGroups() {
    try {
      const res = await fetch(`${API_URL}/api/admin/whatsapp/groups`, {
        headers: { 'X-Admin-Key': ADMIN_KEY }
      })
      const json = await res.json()
      if (json.data) setGroups(json.data)
    } catch {}
  }

  return (
    <div style={{ background: 'var(--card)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
      <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
        O teu servidor tem um robô de WhatsApp integrado. Precisas de usar o telemóvel secundário (aquele que é só para o robô), abrir o WhatsApp &gt; Dispositivos Ligados &gt; Ligar Dispositivo, e ler o QR Code abaixo.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
          Estado: 
          {waData.status === 'connected' && <span style={{ color: '#16a34a' }}>🟢 Conectado e Pronto</span>}
          {waData.status === 'qr_ready' && <span style={{ color: '#eab308' }}>🟡 A Aguardar Leitura do QR</span>}
          {waData.status === 'connecting' && <span style={{ color: '#3b82f6' }}>🔵 A Iniciar Motor WhatsApp...</span>}
          {waData.status === 'disconnected' && <span style={{ color: '#dc2626' }}>🔴 Desligado</span>}
        </div>

        {waData.status === 'disconnected' && (
          <button 
            onClick={startConnection} 
            disabled={loading}
            style={{ padding: '1rem 2rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 800, fontSize: '1rem', cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? 'A Pedir Código...' : 'GERAR QR CODE AGORA'}
          </button>
        )}

        {waData.status === 'qr_ready' && waData.qr && (
          <div style={{ padding: '1rem', background: '#fff', borderRadius: '1rem', border: '2px dashed var(--border)' }}>
            <img src={waData.qr} alt="WhatsApp QR Code" style={{ width: '250px', height: '250px' }} />
          </div>
        )}

        {waData.status === 'connected' && (
          <div style={{ background: '#dcfce7', color: '#166534', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'left', fontWeight: 600, width: '100%' }}>
            <p>🎉 O robô está ligado com sucesso à tua conta do WhatsApp!</p>
            <hr style={{ margin: '1rem 0', borderColor: '#bbf7d0' }} />
            <p style={{ marginBottom: '1rem' }}>Para que as ofertas vão para o grupo certo, precisamos de saber o ID do teu grupo. Coloca o teu telemóvel com o bot dentro do grupo e clica abaixo:</p>
            
            <button onClick={loadGroups} style={{ padding: '0.5rem 1rem', background: '#166534', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
              Listar os Meus Grupos de WhatsApp
            </button>

            {groups.length > 0 && (
              <ul style={{ background: '#fff', padding: '1rem', borderRadius: '0.5rem', listStyle: 'none' }}>
                {groups.map(g => (
                  <li key={g.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{g.subject}</span>
                    <code style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '0.2rem' }}>{g.id}</code>
                  </li>
                ))}
              </ul>
            )}
            
            <p style={{ marginTop: '1rem', fontSize: '0.85rem' }}>Copia o código do grupo (termina em @g.us) e adiciona-o nas variáveis de ambiente do Railway com o nome <strong>WHATSAPP_GROUP_ID</strong>. (Se não tiveres acesso ao Railway agora, manda-me o código aqui pelo chat que eu adiciono!)</p>
          </div>
        )}
      </div>
    </div>
  )
}
