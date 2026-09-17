import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Newsletter } from '@/components/ui/Newsletter'
import { CookieBanner } from '@/components/ui/CookieBanner'

export const metadata: Metadata = {
  title: {
    template: '%s | RadarOfertas',
    default: 'RadarOfertas - Os Melhores Descontos em Portugal',
  },
  description: 'Rastreamos centenas de lojas em Portugal para encontrar os melhores descontos e promoções com histórico de preços.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-PT">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        
        <div className="container" style={{ padding: '0 1rem' }}>
          <Newsletter />
        </div>
        
        <Footer />
        
        <CookieBanner />
        
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
