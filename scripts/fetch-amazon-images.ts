import { db } from '@radarofertas/db/client'
import { offers } from '@radarofertas/db/schema'
import { like, isNotNull } from 'drizzle-orm'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

async function getAmazonImage(asin: string): Promise<string | null> {
  const url = `https://www.amazon.es/dp/${asin}`
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        'Accept-Language': 'pt-PT,pt;q=0.9,es;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    })
    const html = await res.text()

    // Tentar og:image primeiro
    const ogMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
      || html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)
    if (ogMatch?.[1] && ogMatch[1].includes('media-amazon.com')) {
      return ogMatch[1]
    }

    // Tentar landingImage (imagem principal Amazon)
    const landingMatch = html.match(/"large":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.jpg)"/i)
      || html.match(/data-old-hires="(https:\/\/[^"]+media-amazon\.com[^"]+\.jpg)"/i)
      || html.match(/"hiRes":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.jpg)"/i)
    if (landingMatch?.[1]) return landingMatch[1]

    // Tentar imagem principal
    const imgMatch = html.match(/id="landingImage"[^>]+src="(https:\/\/[^"]+media-amazon\.com[^"]+\.jpg)"/i)
    if (imgMatch?.[1]) return imgMatch[1]

    return null
  } catch (e) {
    return null
  }
}

async function main() {
  const amazonOffers = await db.select({
    id: offers.id,
    title: offers.title,
    affiliateUrl: offers.affiliateUrl,
  }).from(offers).where(like(offers.affiliateUrl, '%amazon%'))

  console.log(`📦 ${amazonOffers.length} ofertas Amazon encontradas`)
  console.log('🔍 A buscar imagens reais...\n')

  let updated = 0
  let failed = 0

  for (const offer of amazonOffers) {
    // Extrair ASIN da URL
    const asinMatch = offer.affiliateUrl?.match(/\/dp\/([A-Z0-9]{10})/i)
    if (!asinMatch) { failed++; continue }
    const asin = asinMatch[1]

    const imageUrl = await getAmazonImage(asin)
    if (imageUrl) {
      await db.update(offers)
        .set({ imageUrl })
        // @ts-ignore
        .where(require('drizzle-orm').eq(offers.id, offer.id))

      updated++
      console.log(`✅ [${offer.id}] ${offer.title.slice(0, 50)}`)
      console.log(`   ${imageUrl.slice(0, 80)}`)
    } else {
      failed++
      console.log(`❌ [${offer.id}] ${offer.title.slice(0, 50)} — sem imagem`)
    }

    // Pausa entre requests para não ser bloqueado
    await new Promise(r => setTimeout(r, 1500))
  }

  console.log(`\n===================================`)
  console.log(`✅ Atualizadas: ${updated}`)
  console.log(`❌ Sem imagem: ${failed}`)
}

main().catch(console.error)
