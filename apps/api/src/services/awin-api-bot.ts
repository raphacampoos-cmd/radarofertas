import https from 'https';
import zlib from 'zlib';
import csv from 'csv-parser';
import { db } from '@radarofertas/db/client';
import { offers, stores } from '@radarofertas/db/schema';
import { eq } from 'drizzle-orm';
import { sendTelegramAlert } from '../lib/telegram.js';

// O URL fornecido pelo utilizador (Product Datafeed - CSV GZIPPED)
const FEED_URL = 'https://productdata.awin.com/datafeed/download/apikey/fafdb9c3a02c084cbb3424202a43596c/language/en/cid/97,98,142,144,146,129,595,539,147,149,613,626,135,163,168,159,161,167,170,137,171,548,174,183,178,179,175,172,623,139,614,189,194,141,205,198,206,203,208,199,204,201,61,62,72,73,71,74,75,77,78,63,80,64,83,84,85,65,86,88,90,91,67,94,33,53,52,603,66,128,130,133,212,209,210,211,68,69,213,220,221,70,224,225,226,227,228,4,5,10,11,537,19,15,14,6,20,22,23,24,25,7,30,32,619,8,35,618,43,9,50,634,230,538,233,235,238,550,240,237,241,556,245,521,576,575,579,281,283,285,286,282,290,287,288,627,173,193,642,177,196,379,648,181,645,384,387,646,598,611,391,393,647,395,631,602,570,600,405,187,411,412,413,414,415,416,649,418,419,420,99,100,101,107,110,111,113,114,115,116,118,121,122,127,581,624,123,594,125,421,605,604,599,422,433,434,436,532,428,474,475,476,477,423,608,437,438,441,444,424,451,448,453,449,452,450,425,455,457,459,460,456,458,426,616,463,464,465,466,427,625,597,473,469,617,470,429,430,481,615,483,484,485,488,529,596,431,432,490,361,633,362,366,367,368,371,369,363,372,373,374,377,375,364,365,385,390,392,394,399,402,404,406,407,540,542,544,546,547,246,247,252,559,255,248,256,259,632,260,261,262,557,249,266,267,268,269,612,251,277,250,272,271,561,560,347,348,354,350,351,349,357,358,360,586,588,328,629,329,333,336,338,493,635,495,507,563,564,565,566,567,569,568/fid/101189,103938,104051,104495,107946,108813,109551,109975,114261,115564/rid/0/hasEnhancedFeeds/0/columns/aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,display_price,data_feed_id/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/';

// Os ID dos anunciantes que nos interessam
const TARGET_MERCHANTS = ['75408', '88453', '96499'];

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

  return new Promise((resolve, reject) => {
    https.get(FEED_URL, (response) => {
      if (response.statusCode !== 200) {
        console.error('⚠️ Awin Feed falhou com status:', response.statusCode);
        return reject(new Error('Feed Request Failed'));
      }

      const products: any[] = [];

      response
        .pipe(zlib.createGunzip())
        .pipe(csv())
        .on('data', (row) => {
          // Filtrar apenas pelos comerciantes aprovados
          if (TARGET_MERCHANTS.includes(row.merchant_id)) {
            // Fazer um pequeno filtro extra: garantir que tem imagem e preço
            if (row.merchant_image_url && row.search_price && Number(row.search_price) > 0) {
              products.push(row);
            }
          }
        })
        .on('end', async () => {
          console.log(`✅ Ficheiro lido com sucesso. Encontrados ${products.length} produtos válidos das 3 lojas alvo.`);
          
          if (products.length === 0) {
            console.log('Nenhum produto novo encontrado.');
            return resolve(true);
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
                  isActive: true
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
                description: item.description.substring(0, 500) + '...',
                currentPrice: currentPrice.toString(),
                originalPrice: originalPrice.toFixed(2).toString(),
                discountPercentage: 20,
                imageUrl: item.merchant_image_url,
                affiliateUrl: item.aw_deep_link, // Link principal de afiliação (Seguro)
                sourceId: item.aw_product_id,
                storeId: storeId,
                status: 'published',
                dealScore: 85,
                sourceType: 'awin_api',
                upvotes: 0,
                downvotes: 0
              });

              inseridos++;
              console.log(`✅ Produto inserido: ${titleLimitado} (Loja: ${storeName})`);

              // Tentar enviar para o Telegram, ignorando erros se não estiver configurado
              try {
                const tgMessage = `🚨 *Nova Oferta Oficial* 🚨\n\n🛍 *${titleLimitado}*\n\n🔥 *Preço:* ${item.currency} ${currentPrice}\n🏪 *Loja:* ${storeName}\n\n👉 [Ver Oferta Aqui](https://radarofertas.pt/oferta/${finalSlug})`;
                await sendTelegramAlert(tgMessage);
              } catch (e) {
                // Ignore telegram errors silently
              }

            } catch (e) {
              console.error(`Erro ao inserir produto ${item.product_name}:`, e);
            }
          }

          console.log(`🎉 Agente 2 terminou. Foram publicadas ${inseridos} novas ofertas no RadarOfertas!`);
          resolve(true);
        })
        .on('error', (err) => {
          console.error('Erro na leitura do CSV:', err);
          reject(err);
        });
    }).on('error', (err) => {
      console.error('Erro de Rede:', err);
      reject(err);
    });
  });
}
