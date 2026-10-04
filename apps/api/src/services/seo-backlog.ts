import { db } from "@radarofertas/db"
import { offers, articles, stores } from "@radarofertas/db/schema"
import { generateSeoArticle } from "../lib/ai-article.js"
import { desc } from "drizzle-orm"

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function processSeoBacklog() {
  console.log("A iniciar motor de artigos SEO de Background...");
  
  const existingArticles = await db.select({ title: articles.title }).from(articles);
  const existingTitles = new Set(existingArticles.map(a => a.title).filter(Boolean));
  
  const pendingOffers = await db.select({
    id: offers.id, title: offers.title, titlePt: offers.titlePt,
    priceCurrent: offers.priceCurrent, priceOriginal: offers.priceOriginal,
    imageUrl: offers.imageUrl, storeId: offers.storeId
  }).from(offers).orderBy(desc(offers.id)).limit(20);
  
  const allStores = await db.select().from(stores);
  const storeMap: any = {};
  allStores.forEach(s => storeMap[s.id] = s);

  const filtered = pendingOffers.filter(o => !existingTitles.has(o.titlePt || o.title) && !existingTitles.has(o.title));

  console.log(`Encontradas ${filtered.length} ofertas sem artigo. A processar...`);
  
  for (const offer of filtered) {
    const targetTitle = offer.titlePt || offer.title;
    console.log(`A escrever artigo para: ${targetTitle}`);
    try {
      await generateSeoArticle({
        id: offer.id, title: targetTitle,
        priceCurrent: offer.priceCurrent, priceOriginal: offer.priceOriginal,
        imageUrl: offer.imageUrl, store: storeMap[offer.storeId!]
      });
    } catch (e: any) {
      console.error(`? Erro no artigo:`, e.message);
    }
    await delay(12000);
  }
}
