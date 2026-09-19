import https from 'https';
import zlib from 'zlib';
import csv from 'csv-parser';

// O URL fornecido pelo utilizador (Product Datafeed - CSV GZIPPED)
export const AWIN_FEED_URL = 'https://productdata.awin.com/datafeed/download/apikey/fafdb9c3a02c084cbb3424202a43596c/language/en/fid/101189,103938,104051,104495,107946,108023,108813,109551,109975,114261,115564,116791/rid/0/hasEnhancedFeeds/0/columns/aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,display_price,data_feed_id/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/';

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
  [key: string]: string;
}

// Baixa e faz parse do feed CSV (GZIP) completo da Awin. Usado tanto pelo
// agente de descoberta (awin-api-bot) como pelo rastreador de preços (bot).
export function fetchAwinFeed(): Promise<AwinFeedRow[]> {
  return new Promise((resolve, reject) => {
    https.get(AWIN_FEED_URL, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Awin Feed Request Failed: status ${response.statusCode}`));
      }

      const rows: AwinFeedRow[] = [];

      response
        .pipe(zlib.createGunzip())
        .pipe(csv())
        .on('data', (row: AwinFeedRow) => rows.push(row))
        .on('end', () => resolve(rows))
        .on('error', reject);
    }).on('error', reject);
  });
}
