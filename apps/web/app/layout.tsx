import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Newsletter } from '@/components/ui/Newsletter'
import { CookieBanner } from '@/components/ui/CookieBanner'
import { WhatsAppWidget } from '@/components/ui/WhatsAppWidget'

export const metadata: Metadata = {
  metadataBase: new URL('https://radarofertas-psi.vercel.app'),
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
      <head>
        {/* Resource Hints para acelerar imagens e conexões externas */}
        <link rel="preconnect" href="https://ui.awin.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ui.awin.com" />
        <link rel="preconnect" href="https://m.media-amazon.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://m.media-amazon.com" />
        <link rel="preconnect" href="https://images-na.ssl-images-amazon.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images-na.ssl-images-amazon.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2815702619453444"
          crossOrigin="anonymous"
        />

        {/* Impact.com Verification & Tracking */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7823444-1029-4911-8d89-0527ba617e921.js','script','impactStat',document,window);impactStat('transformLinks');impactStat('trackImpression');`,
          }}
        />
      </head>
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
