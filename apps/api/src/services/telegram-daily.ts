import { db } from '@radarofertas/db/client'
import { offers, stores } from '@radarofertas/db/schema'
import { desc, eq, and, gt, notInArray } from 'drizzle-orm'
import { sendRawTelegram } from '../lib/telegram.js'
import { qualifiedOfferCondition } from '../lib/qualified-offer.js'

// IDs das ofertas já publicadas nesta sessão — evita repetir a mesma oferta
// no mesmo dia mesmo que o servidor reinicie (ficam na memória até restart)
const recentlyPostedIds = new Set<number>()

// Limpar histórico de publicações 1x por dia à meia-noite
// (para que o pool de ofertas "disponíveis" se renove todos os dias)
setInterval(() => {
  const now = new Date()
  if (now.getHours() === 0 && now.getMinutes() < 5) {
    recentlyPostedIds.clear()
    console.log('🔄 Telegram Daily: histórico de publicações limpo para o novo dia.')
  }
}, 5 * 60 * 1000) // verifica a cada 5 min

/**
 * Procura a melhor oferta ativa que ainda não foi publicada hoje
 * e envia-a para o canal do Telegram.
 *
 * @param slot 'morning' | 'afternoon' | 'evening' — usado apenas no log
 * @param minScore score mínimo para considerar a oferta
 * @param minDiscount desconto mínimo (%) para considerar
 */
export async function sendDailyOffer(
  slot: 'morning' | 'afternoon' | 'evening' = 'morning',
  minScore = 40,
  minDiscount = 0
) {
  console.log(`📢 Telegram Daily [${slot}]: a procurar a melhor oferta...`)

  try {
    // Construir query base (apenas ofertas ativas e qualificadas)
    const conditions = [
      eq(offers.status, 'active'),
      qualifiedOfferCondition(),
      gt(offers.dealScore, minScore.toFixed(2)),
    ]

    // Excluir ofertas já publicadas nesta sessão
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
        imageUrl: offers.imageUrl,
        affiliateUrl: offers.affiliateUrl,
        couponCode: offers.couponCode,
        isMinHistoric: offers.isMinHistoric,
        storeName: stores.name,
      })
      .from(offers)
      .leftJoin(stores, eq(offers.storeId, stores.id))
      .where(and(...conditions))
      .orderBy(desc(offers.dealScore), desc(offers.discountPct))
      .limit(10)

    // Filtrar por desconto mínimo (se definido)
    const candidates = minDiscount > 0
      ? results.filter(o => Number(o.discountPct) >= minDiscount)
      : results

    if (candidates.length === 0) {
      console.log(`⚠️ Telegram Daily [${slot}]: Nenhuma oferta elegível encontrada.`)
      return
    }

    const offer = candidates[0]
    recentlyPostedIds.add(offer.id)

    const siteUrl = `https://radarofertas-psi.vercel.app/oferta/${offer.slug}`
    const discount = Number(offer.discountPct)
    const current = Number(offer.priceCurrent)
    const original = Number(offer.priceOriginal)
    const displayTitle = offer.titlePt || offer.title

    const isAmazon = Boolean(offer.storeName?.toLowerCase().includes('amazon') || offer.affiliateUrl?.includes('amazon'))

    // Construir título com emoji adequado ao slot
    let slotEmoji = '☀️'; if (slot === 'afternoon') slotEmoji = '⚡'; if (slot === 'evening') slotEmoji = '🌙';
    const dealEmoji = !isAmazon && Number(offer.dealScore) >= 80 ? '🔥🔥🔥' : !isAmazon && Number(offer.dealScore) >= 60 ? '🔥🔥' : '🔥'

    // Montar mensagem rica
    let text = `${slotEmoji} *OFERTA DO DIA* ${dealEmoji}\n\n`
    text += `📦 *${displayTitle}*\n\n`

    if (isAmazon) {
      text += `💰 Preço atualizado em direto na Amazon. Clica no link para ver:\n`
    } else if (original > current && discount > 0) {
      text += `💰 *€${current.toFixed(2)}* ~~(antes €${original.toFixed(2)})~~\n`
      text += `📉 Desconto: *-${Math.round(discount)}%*\n`
    } else {
      text += `💰 Preço: *€${current.toFixed(2)}*\n`
    }

    if (!isAmazon && offer.isMinHistoric) {
      text += `⚠️ *MÍNIMO HISTÓRICO* — nunca esteve tão barato!\n`
    }

    if (offer.couponCode) {
      text += `🎟️ Cupão: \`${offer.couponCode}\`\n`
    }

    if (offer.storeName) {
      text += `🏪 Loja: ${offer.storeName}\n`
    }

    text += isAmazon
      ? `\n🛒 [Ver preço atual na Amazon](${siteUrl})\n`
      : `\n🛒 [Ver Oferta](${siteUrl})\n`
    text += `\n#PromocoesPT #Descontos #RadarOfertas`

    await sendRawTelegram(text, offer.imageUrl ?? undefined)

    console.log(`✅ Telegram Daily [${slot}]: publicado — "${offer.title.slice(0, 50)}" (score: ${offer.dealScore}, -${Math.round(discount)}%)`)
  } catch (err) {
    console.error(`❌ Telegram Daily [${slot}]: erro ao publicar:`, err)
  }
}
