import { db } from '@radarofertas/db/client'
import { offers, priceHistory } from '@radarofertas/db/schema'
import { eq } from 'drizzle-orm'
import { sendTelegramAlert } from '../lib/telegram.js'

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function extractAmazonPrice(html: string) {
  const priceWholeMatch = html.match(/<span class="a-price-whole">([0-9.,]+)<\/span>/);
  const priceFractionMatch = html.match(/<span class="a-price-fraction">([0-9]+)<\/span>/);
  
  if (priceWholeMatch) {
    let whole = priceWholeMatch[1].replace(/[^0-9]/g, '');
    let fraction = priceFractionMatch ? priceFractionMatch[1] : '00';
    return parseFloat(`${whole}.${fraction}`);
  }

  const offscreenMatch = html.match(/<span class="a-offscreen">[^\d]*([0-9.,]+)[^\d]*<\/span>/);
  if (offscreenMatch) {
    return parseFloat(offscreenMatch[1].replace(',', '.'));
  }

  return null;
}

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
      return await extractAmazonPrice(html);
    } 
    
    return null;
  } catch (e) {
    return null;
  }
}

export async function runPriceBot() {
  console.log('🤖 Bot Rastreador: A iniciar ronda de verificação de preços...');
  
  try {
    // Buscar apenas ofertas ativas
    const allOffers = await db.select().from(offers).where(eq(offers.status, 'active'));
    let updatedCount = 0;

    for (const offer of allOffers) {
      if (!offer.affiliateUrl || !offer.affiliateUrl.includes('amazon')) continue;

      const oldPrice = parseFloat(offer.priceCurrent);
      const newPrice = await checkPrice(offer);

      if (newPrice && newPrice > 0 && newPrice < oldPrice) {
        console.log(`📉 Bot detetou queda! ${offer.title.slice(0,30)}: ${oldPrice}€ -> ${newPrice}€`);
        
        // 1. Atualizar preço atual e preço mínimo na tabela de ofertas
        const isMin = newPrice < parseFloat(offer.priceMinimum);
        await db.update(offers).set({ 
          priceCurrent: newPrice.toFixed(2),
          priceMinimum: isMin ? newPrice.toFixed(2) : offer.priceMinimum,
          isMinHistoric: isMin,
          updatedAt: new Date()
        }).where(eq(offers.id, offer.id));

        // 2. Registar histórico
        await db.insert(priceHistory).values({
          offerId: offer.id,
          storeId: offer.storeId,
          price: newPrice.toFixed(2),
          source: 'auto'
        });

        // 3. Disparar notificações
        // Telegram
        sendTelegramAlert({
          title: `📉 BAIXOU O PREÇO! ${offer.title}`,
          priceCurrent: newPrice.toFixed(2),
          priceOriginal: oldPrice.toFixed(2),
          affiliateUrl: offer.affiliateUrl,
          imageUrl: offer.imageUrl || undefined,
          couponCode: offer.couponCode || undefined
        }).catch(console.error);
        
        // WhatsApp
        const { sendWhatsAppMessage } = await import('../lib/whatsapp.js');
        if (process.env.WHATSAPP_GROUP_ID) {
           const wppMsg = `📉 *BAIXOU O PREÇO!*\n\n🔥 *${offer.title}*\n\n💰 Agora: €${newPrice.toFixed(2)} (antes €${oldPrice.toFixed(2)})\n👉 Compra aqui: ${offer.affiliateUrl}`;
           sendWhatsAppMessage(process.env.WHATSAPP_GROUP_ID, wppMsg, offer.imageUrl || undefined).catch(console.error);
        }

        updatedCount++;
      } else if (newPrice && newPrice > oldPrice) {
        console.log(`📈 Subida ignorada: ${offer.title.slice(0,30)} subiu para ${newPrice}€`);
      }

      // Esperar 4 segundos entre consultas para não irritar a Amazon
      await new Promise(r => setTimeout(r, 4000));
    }

    console.log(`✅ Bot Rastreador: Ronda concluída. ${updatedCount} ofertas atualizadas.`);
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
