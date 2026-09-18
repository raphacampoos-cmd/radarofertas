import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Newsletter } from '@/components/ui/Newsletter'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { WhatsAppWidget } from '@/components/ui/WhatsAppWidget'

export const metadata: Metadata = {
  title: {
    template: '%s | RadarOfertas',
    default: 'RadarOfertas - Os Melhores Descontos em Portugal',
  },
  description: 'Rastreamos centenas de lojas em Portugal para encontrar os melhores descontos e promoções com histórico de preços.',
  verification: {
    google: 'OYF3r60kPfYz67',
  },
  openGraph: {
    siteName: 'RadarOfertas',
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
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
        <WhatsAppWidget />
        
        
        <GoogleAnalytics gaId="G-ZD0R2S1021" />
      </body>
    </html>
  )
}
