'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const ADMIN_KEY = 'radar_admin_secret_change_in_production'

export default function AdminDashboard() {
  const [tab, setTab] = useState<string>('overview')
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
            <TabButton active={tab === 'aprovacoes'} onClick={() => setTab('aprovacoes')} icon="🔥" label="Aprovações Awin" />
            <TabButton active={tab === 'ofertas'} onClick={() => setTab('ofertas')} icon="🏷️" label="Gerir Ofertas" />
            <TabButton active={tab === 'criar'} onClick={() => setTab('criar')} icon="➕" label="Nova Oferta" />
            <TabButton active={tab === 'subscritores'} onClick={() => setTab('subscritores')} icon="📨" label="Subscritores" />
            <TabButton active={tab === 'whatsapp'} onClick={() => setTab('whatsapp')} icon="📱" label="WhatsApp Bot" />
            <TabButton active={tab === 'robos'} onClick={() => setTab('robos')} icon="🤖" label="Robôs & Automações" />
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
        {tab ===useState<'overview' | 'ofertas' | 'criar' | 'subscritores' | 'whatsapp' | 'robos'>&& (
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
        {tab ===useState<'overview' | 'ofertas' | 'criar' | 'subscritores' | 'whatsapp' | 'robos'>&& (
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
        {tab ===useState<'overview' | 'ofertas' | 'criar' | 'subscritores' | 'whatsapp' | 'robos'>&& (
           <div style={{ maxWidth: '800px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Adicionar Oferta Manualmente</h2>
             <CreateOfferForm onSuccess={() => { setTab('ofertas'); loadOffers(); }} />
           </div>
        )}

        {/* WHATSAPP TAB */}
        {tab === 'whatsapp' && (
           <div style={{ maxWidth: '800px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>WhatsApp Bot</h2>
             <WhatsAppPanel />
           </div>
        )}

        {/* ROBOS TAB */}
        {tab === 'robos' && (
           <div style={{ maxWidth: '800px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>🤖 Painel de Controlo dos Robôs</h2>
             <BotsPanel />
           </div>
        )}

        {/* APROVACOES TAB */}
        {tab === 'aprovacoes' && (
           <div style={{ maxWidth: '800px' }}>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>🔥 Fila de Aprovações (Agente Awin)</h2>
             <AwinApprovalsPanel />
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
  const [affiliateUrl, setAffiliateUrl] = useState('')
  const [showAwinHelper, setShowAwinHelper] = useState(false)
  const [awinUrl, setAwinUrl] = useState('')
  const [awinMid, setAwinMid] = useState('12149') // PC Componentes default
  
  const AWIN_PUBLISHER_ID = '3099259' // O ID real do Publisher Awin

  function generateAwinLink() {
    if (!awinUrl) return
    const deepLink = `https://www.awin1.com/cread.php?awinmid=${awinMid}&awinaffid=${AWIN_PUBLISHER_ID}&ued=${encodeURIComponent(awinUrl)}`
    setAffiliateUrl(deepLink)
    setShowAwinHelper(false)
  }

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
      affiliateUrl: affiliateUrl || fd.get('affiliateUrl'),
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
        setAffiliateUrl('')
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Link de Afiliado (URL Final) *</label>
            <button type="button" onClick={() => setShowAwinHelper(!showAwinHelper)} style={{ background: 'none', border: 'none', color: '#f97316', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
              ✨ Gerar Deep Link Awin
            </button>
          </div>
          
          {showAwinHelper && (
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>Loja / Advertiser (ID)</label>
                  <select value={awinMid} onChange={(e) => setAwinMid(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem', borderRadius: '0.35rem', border: '1px solid var(--border)' }}>
                    <option value="12149">PC Componentes ES (12149)</option>
                    <option value="20084">AliExpress Global (20084)</option>
                    <option value="18491">Worten PT (18491)</option>
                    <option value="10521">El Corte Inglés (10521)</option>
                    <option value="15003">FNAC PT (15003)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted-foreground)' }}>URL Original do Produto</label>
                  <input type="url" value={awinUrl} onChange={(e) => setAwinUrl(e.target.value)} placeholder="https://www.worten.pt/..." style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem', borderRadius: '0.35rem', border: '1px solid var(--border)' }} />
                </div>
              </div>
              <button type="button" onClick={generateAwinLink} style={{ background: '#0f172a', color: '#fff', padding: '0.5rem', borderRadius: '0.35rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Converter & Colar 🚀
              </button>
            </div>
          )}

          <input 
            name="affiliateUrl" 
            type="url" 
            required 
            value={affiliateUrl || undefined}
            onChange={(e) => setAffiliateUrl(e.target.value)}
            placeholder="https://www.amazon.es/dp/B0CL5KNB9M?tag=radaroferta0c-21" 
            style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} 
          />
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
function BotsPanel() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  async function triggerDiscovery() {
    setLoading(true)
    setMsg('A acordar o Rob� Descobridor... Vai demorar uns minutos na Amazon.')
    try {
      const res = await fetch(\\/api/admin/trigger-discovery\, {
        method: 'POST',
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      const data = await res.json()
      setMsg(data.message || 'Comando enviado!')
    } catch {
      setMsg('Erro ao contactar a API.')
    }
    setLoading(false)
  }

  async function triggerNewsletter() {
    setLoading(true)
    setMsg('A compilar Newsletter de teste...')
    try {
      const res = await fetch(\\/api/admin/trigger-newsletter\, {
        method: 'POST',
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      const data = await res.json()
      setMsg(data.success ? 'Email enviado com sucesso (verifica a tua caixa de correio!)' : (data.error || 'Erro ao enviar.'))
    } catch {
      setMsg('Erro ao contactar a API.')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
      <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
        For�a a execu��o de tarefas que normalmente correm de forma agendada no servidor (Railway).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>?????? Rob� Descobridor</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
            Procura novos produtos "BestSellers" na Amazon (Gaming, Casa, Tech) e insere na base de dados (Corre diariamente �s 03:00).
          </p>
          <button 
            onClick={triggerDiscovery} 
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}
          >
            Executar Patrulha Agora
          </button>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>?? Newsletter Semanal</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
            Vai buscar o Top 5 melhores ofertas ativas e envia um Email via Resend.com (Corre � sexta-feira �s 10:00).
          </p>
          <button 
            onClick={triggerNewsletter} 
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#f97316', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}
          >
            Enviar Teste Manual
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#ef4444', borderRadius: 'var(--radius)', fontWeight: 500, textAlign: 'center' }}>
          {msg}
        </div>
      )}
    </div>
  )
}
function AwinApprovalsPanel() {
  const [pending, setPending] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  useEffect(() => {
    loadPending()
  }, [])

  async function loadPending() {
    setLoading(true)
    try {
      const res = await fetch(\\/api/admin/offers/pending\, {
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      const data = await res.json()
      setPending(data.data || [])
    } catch {
      setMsg('Erro ao carregar aprova��es pendentes.')
    }
    setLoading(false)
  }

  async function approveOffer(id: number, title: string) {
    if (!confirm(\Queres aprovar "\" e enviar para os subscritores agora mesmo?\)) return
    
    setLoading(true)
    try {
      const res = await fetch(\\/api/admin/offers/\/approve\, {
        method: 'PUT',
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      if (res.ok) {
        setMsg('? Aprovado! Disparado para Telegram e WhatsApp com sucesso.')
        loadPending()
      } else {
        setMsg('? Erro ao aprovar oferta.')
      }
    } catch {
      setMsg('? Erro de comunica��o.')
    }
    setLoading(false)
  }

  async function rejectOffer(id: number) {
    if (!confirm('Rejeitar e apagar esta sugest�o da Awin?')) return
    setLoading(true)
    try {
      await fetch(\\/api/admin/offers/\\, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': 'radar_admin_secret_change_in_production' },
        body: JSON.stringify({ status: 'deleted' })
      })
      loadPending()
    } catch {}
    setLoading(false)
  }

  return (
    <div>
      <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
        O Agente Awin recolhe diariamente as melhores ofertas (Worten, PC Componentes, AliExpress, etc.) e coloca-as aqui para tua aprova��o manual. Nenhuma destas ofertas est� vis�vel no site ainda.
      </p>

      {msg && <div style={{ padding: '1rem', background: msg.includes('?') ? '#dcfce7' : '#fee2e2', color: msg.includes('?') ? '#166534' : '#991b1b', borderRadius: '0.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>{msg}</div>}

      {loading ? (
        <p>A carregar...</p>
      ) : pending.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>??</span>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Fila Limpa!</h3>
          <p style={{ color: 'var(--muted-foreground)' }}>N�o h� ofertas pendentes da Awin de momento. O Agente trar� mais na pr�xima patrulha.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {pending.map(o => (
            <div key={o.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', flexShrink: 0, background: '#f1f5f9', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {o.imageUrl ? <img src={o.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : '??'}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{o.title}</h4>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                  <span><strong style={{ color: '#000' }}>{o.priceCurrent}�</strong> (antes {o.priceOriginal || '?'})</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => rejectOffer(o.id)} style={{ padding: '0.5rem 1rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                  ? Descartar
                </button>
                <button onClick={() => approveOffer(o.id, o.title)} style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                  ? Aprovar e Disparar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


function BotsPanel() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  async function triggerDiscovery() {
    setLoading(true)
    setMsg('A acordar o Robô Descobridor... Vai demorar uns minutos na Amazon.')
    try {
      const res = await fetch(`${API_URL}/api/admin/trigger-discovery`, {
        method: 'POST',
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      const data = await res.json()
      setMsg(data.message || 'Comando enviado!')
    } catch {
      setMsg('Erro ao contactar a API.')
    }
    setLoading(false)
  }

  async function triggerNewsletter() {
    setLoading(true)
    setMsg('A compilar Newsletter de teste...')
    try {
      const res = await fetch(`${API_URL}/api/admin/trigger-newsletter`, {
        method: 'POST',
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      const data = await res.json()
      setMsg(data.success ? 'Email enviado com sucesso (verifica a tua caixa de correio!)' : (data.error || 'Erro ao enviar.'))
    } catch {
      setMsg('Erro ao contactar a API.')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
      <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
        Força a execução de tarefas que normalmente correm de forma agendada no servidor (Railway).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>🤖 Robô Descobridor</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
            Procura novos produtos "BestSellers" na Amazon (Gaming, Casa, Tech) e insere na base de dados (Corre diariamente às 03:00).
          </p>
          <button 
            onClick={triggerDiscovery} 
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}
          >
            Executar Patrulha Agora
          </button>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>✉️ Newsletter Semanal</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
            Vai buscar o Top 5 melhores ofertas ativas e envia um Email via Resend.com (Corre à sexta-feira às 10:00).
          </p>
          <button 
            onClick={triggerNewsletter} 
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#f97316', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}
          >
            Enviar Teste Manual
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#ef4444', borderRadius: 'var(--radius)', fontWeight: 500, textAlign: 'center' }}>
          {msg}
        </div>
      )}
    </div>
  )
}

function BotsPanel() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  async function triggerDiscovery() {
    setLoading(true)
    setMsg('A acordar o Robô Descobridor... Vai demorar uns minutos na Amazon.')
    try {
      const res = await fetch(`${API_URL}/api/admin/trigger-discovery`, {
        method: 'POST',
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      const data = await res.json()
      setMsg(data.message || 'Comando enviado!')
    } catch {
      setMsg('Erro ao contactar a API.')
    }
    setLoading(false)
  }

  async function triggerNewsletter() {
    setLoading(true)
    setMsg('A compilar Newsletter de teste...')
    try {
      const res = await fetch(`${API_URL}/api/admin/trigger-newsletter`, {
        method: 'POST',
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      const data = await res.json()
      setMsg(data.success ? 'Email enviado com sucesso (verifica a tua caixa de correio!)' : (data.error || 'Erro ao enviar.'))
    } catch {
      setMsg('Erro ao contactar a API.')
    }
    setLoading(false)
  }

  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
      <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
        Força a execução de tarefas que normalmente correm de forma agendada no servidor (Railway).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>🤖 Robô Descobridor</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
            Procura novos produtos "BestSellers" na Amazon (Gaming, Casa, Tech) e insere na base de dados (Corre diariamente às 03:00).
          </p>
          <button 
            onClick={triggerDiscovery} 
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: 'var(--foreground)', color: 'var(--background)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}
          >
            Executar Patrulha Agora
          </button>
        </div>

        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem', background: '#f8fafc' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1.1rem' }}>✉️ Newsletter Semanal</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
            Vai buscar o Top 5 melhores ofertas ativas e envia um Email via Resend.com (Corre à sexta-feira às 10:00).
          </p>
          <button 
            onClick={triggerNewsletter} 
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#f97316', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: loading ? 'wait' : 'pointer' }}
          >
            Enviar Teste Manual
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '1rem', background: '#fef2f2', color: '#ef4444', borderRadius: 'var(--radius)', fontWeight: 500, textAlign: 'center' }}>
          {msg}
        </div>
      )}
    </div>
  )
}

function AwinApprovalsPanel() {
  const [pending, setPending] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  useEffect(() => {
    loadPending()
  }, [])

  async function loadPending() {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/offers/pending`, {
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      const data = await res.json()
      setPending(data.data || [])
    } catch {
      setMsg('Erro ao carregar aprovações pendentes.')
    }
    setLoading(false)
  }

  async function approveOffer(id: number, title: string) {
    if (!confirm(`Queres aprovar "${title}" e enviar para os subscritores agora mesmo?`)) return
    
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/admin/offers/${id}/approve`, {
        method: 'PUT',
        headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }
      })
      if (res.ok) {
        setMsg('✅ Aprovado! Disparado para Telegram e WhatsApp com sucesso.')
        loadPending()
      } else {
        setMsg('❌ Erro ao aprovar oferta.')
      }
    } catch {
      setMsg('❌ Erro de comunicação.')
    }
    setLoading(false)
  }

  async function rejectOffer(id: number) {
    if (!confirm('Rejeitar e apagar esta sugestão da Awin?')) return
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/admin/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': 'radar_admin_secret_change_in_production' },
        body: JSON.stringify({ status: 'deleted' })
      })
      loadPending()
    } catch {}
    setLoading(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'var(--muted-foreground)', margin: 0 }}>O Agente Awin recolhe diariamente ofertas e coloca-as aqui para aprovação manual.</p>
        <button onClick={async () => { await fetch(API_URL + '/api/admin/awin/test-agent', { method: 'POST', headers: { 'X-Admin-Key': 'radar_admin_secret_change_in_production' }}); loadPending() }} style={{ background: '#0f172a', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 600 }}>🧪 Injetar Teste</button>
      </div>

      {msg && <div style={{ padding: '1rem', background: msg.includes('✅') ? '#dcfce7' : '#fee2e2', color: msg.includes('✅') ? '#166534' : '#991b1b', borderRadius: '0.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>{msg}</div>}

      {loading ? (
        <p>A carregar...</p>
      ) : pending.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>📭</span>
          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Fila Limpa!</h3>
          <p style={{ color: 'var(--muted-foreground)' }}>Não há ofertas pendentes da Awin de momento. O Agente trará mais na próxima patrulha.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {pending.map(o => (
            <div key={o.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', flexShrink: 0, background: '#f1f5f9', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {o.imageUrl ? <img src={o.imageUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} /> : '📦'}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{o.title}</h4>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>
                  <span><strong style={{ color: '#000' }}>{o.priceCurrent}€</strong> (antes {o.priceOriginal || '?'})</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => rejectOffer(o.id)} style={{ padding: '0.5rem 1rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                  ❌ Descartar
                </button>
                <button onClick={() => approveOffer(o.id, o.title)} style={{ padding: '0.5rem 1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                  ✅ Aprovar e Disparar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
