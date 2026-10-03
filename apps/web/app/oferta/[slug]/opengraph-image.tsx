import { ImageResponse } from 'next/og'
import { getOffer } from '@/lib/api'

export const runtime = 'edge'
export const alt = 'Oferta no RadarOfertas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  let offer
  try {
    const res = await getOffer(slug)
    offer = res.data
  } catch {
    return new Response('Not found', { status: 404 })
  }

  const priceCurrent = offer.priceCurrent ? parseFloat(offer.priceCurrent) : 0
  const priceOriginal = offer.priceOriginal ? parseFloat(offer.priceOriginal) : 0
  const isAmazon = offer.affiliateUrl?.includes('amazon')
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Header Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 60px',
          background: '#f97316', // Laranja do RadarOfertas
          color: 'white',
        }}>
          <div style={{ fontSize: 40, fontWeight: 900 }}>RadarOfertas</div>
          <div style={{ fontSize: 24, fontWeight: 600 }}>{offer.store?.name}</div>
        </div>

        {/* Content Area */}
        <div style={{
          display: 'flex',
          flex: 1,
          padding: '60px',
          gap: '40px',
          alignItems: 'center',
        }}>
          {/* Image Box */}
          {offer.imageUrl && (
            <div style={{
              display: 'flex',
              width: 400,
              height: 400,
              background: 'white',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={offer.imageUrl} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} alt="" />
            </div>
          )}

          {/* Details */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}>
            <h1 style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.2,
              marginBottom: 40,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {offer.title}
            </h1>

            {isAmazon ? (
              <div style={{ fontSize: 32, fontWeight: 700, color: '#f97316' }}>
                ⭐ Oferta Especial na Amazon!
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                <div style={{ fontSize: 72, fontWeight: 900, color: '#dc2626' }}>
                  €{priceCurrent.toFixed(2)}
                </div>
                {priceOriginal > priceCurrent && (
                  <div style={{ fontSize: 36, fontWeight: 600, color: '#9ca3af', textDecoration: 'line-through', marginBottom: 10 }}>
                    €{priceOriginal.toFixed(2)}
                  </div>
                )}
              </div>
            )}
            
            {offer.couponCode && (
              <div style={{
                marginTop: 30,
                display: 'flex',
                alignItems: 'center',
              }}>
                <div style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '10px 24px',
                  borderRadius: 12,
                  fontSize: 28,
                  fontWeight: 700,
                  border: '2px dashed #f59e0b',
                }}>
                  CUPÃO: {offer.couponCode}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
