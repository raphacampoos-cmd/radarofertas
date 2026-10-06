import { db } from '@radarofertas/db/client';
import { offers, stores, categories, offerCategories } from '@radarofertas/db/schema';
import { eq } from 'drizzle-orm';
import { calculateDealScore } from '@radarofertas/deal-engine';
import { sendTelegramAlert } from '../lib/telegram.js';
import { fetchAwinFeed } from '../lib/awin-feed.js';
import { EXTRA_CATEGORIES, MERCHANT_DISPLAY_NAME, planAwinRun, slugify } from '../lib/awin-mapping.js';
import { processOfferTranslation } from '../lib/translate.js';
import { generateSeoArticle } from '../lib/ai-article.js';

// Os ID dos 16 anunciantes aprovados
const TARGET_MERCHANTS = [
  '24562',  // Padel Market
  '36144',  // OutIn
  '59557',  // LaserPecker
  '68106',  // HTVRont
  '69428',  // Ultrahuman Healthcare
  '75408',  // Nothingprojector
  '77026',  // adidas PT
  '77156',  // Gshopper
  '82371',  // The Aeternum Company
  '88453',  // Wondershare Global Limited
  '90211',  // FastestVPN (Fast Technology Limited)
  '96499',  // Ottocast
  '102509', // KuKirin-scooter
  '105805', // EINSTAR
  '128639', // ESR (EU)
  '129139', // THC Natural Line DE
];

// Só anunciamos no Telegram quando o desconto é real (vindo do feed), nunca inventado.
const MIN_DISCOUNT_TO_ANNOUNCE = 10;
// Anunciantes cujo "preço antigo" no feed não é fiável o suficiente para um alerta público:
// os produtos entram no site, mas não vão para o Telegram. 128639 = ESR (EU), que tem ~-50% em quase tudo.
const NO_ANNOUNCE_MERCHANTS = new Set(['128639']);

async function ensureCategoryId(slug: string): Promise<number | null> {
  const [existing] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
  if (existing) return existing.id;

  const def = EXTRA_CATEGORIES[slug];
  if (!def) return null;

  await db.insert(categories).values({ name: def.name, slug, icon: def.icon, active: true, sortOrder: 20 }).onConflictDoNothing({ target: categories.slug });
  const [created] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
  return created?.id ?? null;
}

