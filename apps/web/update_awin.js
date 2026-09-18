const fs = require('fs');
let c = fs.readFileSync('app/admin/page.tsx', 'utf8');

c = c.replace(
  `function CreateOfferForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')`,
  `function CreateOfferForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [affiliateUrl, setAffiliateUrl] = useState('')
    const [showAwinHelper, setShowAwinHelper] = useState(false)
    const [awinUrl, setAwinUrl] = useState('')
    const [awinMid, setAwinMid] = useState('12149')
    const AWIN_PUBLISHER_ID = '1234567' // Substituir pelo ID real do Publisher
    
    function generateAwinLink() {
      if (!awinUrl) return
      const deepLink = \`https://www.awin1.com/cread.php?awinmid=\${awinMid}&awinaffid=\${AWIN_PUBLISHER_ID}&ued=\${encodeURIComponent(awinUrl)}\`
      setAffiliateUrl(deepLink)
      setShowAwinHelper(false)
    }`
);

c = c.replace(
  `affiliateUrl: fd.get('affiliateUrl'),`,
  `affiliateUrl: affiliateUrl || fd.get('affiliateUrl'),`
);

c = c.replace(
  `<(e.target as HTMLFormElement).reset()`,
  `;(e.target as HTMLFormElement).reset()\n        setAffiliateUrl('')`
);

c = c.replace(
  `<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Link de Afiliado *</label>
            <input name="affiliateUrl" type="url" required placeholder="https://www.amazon.es/dp/B0CL5KNB9M?tag=radaroferta0c-21" style={{ padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)' }} />
          </div>`,
  `<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
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
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Loja (Merchant ID)</label>
                    <select value={awinMid} onChange={(e) => setAwinMid(e.target.value)} style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem', borderRadius: '0.35rem', border: '1px solid #cbd5e1' }}>
                      <option value="12149">PC Componentes ES (12149)</option>
                      <option value="20084">AliExpress Global (20084)</option>
                      <option value="18491">Worten PT (18491)</option>
                      <option value="10521">El Corte Inglés (10521)</option>
                      <option value="15003">FNAC PT (15003)</option>
                      <option value="custom">Outro (Inserir manual)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>URL Original do Produto</label>
                    <input type="url" value={awinUrl} onChange={(e) => setAwinUrl(e.target.value)} placeholder="https://www.worten.pt/..." style={{ width: '100%', marginTop: '0.25rem', padding: '0.5rem', borderRadius: '0.35rem', border: '1px solid #cbd5e1' }} />
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
          </div>`
);

fs.writeFileSync('app/admin/page.tsx', c);
