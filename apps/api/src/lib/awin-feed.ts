import https from 'https';
import zlib from 'zlib';
import csv from 'csv-parser';

// O URL fornecido pelo utilizador (Product Datafeed - CSV GZIPPED com todos os anunciantes e categorias selecionadas)
export const AWIN_FEED_URL = 'https://productdata.awin.com/datafeed/download/apikey/fafdb9c3a02c084cbb3424202a43596c/language/en/cid/97,98,142,144,146,129,595,539,147,149,613,626,135,163,168,159,169,161,167,170,137,171,548,174,183,178,179,175,172,623,139,614,189,194,141,205,198,206,203,208,199,204,201,61,62,72,73,71,74,75,76,77,78,63,80,82,64,83,84,85,65,86,88,90,89,91,67,94,33,53,52,603,66,128,130,133,212,207,209,210,211,68,69,213,220,221,222,70,224,225,226,227,228,229,4,5,10,11,537,13,19,15,14,6,20,22,24,25,26,7,30,29,32,619,34,8,35,618,40,9,651,49,50,634,230,538,233,235,238,550,240,237,241,245,521,576,575,579,281,283,285,286,282,290,287,288,627,173,193,642,650,177,196,379,648,181,645,384,387,646,598,611,391,393,647,395,631,602,570,600,405,187,411,412,413,414,415,416,417,649,418,419,420,99,100,101,107,110,111,113,114,115,116,118,121,122,127,581,624,123,594,125,421,605,604,599,422,433,530,434,436,532,428,474,475,476,477,423,608,437,441,444,424,451,448,453,449,452,450,425,455,457,459,460,456,458,426,616,463,464,465,466,427,625,597,473,469,617,470,429,430,481,615,483,484,485,487,488,529,596,431,432,606,490,361,633,362,366,367,368,363,373,377,375,535,364,365,383,390,392,394,396,402,404,406,540,542,544,546,547,246,247,252,559,255,248,256,265,593,258,259,632,260,261,262,557,249,266,267,268,269,612,251,277,250,272,271,561,560,347,348,354,350,351,349,357,358,359,360,586,588,589,328,629,329,330,333,338,493,635,495,507,563,564,565,566,567,569,568/fid/92117,101189,103938,104051,107240,107741,108023,108336,114744,114793,116791,118399,118562/rid/0/hasEnhancedFeeds/0/columns/aw_deep_link,product_name,aw_product_id,merchant_product_id,merchant_image_url,description,merchant_category,search_price,merchant_name,merchant_id,category_name,category_id,aw_image_url,currency,store_price,delivery_cost,merchant_deep_link,language,last_updated,display_price,data_feed_id/format/csv/delimiter/%2C/compression/gzip/adultcontent/1/';

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
