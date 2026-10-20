'use client'

import { useState } from 'react'

interface ArticleImageProps {
  src?: string | null
  alt: string
  className?: string
  style?: React.CSSProperties
  fallbackIcon?: string
}

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop'

export function ArticleImage({
  src,
  alt,
  style = { width: '100%', height: '100%', objectFit: 'cover' },
  fallbackIcon = '📝'
}: ArticleImageProps) {
  const [errorCount, setErrorCount] = useState(0)

  // 1º tentativa: imagem original
  // 2º tentativa: imagem genérica elegante de compras/descontos
  // 3º tentativa: fallback visual com ícone

  if (!src || errorCount >= 2) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'var(--muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: '3rem' }}>{fallbackIcon}</span>
      </div>
    )
  }

  const currentSrc = errorCount === 1 ? DEFAULT_FALLBACK_IMAGE : src

  return (
    <img
      src={currentSrc}
      alt={alt}
      style={style}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setErrorCount((prev) => prev + 1)}
    />
  )
}
