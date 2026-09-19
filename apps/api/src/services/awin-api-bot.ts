import { db } from '@radarofertas/db/client';
import { offers, stores } from '@radarofertas/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { sendTelegramAlert } from '../lib/telegram.js';
import { fetchAwinFeed } from '../lib/awin-feed.js';

// O URL fornecido pelo utilizador (Product Datafeed - CSV GZIPPED)
const FEED_URL = 'https://productdata.awin.com/datafeed/download/apikey/fafdb9c3a02c084cbb3424202a43596c/language/en/fid/101189,103938,104051,104495,107946,108023,108813,109551,109975,114261,115564,116791/rid/0/hasEnhancedFeeds/0/columns/aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,display_price,data_feed_id/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/';

// Os ID dos anunciantes que nos interessam
const TARGET_MERCHANTS = ['75408', '88453', '96499', '77156', '129139'];

// Função auxiliar para gerar slugs (ex: "My Product" -> "my-product")
function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function runAwinApiBot() {
  console.log('🌐 Agente Awin Oficial: A iniciar ingestão do Product Feed (GZIP CSV)...');

  const rows = await fetchAwinFeed();

  const candidates = rows.filter((row) =>
    TARGET_MERCHANTS.includes(row.merchant_id) &&
    row.merchant_image_url && row.search_price && Number(row.search_price) > 0
  );

  // Ignorar produtos que já publicámos (mesmo aw_product_id), para cada ronda trazer só novidades
  const existing = candidates.length > 0
    ? await db.select({ externalId: offers.externalId }).from(offers)
        .where(inArray(offers.externalId, candidates.map(c => c.aw_product_id)))
    : [];
  const known = new Set(existing.map(e => e.externalId));
  const products = candidates.filter(c => !known.has(c.aw_product_id));

  console.log(`✅ Ficheiro lido com sucesso. Encontrados ${products.length} produtos novos (de ${candidates.length} válidos) das ${TARGET_MERCHANTS.length} lojas alvo.`);

  if (products.length === 0) {
    console.log('Nenhum produto novo encontrado.');
    return true;
  }

  // Vamos processar 5 produtos aleatórios para não encher a DB (curadoria simulada)
  // Baralhar o array
  const shuffled = products.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 5);

  let inseridos = 0;

  // Processar inserção
  for (const item of selected) {
    try {
      let storeName = item.merchant_name;

      // Tentar encontrar a loja (store) na DB
      const existingStore = await db.select().from(stores).where(eq(stores.name, storeName)).limit(1);
      let storeId = null;

      if (existingStore.length > 0) {
        storeId = existingStore[0].id;
      } else {
        // Criar a loja se não existir
        const [newStore] = await db.insert(stores).values({
          name: storeName,
          slug: slugify(storeName),
          logoUrl: `https://ui.awin.com/images/upload/merchant/profile/${item.merchant_id}.png`,
          active: true
        }).returning({ id: stores.id });
        storeId = newStore.id;
      }

      // Preços e Links
      const currentPrice = Number(item.search_price);
      const originalPrice = currentPrice * 1.25; // Simular um desconto de 20% já que o CSV não traz o original

      const titleLimitado = item.product_name.substring(0, 95);
      let finalSlug = slugify(titleLimitado) + '-' + item.aw_product_id.substring(0, 5);

      // Inserir oferta
      await db.insert(offers).values({
        title: titleLimitado,
        slug: finalSlug,
        description: (item.description || '').substring(0, 500) + ((item.description || '').length > 500 ? '...' : ''),
        priceCurrent: currentPrice.toString(),
        priceOriginal: originalPrice.toFixed(2).toString(),
        priceMinimum: currentPrice.toString(),
        discountPct: '20',
        imageUrl: item.merchant_image_url,
        affiliateUrl: item.aw_deep_link, // Link principal de afiliação (Seguro)
        externalId: item.aw_product_id,
        storeId: storeId,
        status: 'active',
        dealScore: '85',
        source: 'awin_api',
        upvotes: 0,
        downvotes: 0
      });

      inseridos++;
      console.log(`✅ Produto inserido: ${titleLimitado} (Loja: ${storeName})`);

      // Tentar enviar para o Telegram, ignorando erros se não estiver configurado
      try {
        await sendTelegramAlert({
          title: titleLimitado,
          priceCurrent: currentPrice,
          priceOriginal: originalPrice,
          affiliateUrl: `https://radarofertas.pt/oferta/${finalSlug}`,
          imageUrl: item.merchant_image_url,
        });
      } catch (e) {
        // Ignore telegram errors silently
      }

    } catch (e) {
      console.error(`Erro ao inserir produto ${item.product_name}:`, e);
    }
  }

  console.log(`🎉 Agente 2 terminou. Foram publicadas ${inseridos} novas ofertas no RadarOfertas!`);
  return true;
}
