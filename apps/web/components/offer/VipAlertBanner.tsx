'use client'

interface VipAlertBannerProps {
  storeName?: string
}

export function VipAlertBanner({ storeName }: VipAlertBannerProps) {
  const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_INVITE_URL || 'https://t.me/radarofertaspt'

  return (
    <div style={{
      marginTop: '1.5rem',
      background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(34, 197, 94, 0.08) 100%)',
      border: '1px solid rgba(249, 115, 22, 0.3)',
      borderRadius: 'var(--radius)',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.9rem',
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
        }}>
          ⚡
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--foreground)' }}>
              Não percas as próximas promoções {storeName ? `da ${storeName}` : ''}!
            </h3>
            <span style={{
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
            }}>
              🚨 Stock Limitado
            </span>
          </div>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--muted-foreground)',
            margin: '0 0 0.9rem 0',
            lineHeight: 1.4,
          }}>
            Muitos erros de preço e cupões esgotam em menos de 30 minutos. Junta-te à comunidade VIP e sê o primeiro a receber no telemóvel:
          </p>

          <div style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}>
            <a
              href="/entrar?canal=whatsapp"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#22c55e',
                color: '#fff',
                padding: '0.55rem 0.95rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.25)',
              }}
            >
              <span>💬 Entrar no WhatsApp VIP</span>
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#0284c7',
                color: '#fff',
                padding: '0.55rem 0.95rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
              }}
            >
              <span>✈️ Canal de Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