export async function runAwinApiBot() {
  console.log('🌐 Agente Awin Oficial: A iniciar ingestão do Product Feed (GZIP CSV)...');

  // O filtro corre durante o download: o feed tem ~90 mil linhas e só queremos as dos anunciantes alvo
  const dbStores = await db.select({ logoUrl: stores.logoUrl }).from(stores).where(eq(stores.affiliateNetwork, 'awin'));
  const validMerchantIds = new Set(dbStores.map(s => s.logoUrl?.match(/profile\/(\d+)\.png/)?.[1]).filter(Boolean));
  // Adicionar TODAS as 31 lojas do feed oficial manualmente para garantir que apanhamos Worten, Fnac, etc
  const hardcoded = ['97523','98176','100347','101189','103938','104051','104488','104495','105185','107741','107946','108023','108292','108336','108813','109219','109220','109221','109222','109225','109228','109551','109975','114261','114793','115564','115853','116383','116399','116791','117590'];
  hardcoded.forEach(id => validMerchantIds.add(id));

  const merchantCounts: Record<string, number> = {};
  const candidates = await fetchAwinFeed((row) => {
    if (!row.merchant_image_url || Number(row.search_price) <= 0) return false;
    if (!validMerchantIds.has(row.merchant_id)) return false;
    
    // Guardar no máximo 40 produtos por loja em memória para evitar crash (Out of Memory)
    merchantCounts[row.merchant_id] = (merchantCounts[row.merchant_id] || 0) + 1;
    if (merchantCounts[row.merchant_id] > 40) return false;
    
    return true;
  });

  const existing = await db
    .select({ externalId: offers.externalId, title: offers.title, storeName: stores.name })
    .from(offers)
    .innerJoin(stores, eq(offers.storeId, stores.id))
    .where(eq(offers.source, 'awin_api'));
  const selected = await planAwinRun(candidates, existing, 400);

  console.log(`✅ Feed lido. ${candidates.length} produtos válidos de todos os anunciantes; ${selected.length} novos selecionados.`);

  if (selected.length === 0) {
    console.log('Nenhum produto novo encontrado.');
    return true;
  }

  let inseridos = 0;

  for (const item of selected) {
    const { row } = item;
    try {
      const storeName = MERCHANT_DISPLAY_NAME[row.merchant_id] ?? row.merchant_name;

      const storeSlug = slugify(storeName);
      const existingStore = await db.select().from(stores).where(eq(stores.slug, storeSlug)).limit(1);
      let storeId: number;
      if (existingStore.length > 0) {
        storeId = existingStore[0].id;
      } else {
        const [newStore] = await db.insert(stores).values({
          name: storeName,
          slug: storeSlug,
          logoUrl: `https://ui.awin.com/images/upload/merchant/profile/${row.merchant_id}.png`,
          affiliateNetwork: 'awin',
          active: true,
        }).returning({ id: stores.id });
        storeId = newStore.id;
      }

      const score = calculateDealScore({
        priceCurrent: item.priceEur,
        priceOriginal: item.originalEur,
        priceMinHistoric: null,
        priceAvg90Days: null,
      }).score;

      // Se for Ultrahuman (69428), usar o link de afiliado direto da Impact.com com 7% de comissão
      const affiliateUrl = row.merchant_id === '69428'
        ? 'https://ultrahumanhealthcare.pxf.io/c/7823444/3114542/38784'
        : row.aw_deep_link;

      // Sanitizar URL da imagem para evitar links do Google Drive, Imgur album ou quebrados
      let finalImageUrl = row.merchant_image_url;
      if (!finalImageUrl || finalImageUrl.includes('drive.google.com') || finalImageUrl.includes('imgur.com/a/') || !finalImageUrl.startsWith('http')) {
        finalImageUrl = `https://ui.awin.com/images/upload/merchant/profile/${row.merchant_id}.png`;
      }

      // Traduzir para PT-PT e encurtar o título se necessário
      const translation = await processOfferTranslation(item.title, item.description);

      const [inserted] = await db.insert(offers).values({
        title: item.title,
        titlePt: translation.titlePt,
        slug: item.slug,
        description: item.description,
        descriptionPt: translation.descriptionPt,
        priceCurrent: item.priceEur.toFixed(2),
        priceOriginal: item.originalEur.toFixed(2),
        priceMinimum: item.priceEur.toFixed(2),
        discountPct: item.discountPct.toFixed(2),
        currency: 'EUR',
        imageUrl: finalImageUrl,
        affiliateUrl,
        externalId: row.aw_product_id,
        storeId,
        status: 'active',
        dealScore: score.toFixed(2),
        source: row.merchant_id === '69428' ? 'impact' : 'awin_api',
        upvotes: 0,
        downvotes: 0,
      }).returning({ id: offers.id });

      const categoryId = await ensureCategoryId(item.categorySlug);
      if (categoryId) {
        await db.insert(offerCategories).values({ offerId: inserted.id, categoryId }).onConflictDoNothing();
      }

      // 🤖 ACIONAR A FÁBRICA DE ARTIGOS SEO!
      generateSeoArticle({
        ...inserted,
        store: { name: storeName }
      }).catch(err => console.error('[Bot SEO] Erro:', err));

      inseridos++;
      console.log(`✅ Produto inserido: ${translation.titlePt || item.title} (${storeName}, ${item.categorySlug}, ${item.priceEur}€${item.discountPct > 0 ? `, -${Math.round(item.discountPct)}%` : ''})`);

      if (item.discountPct >= MIN_DISCOUNT_TO_ANNOUNCE && !NO_ANNOUNCE_MERCHANTS.has(row.merchant_id)) {
        try {
          await sendTelegramAlert({
            title: translation.titlePt || item.title,
            priceCurrent: item.priceEur,
            priceOriginal: item.originalEur,
            affiliateUrl: `https://radarofertas.pt/oferta/${item.slug}`,
            imageUrl: row.merchant_image_url,
          });
        } catch {
          // alerta é opcional
        }
      }
    } catch (e) {
      console.error(`Erro ao inserir produto ${row.product_name}:`, e);
    }
  }

  console.log(`🎉 Agente Awin terminou. Foram publicadas ${inseridos} novas ofertas no RadarOfertas!`);
  return true;
}
