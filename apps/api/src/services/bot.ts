import { db } from '@radarofertas/db/client'
import { offers, priceHistory } from '@radarofertas/db/schema'
import { eq } from 'drizzle-orm'
import { sendTelegramAlert } from '../lib/telegram.js'
import { fetchAwinFeed } from '../lib/awin-feed.js'
import { extractAmazonPrice } from '../lib/amazon-price.js'
import { calculateDealScore } from '@radarofertas/deal-engine'

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Variações fora desta banda em relação ao preço anterior quase sempre são leituras
// erradas da página (variante, vendedor externo, etc.), não promoções reais.
const MAX_PRICE_RATIO = 2.5
const MIN_PRICE_RATIO = 0.4

async function checkPrice(offer: any) {
  try {
    const res = await fetch(offer.affiliateUrl, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html',
        'Accept-Language': 'pt-PT,pt;q=0.9'
      },
      signal: AbortSignal.timeout(15000)
    });
    
    if (!res.ok) return null;
    const html = await res.text();

    if (offer.affiliateUrl.includes('amazon')) {
      return extractAmazonPrice(html);
    }
    
    return null;
  } catch (e) {
    return null;
  }
}

// Aplica uma nova cotação a uma oferta: atualiza preço/mínimo, regista histórico
// e dispara notificações quando o preço desceu. Partilhado entre Amazon e Awin.
async function applyPriceUpdate(offer: typeof offers.$inferSelect, newPrice: number) {
  const oldPrice = parseFloat(offer.priceCurrent || '0')

  if (newPrice === oldPrice) {
    await db.update(offers).set({ updatedAt: new Date() }).where(eq(offers.id, offer.id))
    return 'unchanged' as const
  }

  if (oldPrice > 0) {
    const ratio = newPrice / oldPrice
    if (ratio > MAX_PRICE_RATIO || ratio < MIN_PRICE_RATIO) {
      console.warn(`⚠️ Preço suspeito ignorado: ${offer.title.slice(0, 30)} ${oldPrice}€ -> ${newPrice}€`)
      return 'skipped' as const
    }
  }

  const isMin = newPrice < parseFloat(offer.priceMinimum || '0')
  const priceOriginal = parseFloat(offer.priceOriginal || '0')
  const discountPct = priceOriginal > newPrice ? ((priceOriginal - newPrice) / priceOriginal) * 100 : 0
  const score = priceOriginal > 0
    ? calculateDealScore({
        priceCurrent: newPrice,
        priceOriginal,
        priceMinHistoric: offer.priceMinimum ? parseFloat(offer.priceMinimum) : null,
        priceAvg90Days: null,
      }).score
    : parseFloat(offer.dealScore || '0')

  await db.update(offers).set({
    priceCurrent: newPrice.toFixed(2),
    priceMinimum: isMin ? newPrice.toFixed(2) : (offer.priceMinimum || newPrice.toFixed(2)),
    isMinHistoric: isMin,
    discountPct: discountPct.toFixed(2),
    dealScore: score.toFixed(2),
    updatedAt: new Date()
  }).where(eq(offers.id, offer.id))

  await db.insert(priceHistory).values({
    offerId: offer.id,
    storeId: offer.storeId,
    price: newPrice.toFixed(2),
    source: 'auto'
  })

  if (newPrice > oldPrice) {
    console.log(`📈 Subida: ${offer.title.slice(0, 30)} subiu para ${newPrice}€`)
    return 'increased' as const
  }

  console.log(`📉 Bot detetou queda! ${offer.title.slice(0, 30)}: ${oldPrice}€ -> ${newPrice}€`)

  sendTelegramAlert({
    title: `📉 BAIXOU O PREÇO! ${offer.title}`,
    priceCurrent: newPrice.toFixed(2),
    priceOriginal: oldPrice.toFixed(2),
    affiliateUrl: offer.affiliateUrl,
    imageUrl: offer.imageUrl || undefined,
    couponCode: offer.couponCode || undefined
  }).catch(console.error)

  if (process.env.WHATSAPP_GROUP_ID) {
    const { sendWhatsAppMessage } = await import('../lib/whatsapp.js')
    const wppMsg = `📉 *BAIXOU O PREÇO!*\n\n🔥 *${offer.title}*\n\n💰 Agora: €${newPrice.toFixed(2)} (antes €${oldPrice.toFixed(2)})\n👉 Compra aqui: ${offer.affiliateUrl}`
    sendWhatsAppMessage(process.env.WHATSAPP_GROUP_ID, wppMsg, offer.imageUrl || undefined).catch(console.error)
  }

  return 'decreased' as const
}

