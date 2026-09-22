import https from 'https';
import zlib from 'zlib';
import csv from 'csv-parser';

// O URL fornecido pelo utilizador (Product Datafeed - CSV GZIPPED com todos os anunciantes incluindo FastestVPN)
export const AWIN_FEED_URL = 'https://productdata.awin.com/datafeed/download/apikey/fafdb9c3a02c084cbb3424202a43596c/language/en/fid/97523,98176,100347,101189,103938,104051,104488,104495,105185,107741,107946,108023,108292,108336,108813,109219,109220,109221,109222,109225,109228,109551,109975,114261,114793,115564,115853,116383,116399,116791,117590/rid/0/hasEnhancedFeeds/0/columns/aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,display_price,data_feed_id/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/';

export interface AwinFeedRow {
  aw_deep_link: string;
  product_name: string;
  aw_product_id: string;
  merchant_product_id: string;
  merchant_image_url: string;
  description: string;
  merchant_category: string;
  search_price: string;
  merchant_name: string;
  merchant_id: string;
  category_name: string;
  category_id: string;
  aw_image_url: string;
  currency: string;
  store_price: string;
  delivery_cost: string;
  merchant_deep_link: string;
  language: string;
  last_updated: string;
  display_price: string;
  data_feed_id: string;
  // product_price_old (preço anterior real, só quando há desconto verdadeiro) chega pelo index signature
  [key: string]: string;
}

// O feed do utilizador não traz o preço anterior; pedimos a coluna product_price_old à Awin
// para conseguir mostrar apenas descontos reais.
function feedUrlWithOldPrice(): string {
  return AWIN_FEED_URL.includes('product_price_old')
    ? AWIN_FEED_URL
    : AWIN_FEED_URL.replace('/columns/', '/columns/product_price_old,');
}

// Baixa e faz parse do feed CSV (GZIP). O feed tem ~90 mil linhas, por isso aceita um filtro
// que descarta as linhas irrelevantes durante o streaming, em vez de as guardar todas em memória.
export function fetchAwinFeed(filter?: (row: AwinFeedRow) => boolean): Promise<AwinFeedRow[]> {
  return new Promise((resolve, reject) => {
    https.get(feedUrlWithOldPrice(), (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        return reject(new Error(`Awin Feed Request Failed: status ${response.statusCode}`));
      }

      const rows: AwinFeedRow[] = [];

      response
        .pipe(zlib.createGunzip())
        .pipe(csv())
        .on('data', (row: AwinFeedRow) => { if (!filter || filter(row)) rows.push(row) })
        .on('end', () => resolve(rows))
        .on('error', reject);
    }).on('error', reject);
  });
}
