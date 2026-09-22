'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Store, 
  Tag, 
  Barcode, 
  Award, 
  CreditCard, 
  Clock, 
  ExternalLink,
  Info
} from 'lucide-react'

interface OfferSpecsSectionProps {
  offer: any
  priceCurrent: number
  priceOriginal: number
  discountPct: number
}

export function OfferSpecsSection({ offer, priceCurrent, priceOriginal, discountPct }: OfferSpecsSectionProps) {
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'trust'>('specs')

  const categoryName = offer.categories?.[0]?.name || 'Tecnologia & Geral'
  const storeName = offer.store?.name || 'Loja Oficial'
  const savings = priceOriginal > priceCurrent ? priceOriginal - priceCurrent : 0
  const isMinHistoric = offer.isMinHistoric

  return (
    <div style={{
      marginTop: '3rem',
      background: '#161622',
      border: '1px solid #2a2a3a',
      borderRadius: '1rem',
      overflow: 'hidden',
    }}>
      {/* Navegação por Abas */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #2a2a3a',
        background: '#12121c',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setActiveTab('specs')}
          style={{
            padding: '1rem 1.5rem',
            background: activeTab === 'specs' ? '#161622' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'specs' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'specs' ? '#f97316' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
        >
          <Award size={18} />
          Especificações da Oferta
        </button>

        <button
          onClick={() => setActiveTab('description')}
          style={{
            padding: '1rem 1.5rem',
            background: activeTab === 'description' ? '#161622' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'description' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'description' ? '#f97316' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
        >
          <Info size={18} />
          Sobre o Produto
        </button>

        <button
          onClick={() => setActiveTab('trust')}
          style={{
            padding: '1rem 1.5rem',
            background: activeTab === 'trust' ? '#161622' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'trust' ? '3px solid #f97316' : '3px solid transparent',
            color: activeTab === 'trust' ? '#f97316' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
        >
          <ShieldCheck size={18} />
          Garantias & Compra Segura
        </button>
      </div>

      {/* Conteúdo da Aba */}
      <div style={{ padding: '2rem' }}>
        {/* ABA 1: Especificações & Ficha da Oferta */}
        {activeTab === 'specs' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#f1f5f9' }}>
              📋 Ficha Detalhada da Oferta
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}>
              {/* Item: Loja Parceira */}
              <div style={{
                background: '#1e293b',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '0.6rem', borderRadius: '0.5rem', color: '#f97316' }}>
                  <Store size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Loja / Vendedor Oficial</div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {storeName}
                    <span style={{ fontSize: '0.7rem', background: '#22c55e', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                      Parceiro Verificado
                    </span>
                  </div>
                </div>
              </div>

              {/* Item: Categoria */}
              <div style={{
                background: '#1e293b',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.6rem', borderRadius: '0.5rem', color: '#3b82f6' }}>
                  <Tag size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Categoria Principal</div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{categoryName}</div>
                </div>
              </div>

              {/* Item: Preço & Desconto */}
              <div style={{
                background: '#1e293b',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '0.6rem', borderRadius: '0.5rem', color: '#22c55e' }}>
                  <Award size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Condição de Preço</div>
                  <div style={{ fontWeight: 700, color: '#22c55e' }}>
                    {formatPrice(priceCurrent)} {discountPct > 0 && `(-${Math.round(discountPct)}%)`}
                    {savings > 0 && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                        Poupas {formatPrice(savings)} face ao preço de {formatPrice(priceOriginal)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Item: Deal Score */}
              <div style={{
                background: '#1e293b',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '0.6rem', borderRadius: '0.5rem', color: '#eab308' }}>
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Índice de Qualidade Radar</div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9' }}>
                    {Math.round(parseFloat(offer.dealScore || '80'))} / 100
                    {isMinHistoric && <span style={{ marginLeft: '0.5rem', color: '#ef4444' }}>🔥 Mínimo Histórico</span>}
                  </div>
                </div>
              </div>

              {/* Item: Disponibilidade */}
              <div style={{
                background: '#1e293b',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.6rem', borderRadius: '0.5rem', color: '#10b981' }}>
                  <Truck size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Disponibilidade & Entrega</div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9' }}>
                    Disponível na Loja Oficial
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Expedição direta por {storeName}</div>
                </div>
              </div>

              {/* Item: Garantia Legal */}
              <div style={{
                background: '#1e293b',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.6rem', borderRadius: '0.5rem', color: '#a855f7' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Garantia & Devoluções</div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9' }}>
                    Garantia Oficial do Vendedor
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>14 dias de livre resolução na UE</div>
                </div>
              </div>

              {/* Item: Código / SKU */}
              {offer.externalId && (
                <div style={{
                  background: '#1e293b',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #334155',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <div style={{ background: 'rgba(148, 163, 184, 0.1)', padding: '0.6rem', borderRadius: '0.5rem', color: '#94a3b8' }}>
                    <Barcode size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Identificador / SKU da Oferta</div>
                    <div style={{ fontWeight: 700, color: '#cbd5e1', fontSize: '0.85rem' }}>{offer.externalId}</div>
                  </div>
                </div>
              )}

              {/* Item: Última Atualização */}
              <div style={{
                background: '#1e293b',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.6rem', borderRadius: '0.5rem', color: '#38bdf8' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Última Monitorização</div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.85rem' }}>
                    {new Date(offer.updatedAt || offer.publishedAt).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })} às {new Date(offer.updatedAt || offer.publishedAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: Sobre o Produto */}
        {activeTab === 'description' && (
          <div style={{ maxWidth: '800px', lineHeight: 1.8 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: '#f1f5f9' }}>
              📝 Descrição & Destaques de {offer.title}
            </h3>

            {offer.description ? (
              <div style={{ color: '#cbd5e1', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {offer.description}
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                <p style={{ marginBottom: '1rem' }}>
                  Esta oferta para <strong>{offer.title}</strong> foi identificada pelos nossos sistemas de monitorização na loja oficial <strong>{storeName}</strong>.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Atualmente encontra-se anunciada por <strong>{formatPrice(priceCurrent)}</strong>
                  {discountPct > 0 && ` com um desconto de cerca de ${Math.round(discountPct)}% face ao valor original de ${formatPrice(priceOriginal)}`}.
                </p>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#cbd5e1' }}>
                  <li>Artigo fornecido diretamente pelo parceiro <strong>{storeName}</strong>.</li>
                  <li>Elegível para entrega e apoio direto ao cliente da loja oficial.</li>
                  <li>Garantia legal aplicável e direito de devolução de 14 dias para compras online na União Europeia.</li>
                  <li>Link verificado contra fraudes e seguro para navegação.</li>
                </ul>
              </div>
            )}

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: '#1e293b',
              borderLeft: '4px solid #f97316',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              color: '#cbd5e1'
            }}>
              💡 <strong>Dica RadarOfertas:</strong> Os preços e o stock das lojas parceiras podem esgotar rapidamente. Clica em "Ver Oferta" para validar o preço final no checkout da loja antes de encomendar.
            </div>
          </div>
        )}

        {/* ABA 3: Garantias & Compra Segura */}
        {activeTab === 'trust' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#f1f5f9' }}>
              🛡️ Por que comprar através do RadarOfertas?
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}>
              <div style={{
                background: '#1e293b',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
              }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🔒</div>
                <h4 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>Ligação 100% Oficial</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  Não intermediamos pagamentos nem recolhemos dados de cartão. O nosso botão encaminha-te diretamente para o servidor seguro da loja <strong>{storeName}</strong>.
                </p>
              </div>

              <div style={{
                background: '#1e293b',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
              }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>💶</div>
                <h4 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>Transparência de Preço</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  Rastreamos o valor de mercado e assinalamos promoções reais através do nosso Deal Score, para saberes exatamente quando estás a poupar.
                </p>
              </div>

              <div style={{
                background: '#1e293b',
                padding: '1.25rem',
                borderRadius: '0.75rem',
                border: '1px solid #334155',
              }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>⚖️</div>
                <h4 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>Direitos do Consumidor</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  Todas as compras beneficiam do direito de livre resolução (14 dias para devolver) e da garantia legal europeia fornecida pelo comerciante.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
