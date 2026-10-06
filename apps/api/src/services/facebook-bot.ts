import { db } from '@radarofertas/db/client'
import { offers, stores } from '@radarofertas/db/schema'
import { desc, eq, and, gt, notInArray } from 'drizzle-orm'
import { qualifiedOfferCondition } from '../lib/qualified-offer.js'
import { GoogleGenAI } from '@google/genai'

const recentlyPostedIds = new Set<number>()

// Limpar histórico à meia-noite
setInterval(() => {
  const now = new Date()
  if (now.getHours() === 0 && now.getMinutes() < 5) {
    recentlyPostedIds.clear()
    console.log('🔄 Facebook Bot: histórico limpo.')
  }
}, 5 * 60 * 1000)

/**
 * Publica uma oferta na Página de Facebook oficial.
 */
export async function postToFacebook() {
  const PAGE_ID = process.env.FB_PAGE_ID
  const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN

  if (!PAGE_ID || !ACCESS_TOKEN) {
    console.log('⚠️ Facebook Bot: Faltam as credenciais (FB_PAGE_ID ou FB_ACCESS_TOKEN). A abortar.')
    return
  }

  console.log('📱 Facebook Bot: A procurar a melhor oferta...')

  try {
    const conditions = [
      eq(offers.status, 'active'),
      qualifiedOfferCondition(),
      gt(offers.dealScore, '50.00'), // Apenas ofertas muito boas no FB
    ]

    if (recentlyPostedIds.size > 0) {
      conditions.push(notInArray(offers.id, [...recentlyPostedIds]))
    }

    const results = await db
      .select({
        id: offers.id,
        title: offers.title,
        titlePt: offers.titlePt,
        slug: offers.slug,
        priceCurrent: offers.priceCurrent,
        priceOriginal: offers.priceOriginal,
        discountPct: offers.discountPct,
        dealScore: offers.dealScore,
        couponCode: offers.couponCode,
        storeName: stores.name,
      })
      .from(offers)
      .leftJoin(stores, eq(offers.storeId, stores.id))
      .where(and(...conditions))
      .orderBy(desc(offers.dealScore))
      .limit(10)

    if (results.length === 0) {
      console.log('⚠️ Facebook Bot: Nenhuma oferta encontrada para publicar.')
      return
    }

    const offer = results[0]
    recentlyPostedIds.add(offer.id)

    // 1. Gerar o texto com Inteligência Artificial
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const prompt = `Escreve um post curto e altamente viral para o Facebook sobre esta oferta.
Usa emojis atrativos, mas não muitos. Cria urgência.
O post NÃO deve ter o link da oferta no corpo do texto (porque o Facebook corta o alcance).
Deve terminar a dizer explicitamente "🔗 Link da oferta no 1º comentário abaixo! 👇"
Informação da oferta:
Título: ${offer.titlePt || offer.title}
Preço Original: ${offer.priceOriginal}
Preço Atual: ${offer.priceCurrent}
Cupão: ${offer.couponCode || 'Nenhum'}
Loja: ${offer.storeName}
Nota: Escreve apenas o texto do post, sem aspas nem explicações.`

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    
    const caption = aiResponse.text || `🔥 NOVA OFERTA INCRÍVEL: ${offer.titlePt || offer.title}\n\n🔗 Link no 1º comentário abaixo! 👇`

    // 2. Imagem OpenGraph dinâmica do nosso site
    const imageUrl = `https://radarofertas-psi.vercel.app/oferta/${offer.slug}/opengraph-image`

    // 3. Publicar a Foto na Página do Facebook
    console.log(`📱 Facebook Bot: A publicar a foto...`)
    const photoRes = await fetch(`https://graph.facebook.com/v19.0/${PAGE_ID}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: imageUrl,
        caption: caption,
        access_token: ACCESS_TOKEN
      })
    })

    const photoData = await photoRes.json()

    if (!photoRes.ok) {
      console.error('❌ Erro a publicar no Facebook:', photoData)
      return
    }

    const postId = photoData.id
    console.log(`✅ Foto publicada com sucesso! Post ID: ${postId}`)

    // 4. Inserir o link no 1º Comentário
    const siteUrl = `https://radarofertas-psi.vercel.app/oferta/${offer.slug}`
    const commentText = `👇 Garante já antes que esgote ou o preço suba:\n👉 ${siteUrl}`

    const commentRes = await fetch(`https://graph.facebook.com/v19.0/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: commentText,
        access_token: ACCESS_TOKEN
      })
    })

    if (!commentRes.ok) {
      console.error('❌ Erro a adicionar comentário:', await commentRes.json())
    } else {
      console.log('✅ Link inserido com sucesso no 1º comentário!')
    }

  } catch (err) {
    console.error('❌ Erro no Facebook Bot:', err)
  }
}
