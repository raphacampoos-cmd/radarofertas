import { db } from '@radarofertas/db/client'
import { offers, stores } from '@radarofertas/db/schema'
import { desc, eq, and, gt, notInArray } from 'drizzle-orm'
import { qualifiedOfferCondition } from '../lib/qualified-offer.js'
import { GoogleGenAI } from '@google/genai'

const recentlyPinnedIds = new Set<number>()

// Limpar histórico recente a cada 24 horas
setInterval(() => {
  recentlyPinnedIds.clear()
  console.log('🔄 Pinterest Bot: histórico diário limpo.')
}, 24 * 60 * 60 * 1000)

/**
 * Cria um Pin na conta do Pinterest oficial via Pinterest API v5.
 */
export async function postToPinterest() {
  const ACCESS_TOKEN = process.env.PINTEREST_ACCESS_TOKEN
  const BOARD_ID = process.env.PINTEREST_BOARD_ID

  if (!ACCESS_TOKEN || !BOARD_ID) {
    console.log('⚠️ Pinterest Bot: Faltam credenciais (PINTEREST_ACCESS_TOKEN ou PINTEREST_BOARD_ID). Em pausa.')
    return
  }

  console.log('📌 Pinterest Bot: A pesquisar a melhor oferta para criar Pin...')

  try {
    const conditions = [
      eq(offers.status, 'active'),
      qualifiedOfferCondition(),
      gt(offers.dealScore, '50.00'),
    ]

    if (recentlyPinnedIds.size > 0) {
      conditions.push(notInArray(offers.id, [...recentlyPinnedIds]))
    }

    let results = await db
      .select({
        id: offers.id,
        title: offers.title,
        titlePt: offers.titlePt,
        slug: offers.slug,
        imageUrl: offers.imageUrl,
        priceCurrent: offers.priceCurrent,
        priceOriginal: offers.priceOriginal,
        discountPct: offers.discountPct,
        couponCode: offers.couponCode,
        storeName: stores.name,
      })
      .from(offers)
      .leftJoin(stores, eq(offers.storeId, stores.id))
      .where(and(...conditions))
      .orderBy(desc(offers.dealScore))
      .limit(10)

    if (results.length === 0 && recentlyPinnedIds.size > 0) {
      console.log('🔄 Pinterest Bot: Todas as ofertas foram publicadas. A reiniciar histórico...')
      recentlyPinnedIds.clear()
      results = await db
        .select({
          id: offers.id,
          title: offers.title,
          titlePt: offers.titlePt,
          slug: offers.slug,
          imageUrl: offers.imageUrl,
          priceCurrent: offers.priceCurrent,
          priceOriginal: offers.priceOriginal,
          discountPct: offers.discountPct,
          couponCode: offers.couponCode,
          storeName: stores.name,
        })
        .from(offers)
        .leftJoin(stores, eq(offers.storeId, stores.id))
        .where(and(eq(offers.status, 'active'), qualifiedOfferCondition(), gt(offers.dealScore, '50.00')))
        .orderBy(desc(offers.dealScore))
        .limit(10)
    }

    if (results.length === 0) {
      console.log('⚠️ Pinterest Bot: Nenhuma oferta qualificada encontrada.')
      return
    }

    const offer = results[0]
    recentlyPinnedIds.add(offer.id)

    // Garantir imagem válida com fallback
    const fallbackImage = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop'
    const imageUrl = (offer.imageUrl && offer.imageUrl.startsWith('http')) ? offer.imageUrl : fallbackImage

    // Gerar título e descrição otimizados para Pinterest SEO
    let title = (offer.titlePt || offer.title).slice(0, 95)
    let description = `Aproveita esta promoção imperdível: ${offer.titlePt || offer.title} por apenas €${offer.priceCurrent}`
    if (offer.priceOriginal) {
      description += ` (preço anterior: €${offer.priceOriginal}).`
    }
    if (offer.storeName) {
      description += ` Disponível na ${offer.storeName}.`
    }
    description += ' Consulta o histórico de preços e cupões no RadarOfertas! #descontos #promocoes #portugal #compras'

    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey })
        const prompt = `Escreve um título atraente (máximo 80 caracteres) e uma descrição rica em SEO para o Pinterest (máximo 300 caracteres) em Português de Portugal para a seguinte oferta:
Produto: ${offer.titlePt || offer.title}
Preço Atual: €${offer.priceCurrent}
Preço Original: €${offer.priceOriginal || 'N/A'}
Loja: ${offer.storeName || 'Online'}

Responde em JSON puro: {"title": "...", "description": "..."}`

        const res = await ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: prompt,
        })
        const clean = res.text?.replace(/```json|```/g, '').trim()
        if (clean) {
          const parsed = JSON.parse(clean)
          if (parsed.title) title = parsed.title.slice(0, 98)
          if (parsed.description) description = parsed.description.slice(0, 480)
        }
      } catch (aiErr: any) {
        console.warn('📌 Pinterest Bot: Falha leve na IA, a usar descrição padrão:', aiErr.message)
      }
    }

    const targetUrl = `https://radarofertas-psi.vercel.app/oferta/${offer.slug}`

    console.log(`📌 Pinterest Bot: A publicar Pin para "${title}"...`)

    const pinPayload = {
      board_id: BOARD_ID,
      title,
      description,
      link: targetUrl,
      media_source: {
        source_type: 'image_url',
        url: imageUrl,
      },
    }

    const response = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pinPayload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Pinterest Bot: Erro na API do Pinterest:', data)
      return
    }

    console.log(`✅ Pinterest Bot: Pin criado com sucesso! ID: ${data.id} - ${title}`)
  } catch (error: any) {
    console.error('❌ Pinterest Bot: Erro inesperado:', error.message)
  }
}
