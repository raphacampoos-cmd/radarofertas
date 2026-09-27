/**
 * Regras de conformidade com o Programa de Associados da Amazon (Amazon Associates Operating Agreement).
 * 
 * Até à integração completa e ativação da Amazon Creators API (PA-API v5):
 * Não exibir preços estáticos, preços anteriores riscados, percentagens de desconto,
 * mínimos históricos ou Deal Score para ofertas da Amazon que não tenham sido
 * obtidas através de uma API oficial da Amazon nas últimas horas.
 */

export function isAmazonOffer(offer: {
  affiliateUrl?: string | null
  store?: { slug?: string | null; name?: string | null } | null
  storeName?: string | null
}): boolean {
  if (!offer) return false
  const url = (offer.affiliateUrl || '').toLowerCase()
  const slug = (offer.store?.slug || '').toLowerCase()
  const name = (offer.store?.name || offer.storeName || '').toLowerCase()

  return (
    slug === 'amazon' ||
    slug === 'amazon-es' ||
    url.includes('amazon.es') ||
    url.includes('amazon.com') ||
    url.includes('amzn.to') ||
    name.includes('amazon')
  )
}
