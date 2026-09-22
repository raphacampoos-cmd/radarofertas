'use client'

export function ManageCookiesButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent('reopen-cookie-banner'))}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        color: '#94a3b8',
        fontSize: '0.875rem',
        cursor: 'pointer',
        textAlign: 'left',
        textDecoration: 'none',
        fontFamily: 'inherit',
      }}
      onMouseOver={(e) => (e.currentTarget.style.color = '#f97316')}
      onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
    >
      ⚙️ Preferências de Cookies
    </button>
  )
}
