'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { CampaignConfig } from '@/lib/campaigns'
import type { Offer } from '@/lib/types'
import { CountdownTimer } from './CountdownTimer'
import { OfferCard } from '@/components/offer/OfferCard'
import { Newsletter } from '@/components/ui/Newsletter'

interface TrackedStore {
  name: string
  slug: string
  offerCount?: number
}

interface CampaignLandingProps {
  campaign: CampaignConfig
  offers: Offer[]
  trackedStores: TrackedStore[]
}

export function CampaignLanding({ campaign, offers, trackedStores }: CampaignLandingProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStore, setSelectedStore] = useState<string>('all')

  // Extrair categorias únicas das ofertas da campanha
  const availableCategories = useMemo(() => {
    const map = new Map<string, string>()
    for (const off of offers) {
      if (off.categories) {
        for (const cat of off.categories) {
          map.set(cat.slug, cat.name)
        }
      }
    }
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }))
  }, [offers])

  // Extrair lojas únicas das ofertas da campanha
  const availableStores = useMemo(() => {
    const map = new Map<number, { name: string; slug: string }>()
    for (const off of offers) {
      if (off.store) {
        map.set(off.store.id, { name: off.store.name, slug: off.store.slug })
      }
    }
    return Array.from(map.values())
  }, [offers])

  // Filtragem
  const filteredOffers = useMemo(() => {
    return offers.filter((off) => {
      if (selectedStore !== 'all' && off.store?.slug !== selectedStore) {
        return false
      }
      if (selectedCategory !== 'all') {
        const matchesCat = off.categories?.some((c) => c.slug === selectedCategory)
        if (!matchesCat) return false
      }
      return true
    })
  }, [offers, selectedStore, selectedCategory])

  // FAQ Schema JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: campaign.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  // WebPage Schema JSON-LD
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: campaign.h1,
    description: campaign.metaDescription,
    url: campaign.canonicalUrl,
    inLanguage: 'pt-PT',
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #161622 0%, #0d0d14 100%)',
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        padding: '3rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '3rem',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(249, 115, 22, 0.15)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          color: '#f97316',
          fontWeight: 700,
          fontSize: '0.85rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          marginBottom: '1rem',
        }}>
          {campaign.badge}
        </div>

        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
          lineHeight: 1.2,
          color: '#fff',
        }}>
          {campaign.h1}
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--muted-foreground)',
          maxWidth: '750px',
          margin: '0 auto 1.5rem',
          lineHeight: 1.6,
        }}>
          {campaign.subtitle}
        </p>

        {/* Countdown */}
        <CountdownTimer targetDate={campaign.targetDate} />

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '1.5rem',
        }}>
          <a
            href="#newsletter"
            style={{
              background: '#f97316',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
              transition: 'opacity 0.2s',
            }}
          >
            🔔 Quero ser avisado
          </a>
          <a
            href="#guia"
            style={{
              background: 'var(--muted)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            📖 Ler o Guia & Dicas
          </a>
        </div>
      </section>

      {/* Secção de Ofertas */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              🏷️ Ofertas em Destaque {campaign.name}
            </h2>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
              Todas as ofertas são verificadas pelo algoritmo Deal Score antes de serem listadas.
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', fontWeight: 600 }}>
            {filteredOffers.length} {filteredOffers.length === 1 ? 'oferta' : 'ofertas'}
          </span>
        </div>

        {/* Filtros se houver ofertas */}
        {offers.length > 0 && (availableCategories.length > 1 || availableStores.length > 1) && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
          }}>
            {/* Filtro Lojas */}
            {availableStores.length > 1 && (
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted-foreground)', marginRight: '0.25rem' }}>Loja:</span>
                <button
                  onClick={() => setSelectedStore('all')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedStore === 'all' ? '#f97316' : 'var(--muted)',
                    color: selectedStore === 'all' ? '#fff' : 'var(--muted-foreground)',
                  }}
                >
                  Todas
                </button>
                {availableStores.map((st) => (
                  <button
                    key={st.slug}
                    onClick={() => setSelectedStore(st.slug)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: selectedStore === st.slug ? '#f97316' : 'var(--muted)',
                      color: selectedStore === st.slug ? '#fff' : 'var(--muted-foreground)',
                    }}
                  >
                    {st.name}
                  </button>
                ))}
              </div>
            )}

            {/* Filtro Categorias */}
            {availableCategories.length > 1 && (
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap', marginLeft: 'auto' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted-foreground)', marginRight: '0.25rem' }}>Categoria:</span>
                <button
                  onClick={() => setSelectedCategory('all')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedCategory === 'all' ? '#f97316' : 'var(--muted)',
                    color: selectedCategory === 'all' ? '#fff' : 'var(--muted-foreground)',
                  }}
                >
                  Todas
                </button>
                {availableCategories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: selectedCategory === cat.slug ? '#f97316' : 'var(--muted)',
                      color: selectedCategory === cat.slug ? '#fff' : 'var(--muted-foreground)',
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {filteredOffers.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1rem',
          }}>
            {filteredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📡</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Radares a monitorizar as lojas em Portugal
            </h3>
            <p style={{
              color: 'var(--muted-foreground)',
              maxWidth: '550px',
              margin: '0 auto 1.5rem',
              lineHeight: 1.6,
              fontSize: '0.95rem',
            }}>
              As ofertas qualificadas da {campaign.name} entram automaticamente nesta lista assim que os retalhistas ativarem as suas campanhas de descontos.
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--foreground)', fontWeight: 600 }}>
              Inscreve-te abaixo para receberes um alerta no momento em que as primeiras promoções forem detetadas!
            </p>
          </div>
        )}
      </section>

      {/* Formulário de Newsletter em Destaque */}
      <section id="newsletter" style={{ marginBottom: '4rem' }}>
        <Newsletter
          source={campaign.slug}
          title={campaign.newsletterTitle}
          description={campaign.newsletterDescription}
          buttonText="Avisem-me das melhores ofertas"
        />
      </section>

      {/* Guia Útil */}
      <section id="guia" style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        padding: '2.5rem',
        marginBottom: '4rem',
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem', color: '#f97316' }}>
          {campaign.guideTitle}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {campaign.guideSections.map((section, idx) => (
            <div key={idx}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>
                {section.title}
              </h3>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} style={{
                  color: 'var(--muted-foreground)',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  marginBottom: '0.75rem',
                }}>
                  {p}
                </p>
              ))}

              {/* Inserir a lista de lojas acompanhadas na secção correspondente */}
              {section.title.toLowerCase().includes('lojas') && trackedStores.length > 0 && (
                <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  marginTop: '1rem',
                }}>
                  {trackedStores.map((store) => (
                    <Link
                      key={store.slug}
                      href={`/loja/${store.slug}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--muted)',
                        border: '1px solid var(--border)',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        color: 'var(--foreground)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'border-color 0.2s',
                      }}
                    >
                      <span>🏪</span>
                      <span>{store.name}</span>
                      {store.offerCount && store.offerCount > 0 ? (
                        <span style={{
                          background: 'rgba(249, 115, 22, 0.15)',
                          color: '#f97316',
                          fontSize: '0.75rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '9999px',
                        }}>
                          {store.offerCount}
                        </span>
                      ) : null}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Perguntas Frequentes (FAQ) */}
      <section style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '1rem',
        padding: '2.5rem',
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          ❓ Perguntas Frequentes sobre a {campaign.name}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {campaign.faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--muted)',
                borderRadius: '0.5rem',
                padding: '1.25rem',
                border: '1px solid var(--border)',
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                {faq.question}
              </h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
