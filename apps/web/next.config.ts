import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Imagens de lojas parceiras
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'm.media-amazon.com' },
      { protocol: 'https', hostname: 'images-na.ssl-images-amazon.com' },
      { protocol: 'https', hostname: 'www.prozis.com' },
      { protocol: 'https', hostname: 'static.prozis.com' },
      { protocol: 'https', hostname: 'cdn.zumub.com' },
      { protocol: 'https', hostname: 'www.worten.pt' },
      { protocol: 'https', hostname: 'static.fnac.com' },
      { protocol: 'https', hostname: 'cdn.pcdiga.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '**.placehold.co' },
    ],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },

  // Output standalone para Railway/Docker
  // output: 'standalone',  // ← descomentar para deploy em Railway

  // Suprimir aviso de múltiplos lockfiles (monorepo)
  outputFileTracingRoot: require('path').join(__dirname, '../../'),

  // Turbopack dev (opcional)
  // experimental: { turbo: {} },
}

export default nextConfig
