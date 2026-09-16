import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'RadarOfertas — Melhores Ofertas e Descontos em Portugal',
    template: '%s | RadarOfertas',
  },
  description: 'Encontra as melhores ofertas, descontos e cupões em Portugal. Gaming, Casa, Suplementação. Com gráfico de histórico de preços e Deal Score.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://radarofertas.pt'),
  openGraph: {
    siteName: 'RadarOfertas',
    locale: 'pt_PT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#dc2626" />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 140px)', paddingBottom: '2rem' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
