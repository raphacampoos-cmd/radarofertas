import { TwitterApi } from 'twitter-api-v2'
import { db } from '@radarofertas/db/client'
import { offers } from '@radarofertas/db/schema'
import { desc, and, eq, sql } from 'drizzle-orm'

export async function runSocialBot() {
  console.log('🤖 A iniciar o Social Promo Bot...')

  // 1. Encontrar a melhor oferta do dia (Maior desconto, score alto)
  const [topOffer] = await db.select()
    .from(offers)
    .where(and(eq(offers.status, 'active')))
    .orderBy(desc(offers.dealScore), desc(offers.discountPct))
    .limit(1)

  if (!topOffer) {
    console.log('❌ Nenhuma oferta ativa encontrada.')
    return
  }

  // 2. Preparar a mensagem / copy
  const discountText = Number(topOffer.discountPct) > 0 ? `🔥 -${Number(topOffer.discountPct).toFixed(0)}% DESCONTO 🔥` : '🚨 PREÇO BOMBÁSTICO 🚨'
  const url = `https://radarofertas-psi.vercel.app/oferta/${topOffer.slug}`
  
  const msgText = `${discountText}

${topOffer.title}

💰 Está a €${topOffer.priceCurrent} (antes €${topOffer.priceOriginal})
${topOffer.isMinHistoric ? '⚠️ É O PREÇO MAIS BAIXO DE SEMPRE!\n' : ''}
🛒 Compra antes que esgote:
👉 ${url}

#PromocoesPT #Descontos #AmazonPT #RadarOfertas`

  console.log('📝 Mensagem gerada:\n', msgText)

  // 3. Postar no Discord (Usando o nosso Agente / Bot nativo)
  const { sendOfferToDiscord } = await import('./discord-bot.js');
  await sendOfferToDiscord(topOffer);
  console.log('✅ Tentativa de postar no Discord com o Agente efetuada!')

  // 4. Postar no Twitter / X (Se houver chaves de API)
  if (
    process.env.TWITTER_API_KEY &&
    process.env.TWITTER_API_SECRET &&
    process.env.TWITTER_ACCESS_TOKEN &&
    process.env.TWITTER_ACCESS_SECRET
  ) {
    try {
      const client = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });

      // API v2 para postar tweets de texto
      await client.v2.tweet(msgText);
      console.log('✅ Postado no Twitter / X com sucesso!')
    } catch (err) {
      console.error('❌ Erro no Twitter:', err)
    }
  } else {
    console.log('⚠️ Chaves da API do Twitter em falta. Saltou o Twitter.')
  }
}

// Se o script for corrido diretamente no terminal
if (process.argv[1].includes('social-bot')) {
  runSocialBot().then(() => process.exit(0))
}
