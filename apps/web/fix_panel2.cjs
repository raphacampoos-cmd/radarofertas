const fs = require('fs');

let content = fs.readFileSync('app/admin/page.tsx', 'utf8');

const startIndex = content.indexOf('function BotsPanel() {');

if (startIndex !== -1) {
  content = content.substring(0, startIndex);
}

content += `function BotsPanel() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  async function triggerDiscovery() {
    setLoading(true)
    setMsg('A acordar o Robô Descobridor... Vai demorar uns minutos na Amazon.')
    try {
      const res = await fetch(\`\${API_URL}/api/admin/trigger-discovery\`, {
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
      const res = await fetch(\`\${API_URL}/api/admin/trigger-newsletter\`, {
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
      const res = await fetch(\`\${API_URL}/api/admin/offers/pending\`, {
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
    if (!confirm(\`Queres aprovar "\${title}" e enviar para os subscritores agora mesmo?\`)) return
    
    setLoading(true)
    try {
      const res = await fetch(\`\${API_URL}/api/admin/offers/\${id}/approve\`, {
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
      await fetch(\`\${API_URL}/api/admin/offers/\${id}\`, {
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
`

fs.writeFileSync('app/admin/page.tsx', content, 'utf8');
