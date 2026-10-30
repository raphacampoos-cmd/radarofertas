/**
 * RadarOfertas — Price Recorder com Deal Score
 * Cron job que regista o preço atual de cada oferta ativa na price_history
 * e recalcula o deal_score automaticamente.
 *
 * Executa com: npx tsx packages/db/src/price-recorder.ts
 * Em produção: Railway Cron Job ou Vercel Cron (a cada hora)
 */

import { db } from './client'
import { offers, priceHistory, stores } from './schema'
import { eq, and, gte, sql, avg } from 'drizzle-orm'
import { calculateDealScore } from '../../deal-engine/src/index'

async function calculateAvg90Days(offerId: number): Promise<number | null> {
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const result = await db
    .select({ avgPrice: avg(priceHistory.price) })
    .from(priceHistory)
    .where(
      and(
        eq(priceHistory.offerId, offerId),
        gte(priceHistory.recordedAt, ninetyDaysAgo)
      )
    )

  const avgPrice = result[0]?.avgPrice
  return avgPrice ? parseFloat(avgPrice.toString()) : null
}

async function recordPrices() {
  console.log(`[${new Date().toISOString()}] 📊 Price Recorder a iniciar...`)

  // Buscar todas as ofertas ativas com dados necessários
  const activeOffers = await db
    .select({
      id: offers.id,
      title: offers.title,
      storeId: offers.storeId,
      priceCurrent: offers.priceCurrent,
      priceOriginal: offers.priceOriginal,
      priceMinimum: offers.priceMinimum,
      discountPct: offers.discountPct,
      couponCode: offers.couponCode,
      expiresAt: offers.expiresAt,
    })
    .from(offers)
    .where(eq(offers.status, 'active'))

  console.log(`[INFO] ${activeOffers.length} ofertas ativas encontradas`)

  // Buscar fiabilidade das lojas
  const storeIds = Array.from(new Set(activeOffers.map(o => o.storeId)))
  const storeData = await db
    .select({
      id: stores.id,
      reliability: stores.reliability,
      commissionMin: stores.commissionMin,
      commissionMax: stores.commissionMax,
    })
    .from(stores)
    .where(sql`${stores.id} IN (${storeIds.join(',')})`)

  const storeMap = new Map(storeData.map(s => [s.id, s]))

  let recorded = 0
  let minUpdated = 0
  let scoreUpdated = 0

  for (const offer of activeOffers) {
    const priceCurrentVal = offer.priceCurrent
    if (!priceCurrentVal) continue

    const currentPrice = parseFloat(priceCurrentVal.toString())
    const originalPrice = offer.priceOriginal ? parseFloat(offer.priceOriginal.toString()) : null
    const minPrice = offer.priceMinimum ? parseFloat(offer.priceMinimum.toString()) : null
    const isNewMin = minPrice === null || currentPrice < minPrice

    // Inserir registo no histórico
    await db.insert(priceHistory).values({
      offerId: offer.id,
      storeId: offer.storeId,
      price: priceCurrentVal,
      isMinimum: isNewMin,
      source: 'cron',
    })

    // Atualizar mínimo histórico se necessário
    if (isNewMin) {
      await db
        .update(offers)
        .set({
          priceMinimum: priceCurrentVal,
          isMinHistoric: true,
          updatedAt: new Date(),
        })
        .where(eq(offers.id, offer.id))
      minUpdated++
    }

    // Calcular deal score
    const store = storeMap.get(offer.storeId)
    const storeReliability = store ? parseFloat(store.reliability.toString()) : 0.85
    const commissionRate = store && store.commissionMax
      ? parseFloat(store.commissionMax.toString())
      : 0.04

    // Calcular média 90 dias
    const priceAvg90Days = await calculateAvg90Days(offer.id)

    // Calcular dias até expiração
    let daysUntilExpiry: number | null = null
    if (offer.expiresAt) {
      const diff = new Date(offer.expiresAt).getTime() - Date.now()
      daysUntilExpiry = Math.ceil(diff / (1000 * 60 * 60 * 24))
    }

    const scoreResult = calculateDealScore({
      priceCurrent,
      priceOriginal: originalPrice ?? currentPrice,
      priceMinHistoric: minPrice,
      priceAvg90Days,
      storeReliability,
      daysUntilExpiry,
      commissionRate,
    })

    // Atualizar deal_score na oferta
    await db
      .update(offers)
      .set({
        dealScore: scoreResult.score.toFixed(2),
        isMinHistoric: scoreResult.isHistoricMinimum,
        updatedAt: new Date(),
      })
      .where(eq(offers.id, offer.id))

    scoreUpdated++
    recorded++

    if (recorded % 50 === 0) {
      console.log(`[PROGRESSO] ${recorded}/${activeOffers.length} processadas...`)
    }
  }

  console.log(`[✅] ${recorded} preços registados, ${minUpdated} novos mínimos, ${scoreUpdated} scores atualizados`)
  console.log(`[${new Date().toISOString()}] Price Recorder concluído.`)
}

// Executar
recordPrices()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('[ERROR]', err)
    process.exit(1)
  })