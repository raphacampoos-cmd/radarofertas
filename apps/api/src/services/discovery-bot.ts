import { db } from '@radarofertas/db/client'
import { offers, categories, offerCategories } from '@radarofertas/db/schema'
import { eq, sql, like } from 'drizzle-orm'
import { JSDOM } from 'jsdom'

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const AFFILIATE_ID = "radaroferta0c-21"; // O teu código de afiliado

// URLs das categorias que queremos descobrir
const DISCOVERY_URLS = [
  { url: 'https://www.amazon.es/gp/bestsellers/electronics/?language=pt_PT', categorySlug: 'smartphones-e-tech' },
  { url: 'https://www.amazon.es/gp/bestsellers/videogames/?language=pt_PT', categorySlug: 'gaming' },
  { url: 'https://www.amazon.es/gp/bestsellers/kitchen/?language=pt_PT', categorySlug: 'casa-e-cozinha' }
];

async function extractPrice(html: string): Promise<number | null> {
  const priceWholeMatch = html.match(/<span class="a-price-whole">([0-9.,]+)<\/span>/);
  const priceFractionMatch = html.match(/<span class="a-price-fraction">([0-9]+)<\/span>/);
  if (priceWholeMatch) {
    let whole = priceWholeMatch[1].replace(/[^0-9]/g, '');
    let fraction = priceFractionMatch ? priceFractionMatch[1] : '00';
    return parseFloat(`${whole}.${fraction}`);
  }
  return null;
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000);
}

export async function runDiscoveryBot() {
  console.log('🕵️‍♂️ Bot Descobridor: A iniciar patrulha na Amazon...');
  let newItemsCount = 0;

  for (const target of DISCOVERY_URLS) {
    try {
      console.log(`A ler a secção de ${target.categorySlug}...`);
      const res = await fetch(target.url, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'pt-PT,pt;q=0.9' }
      });
      if (!res.ok) continue;

      const html = await res.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      const items = Array.from(document.querySelectorAll('.zg-grid-general-faceout, .p13n-sc-uncoverable-faceout')).slice(0, 10) as Element[];
      
      for (const item of items) {
        const linkEl = item.querySelector('a.a-link-normal') as HTMLAnchorElement | null;
        const imgEl = item.querySelector('img') as HTMLImageElement | null;
        if (!linkEl || !linkEl.href.includes('/dp/')) continue;

        // Limpar o link e extrair ASIN
        const rawUrl = 'https://www.amazon.es' + linkEl.href.split('?')[0];
        const asinMatch = rawUrl.match(/\/dp\/([A-Z0-9]{10})/);
        if (!asinMatch) continue;
        const asin = asinMatch[1];
        
        // Criar o link de afiliado perfeito
        const affiliateUrl = `https://www.amazon.es/dp/${asin}?tag=${AFFILIATE_ID}&language=pt_PT`;
        
        // Verificar se já temos isto na BD (procurando pelo ASIN no link de afiliado)
        const existing = await db.select({ id: offers.id }).from(offers).where(like(offers.affiliateUrl, `%${asin}%`));
        if (existing.length > 0) {
          continue; // Já conhecemos este produto
        }

        // Tentar extrair o Título (normalmente o texto mais longo no div do produto)
        const textElements = Array.from(item.querySelectorAll('div, span')).map(e => (e as Element).textContent?.trim() || '');
        const title = textElements.reduce((longest, current) => current.length > longest.length ? current : longest, '');
        if (title.length < 15) continue; // Muito curto para ser o título

        // Extrair Preço e Imagem
        const imageUrl = imgEl ? imgEl.src.replace(/_AC_.*_\./, '_AC_SL1500_.') : ''; // Tentar imagem em alta resolução
        
        // Fazer fetch direto à página do produto para apanhar o preço original vs desconto
        const prodRes = await fetch(affiliateUrl, { headers: { 'User-Agent': UA, 'Accept-Language': 'pt-PT,pt;q=0.9' }});
        let currentPrice = 0;
        let originalPrice = 0;

        if (prodRes.ok) {
           const prodHtml = await prodRes.text();
           const cp = await extractPrice(prodHtml);
           if (cp) currentPrice = cp;
           // Tentar prever preço original (se não tiver, pomos +20% para a IA do DealScore calcular)
           originalPrice = currentPrice * 1.2; 
        }

        if (currentPrice <= 0) continue;

        // 1. Encontrar ID da Categoria no nosso sistema
        const cat = await db.select().from(categories).where(eq(categories.slug, target.categorySlug)).limit(1);
        if (cat.length === 0) continue;

        console.log(`🌟 Novo Bestseller Encontrado! ${title.slice(0,40)}... (${currentPrice}€)`);

        // 2. Inserir na tabela offers (como Active para o Rastreador começar a seguir)
        const inserted = await db.insert(offers).values({
          title: title.slice(0, 255),
          slug: generateSlug(title.slice(0, 50)),
          description: 'Produto em destaque nos mais vendidos da Amazon. Monitorizado automaticamente pelo RadarOfertas.',
          priceCurrent: currentPrice.toFixed(2),
          priceOriginal: originalPrice.toFixed(2),
          priceMinimum: currentPrice.toFixed(2),
          affiliateUrl: affiliateUrl,
          imageUrl: imageUrl,
          storeId: 1, // Assumindo que 1 é a Amazon
          source: 'crawler',
          status: 'active',
          updatedAt: new Date(),
          publishedAt: new Date()
        }).returning({ id: offers.id });

        if (inserted.length > 0) {
          // 3. Associar à Categoria
          await db.insert(offerCategories).values({
            offerId: inserted[0].id,
            categoryId: cat[0].id
          });
          newItemsCount++;
        }

        // Pausa de 3 segundos para não irritar a Amazon
        await new Promise(r => setTimeout(r, 3000));
      }
    } catch (e) {
      console.error(`Erro ao explorar a categoria ${target.categorySlug}:`, e);
    }
  }

  console.log(`🕵️‍♂️ Patrulha concluída! Adicionados ${newItemsCount} novos produtos virais à base de dados.`);
}
