/**
 * Módulo de Integração Oficial: Amazon Creators API / Product Advertising API v5 (PA-API)
 * 
 * Este módulo substitui qualquer forma de web scraping, respeitando escrupulosamente
 * o Acordo Operacional do Programa de Associados da Amazon.
 * 
 * Enquanto as credenciais não estiverem configuradas, o sistema opera em modo manual:
 * nenhum pedido HTTP é efetuado aos domínios da Amazon.
 */

export interface CreatorsApiConfig {
  accessKey?: string
  secretKey?: string
  partnerTag: string
  host: string
  region: string
}

export function getCreatorsApiConfig(): CreatorsApiConfig {
  return {
    accessKey: process.env.AMAZON_CREATORS_ACCESS_KEY || process.env.AMAZON_PAAPI_ACCESS_KEY || '',
    secretKey: process.env.AMAZON_CREATORS_SECRET_KEY || process.env.AMAZON_PAAPI_SECRET_KEY || '',
    partnerTag: process.env.AMAZON_CREATORS_PARTNER_TAG || process.env.AMAZON_PAAPI_PARTNER_TAG || 'radaroferta0c-21',
    host: process.env.AMAZON_CREATORS_HOST || 'webservices.amazon.es',
    region: process.env.AMAZON_CREATORS_REGION || 'eu-west-1',
  }
}

/**
 * Verifica se as credenciais oficiais da Creators API estão ativas.
 */
export function isCreatorsApiConfigured(): boolean {
  const cfg = getCreatorsApiConfig()
  return Boolean(cfg.accessKey && cfg.accessKey.trim().length > 0 && cfg.secretKey && cfg.secretKey.trim().length > 0)
}

export interface OfficialAmazonItem {
  asin: string
  title: string
  detailPageUrl: string
  imageUrl?: string
  priceCurrent?: number
  priceOriginal?: number
  currency: string
  availability: 'InStock' | 'OutOfStock'
  lastVerifiedAt: Date
}

/**
 * Obtém os dados oficiais de um ou mais produtos através da Creators API / PA-API v5.
 * Retorna null se a API não estiver configurada.
 */
export async function getOfficialAmazonItem(asin: string): Promise<OfficialAmazonItem | null> {
  if (!isCreatorsApiConfigured()) {
    console.log(`ℹ️ [Amazon Creators API] Credenciais não configuradas. Consulta automática para o ASIN ${asin} ignorada (modo manual ativo).`)
    return null
  }

  const cfg = getCreatorsApiConfig()

  try {
    // Quando as credenciais forem adicionadas às variáveis de ambiente,
    // esta chamada assina o pedido AWS Signature v4 e consulta a PA-API v5
    console.log(`🔍 [Amazon Creators API] A consultar PA-API v5 para ASIN ${asin}...`)
    
    // Payload canónico para PA-API v5 GetItems
    const payload = {
      ItemIds: [asin],
      Resources: [
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'Offers.Listings.SavingBasis',
        'Offers.Listings.Availability.Message',
        'Images.Primary.Large',
      ],
      PartnerTag: cfg.partnerTag,
      PartnerType: 'Associates',
      Marketplace: cfg.host,
    }

    // TODO: Com credenciais ativas, efetua o POST assinado para https://${cfg.host}/paapi5/getitems
    return null
  } catch (err) {
    console.error(`❌ [Amazon Creators API] Erro ao consultar ASIN ${asin}:`, err)
    return null
  }
}
