'use client'

import { useState, useEffect, useRef } from 'react'
import { EU_LANGUAGES, getLanguageByCode, type EULanguage } from '@/lib/eu-languages'

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentCode, setCurrentCode] = useState('pt')
  const [search, setSearch] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Ler o idioma ativo a partir dos cookies do Google Translate ou localStorage
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/pt\/([a-z]{2})/i)
    const saved = match ? match[1].toLowerCase() : localStorage.getItem('user_lang')?.toLowerCase()
    if (saved && EU_LANGUAGES.some((l) => l.code === saved)) {
      setCurrentCode(saved)
    } else {
      setCurrentCode('pt')
    }
  }, [])

  // Fechar ao clicar fora ou pressionar Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const currentLang = getLanguageByCode(currentCode)

  const handleSelectLanguage = (code: string) => {
    setIsTranslating(true)
    setIsOpen(false)
    setCurrentCode(code)

    const hostname = window.location.hostname

    if (code === 'pt') {
      // Limpar cookies e restaurar original
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`
      try {
        localStorage.removeItem('user_lang')
      } catch {}
      window.location.reload()
      return
    }

    // Configurar cookie de tradução do Google Translate: /pt/{code}
    const cookieValue = `/pt/${code}`
    document.cookie = `googtrans=${cookieValue}; path=/;`
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname};`
    try {
      localStorage.setItem('user_lang', code)
    } catch {}

    // Disparar o evento no combo nativo do Google se já estiver montado
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
    if (select) {
      select.value = code
      select.dispatchEvent(new Event('change'))
      setTimeout(() => setIsTranslating(false), 400)
    } else {
      // Recarregar para o script aplicar o cookie na inicialização
      window.location.reload()
    }
  }

  // Filtragem da pesquisa
  const filteredLanguages = EU_LANGUAGES.filter((lang) => {
    const q = search.toLowerCase().trim()
    if (!q) return true
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.country.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
    )
  })

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Botão seletor no cabeçalho */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar idioma da União Europeia"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Idioma atual: ${currentLang.nativeName} (${currentLang.name}). Clica para mudar para qualquer um dos 24 idiomas da UE.`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.45rem 0.75rem',
          borderRadius: '9999px',
          background: isOpen ? '#252538' : '#1a1a2a',
          border: isOpen ? '1px solid #f97316' : '1px solid #2a2a3a',
          color: '#f1f5f9',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onMouseOver={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#f97316'
        }}
        onMouseOut={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#2a2a3a'
        }}
      >
        <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{currentLang.flag}</span>
        <span style={{ letterSpacing: '0.04em' }}>{currentLang.code.toUpperCase()}</span>
        <span style={{ fontSize: '0.65rem', opacity: 0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
          ▼
        </span>
      </button>

      {/* Dropdown flutuante */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '300px',
            maxWidth: '90vw',
            background: '#161622',
            border: '1px solid #2a2a3a',
            borderRadius: '0.75rem',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(249, 115, 22, 0.12)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Cabeçalho do menu */}
          <div style={{ padding: '0.75rem 1rem 0.5rem', borderBottom: '1px solid #2a2a3a' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>🇪🇺</span> Idiomas da União Europeia
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', padding: '0.15rem 0.45rem', borderRadius: '9999px' }}>
                24 oficiais
              </span>
            </div>

            {/* Campo de pesquisa rápida */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar idioma ou país..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.45rem 0.6rem 0.45rem 1.8rem',
                  fontSize: '0.8rem',
                  borderRadius: '0.4rem',
                  border: '1px solid #2a2a3a',
                  background: '#0d0d14',
                  color: '#f1f5f9',
                  outline: 'none',
                }}
              />
              <span style={{ position: 'absolute', left: '0.55rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.75rem', opacity: 0.5 }}>
                🔍
              </span>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Lista de idiomas */}
          <div
            style={{
              maxHeight: '280px',
              overflowY: 'auto',
              padding: '0.35rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.15rem',
            }}
          >
            {filteredLanguages.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                Nenhum idioma encontrado para &quot;{search}&quot;.
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentCode
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '0.5rem',
                      background: isSelected ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                      border: isSelected ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid transparent',
                      color: isSelected ? '#f97316' : '#f1f5f9',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s ease',
                      outline: 'none',
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#1a1a2a'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{lang.flag}</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 500, lineHeight: 1.2 }}>
                          {lang.nativeName}
                        </span>
                        {lang.nativeName !== lang.name && (
                          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            {lang.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: isSelected ? '#f97316' : '#64748b',
                          background: isSelected ? 'rgba(249, 115, 22, 0.2)' : '#0d0d14',
                          padding: '0.15rem 0.35rem',
                          borderRadius: '0.25rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {lang.code}
                      </span>
                      {isSelected && <span style={{ color: '#f97316', fontSize: '0.85rem', fontWeight: 800 }}>✓</span>}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Rodapé: Restaurar original se não for PT */}
          {currentCode !== 'pt' && (
            <div style={{ padding: '0.5rem', borderTop: '1px solid #2a2a3a', background: '#0d0d14' }}>
              <button
                type="button"
                onClick={() => handleSelectLanguage('pt')}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  borderRadius: '0.4rem',
                  border: '1px solid #2a2a3a',
                  background: '#161622',
                  color: '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#f1f5f9'
                  e.currentTarget.style.borderColor = '#f97316'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#94a3b8'
                  e.currentTarget.style.borderColor = '#2a2a3a'
                }}
              >
                <span>🇵🇹</span> Restaurar Português Original
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
