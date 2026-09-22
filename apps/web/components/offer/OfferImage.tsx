'use client'

import { useState } from 'react'

interface OfferImageProps {
  src?: string | null
  alt: string
  storeName?: string
  storeLogo?: string | null
}

export function OfferImage({ src, alt, storeName, storeLogo }: OfferImageProps) {
  const [failed, setFailed] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)

  // Se a URL original tiver problemas conhecidos (ex: Google Drive, Imgur album)
  const isInvalidUrl = !src || src.includes('drive.google.com') || src.includes('imgur.com/a/') || !src.startsWith('http')

  const showFallbackLogo = (failed || isInvalidUrl) && storeLogo && !logoFailed

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 'var(--radius)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      position: 'relative',
      paddingTop: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {!failed && !isInvalidUrl && src ? (
        <img
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '1.5rem',
          }}
          onError={() => setFailed(true)}
        />
      ) : showFallbackLogo ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <img
            src={storeLogo!}
            alt={storeName || 'Loja Parceira'}
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain',
            }}
            onError={() => setLogoFailed(true)}
          />
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          background: '#1e293b',
          color: '#94a3b8',
        }}>
          <span style={{ fontSize: '3.5rem' }}>🛍️</span>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>
            {storeName || 'RadarOfertas'}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Oferta Oficial Verificada
          </span>
        </div>
      )}
    </div>
  )
}