// Ofertas Amazon: cada uma exige o seu próprio pedido HTTP (scraping da página do produto)
async function trackAmazonOffers(amazonOffers: (typeof offers.$inferSelect)[]) {
  let updatedCount = 0

  for (const offer of amazonOffers) {
    const newPrice = await checkPrice(offer)

    if (newPrice && newPrice > 0) {
      const result = await applyPriceUpdate(offer, newPrice)
      if (result !== 'unchanged' && result !== 'skipped') updatedCount++
    }

    // Esperar 4 segundos entre consultas para não irritar a Amazon
    await new Promise(r => setTimeout(r, 4000))
  }

  return updatedCount
}

// Ofertas Awin: não há scraping por loja (cada merchant tem HTML diferente).
// Em vez disso reaproveitamos o feed oficial (1 único pedido) e casamos pelo externalId
// (aw_product_id), que é o mesmo ID gravado pelo awin-api-bot na ingestão.
export async function trackAwinOffers(awinOffers: (typeof offers.$inferSelect)[]) {
  if (awinOffers.length === 0) return 0

  let priceByExternalId: Map<string, number>
  try {
    const rows = await fetchAwinFeed()
    priceByExternalId = new Map(
      rows
        .filter(r => r.aw_product_id && r.search_price && Number(r.search_price) > 0)
        .map(r => [r.aw_product_id, Number(r.search_price)])
    )
  } catch (err) {
    console.error('⚠️ Falha ao obter o feed Awin para atualização de preços:', err)
    return 0
  }

  let updatedCount = 0
  for (const offer of awinOffers) {
    if (!offer.externalId) continue
    const newPrice = priceByExternalId.get(offer.externalId)
    if (!newPrice) continue // produto já não consta no feed (fora de stock ou descontinuado)

    const result = await applyPriceUpdate(offer, newPrice)
    if (result !== 'unchanged' && result !== 'skipped') updatedCount++
  }

  return updatedCount
}

export async function runPriceBot() {
  console.log('🤖 Bot Rastreador: A iniciar ronda de verificação de preços...');

  try {
    // Buscar apenas ofertas ativas
    const allOffers = await db.select().from(offers).where(eq(offers.status, 'active'));

    const amazonOffers = allOffers.filter(o => o.affiliateUrl?.includes('amazon'))
    const awinOffers = allOffers.filter(o => o.source === 'awin_api')

    console.log(`🔎 A verificar ${amazonOffers.length} ofertas Amazon (scraping) e ${awinOffers.length} ofertas Awin (feed oficial)...`)

    const amazonUpdated = await trackAmazonOffers(amazonOffers)
    const awinUpdated = await trackAwinOffers(awinOffers)

    console.log(`✅ Bot Rastreador: Ronda concluída. ${amazonUpdated + awinUpdated} ofertas atualizadas (${amazonUpdated} Amazon, ${awinUpdated} Awin).`);
  } catch (err) {
    console.error('Erro na ronda do Bot:', err);
  }
}

export function startBotScheduler() {
  // Corre o bot 15 segundos após o servidor iniciar (para testes e arranques imediatos)
  setTimeout(() => runPriceBot().catch(console.error), 15000);
  
  // Depois, agenda para correr a cada 2 horas (2 * 60 * 60 * 1000)
  setInterval(() => {
    runPriceBot().catch(console.error);
  }, 7200000);
}
