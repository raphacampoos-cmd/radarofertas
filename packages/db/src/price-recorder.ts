/**
 * RadarOfertas — Price Recorder
 * Cron job que regista o preço atual de cada oferta ativa na price_history.
 *
 * Executa com: node ../../node_modules/.pnpm/tsx@4.23.13/node_modules/tsx/dist/cli.mjs src/price-recorder.ts
 * Em produção: Railway Cron Job ou Vercel Cron (a cada hora)
 */

import { db } from './client'
import { offers, priceHistory } from './schema'
import { eq } from 'drizzle-orm'

async function recordPrices() {
  console.log(`[${new Date().toISOString()}] 📊 Price Recorder a iniciar...`)

  // Buscar todas as ofertas ativas
  const activeOffers = await db
    .select({
      id: offers.id,
      title: offers.title,
      storeId: offers.storeId,
      priceCurrent: offers.priceCurrent,
      priceMinimum: offers.priceMinimum,
    })
    .from(offers)
    .where(eq(offers.status, 'active'))

  console.log(`[INFO] ${activeOffers.length} ofertas ativas encontradas`)

  let recorded = 0
  let minUpdated = 0

  for (const offer of activeOffers) {
    if (!offer.priceCurrent) continue

    const currentPrice = parseFloat(offer.priceCurrent.toString())
    const minPrice = offer.priceMinimum ? parseFloat(offer.priceMinimum.toString()) : null
    const isNewMin = minPrice === null || currentPrice < minPrice

    // Inserir registo no histórico
    await db.insert(priceHistory).values({
      offerId: offer.id,
      storeId: offer.storeId,
      price: offer.priceCurrent,
      isMinimum: isNewMin,
      source: 'cron',
    })

    // Atualizar mínimo histórico se necessário
    if (isNewMin) {
      await db
        .update(offers)
        .set({
          priceMinimum: offer.priceCurrent,
          isMinHistoric: true,
          updatedAt: new Date(),
        })
        .where(eq(offers.id, offer.id))
      minUpdated++
    }

    recorded++
  }

  console.log(`[✅] ${recorded} preços registados, ${minUpdated} novos mínimos históricos`)
  console.log(`[${new Date().toISOString()}] Price Recorder concluído.`)
}

// Executar
recordPrices()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('[ERROR]', err)
    process.exit(1)
  })
