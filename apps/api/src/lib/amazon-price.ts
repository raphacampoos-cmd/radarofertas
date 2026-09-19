import { JSDOM, VirtualConsole } from 'jsdom'

// Seletores do preço "a pagar" no buybox, por ordem de fiabilidade. Evitam apanhar
// preços de outros elementos da página (riscados, por unidade, carrosséis, etc.).
const BUYBOX_PRICE_SELECTORS = [
  '#corePrice_feature_div .a-price:not(.a-text-price) .a-offscreen',
  '.apex-pricetopay-value .a-offscreen',
  '#apex_desktop .priceToPay .a-offscreen',
  '#corePriceDisplay_desktop_feature_div .priceToPay .a-offscreen',
]

// "14,64€" -> 14.64 ; "1.234,56 €" -> 1234.56
export function parseEuroPrice(raw: string | null | undefined): number | null {
  if (!raw) return null
  const cleaned = raw.replace(/[^\d.,]/g, '')
  if (!cleaned) return null
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned
  const value = parseFloat(normalized)
  return Number.isFinite(value) && value > 0 ? value : null
}

const silentConsole = new VirtualConsole()

// Preço "de tabela" riscado no buybox (o desconto real que a Amazon mostra).
const LIST_PRICE_SELECTORS = [
  '#corePrice_feature_div .basisPrice .a-offscreen',
  '#corePrice_feature_div .a-price.a-text-price .a-offscreen',
  '#apex_desktop .basisPrice .a-offscreen',
  '#corePriceDisplay_desktop_feature_div .basisPrice .a-offscreen',
]

export interface AmazonPriceInfo {
  price: number | null
  /** Preço de tabela real (riscado) — só se for maior que o preço atual e plausível. */
  listPrice: number | null
}

export function extractAmazonPriceInfo(html: string): AmazonPriceInfo {
  const doc = new JSDOM(html, { virtualConsole: silentConsole }).window.document
  const price = pickBuyboxPrice(doc, html)

  let listPrice: number | null = null
  for (const selector of LIST_PRICE_SELECTORS) {
    const candidate = parseEuroPrice(doc.querySelector(selector)?.textContent)
    if (candidate) { listPrice = candidate; break }
  }
  if (price && listPrice && !(listPrice > price && listPrice <= price * 3)) listPrice = null

  return { price, listPrice }
}

export function extractAmazonPrice(html: string): number | null {
  return extractAmazonPriceInfo(html).price
}

function pickBuyboxPrice(doc: Document, html: string): number | null {
  for (const selector of BUYBOX_PRICE_SELECTORS) {
    const price = parseEuroPrice(doc.querySelector(selector)?.textContent)
    if (price) return price
  }

  // Fallback: primeiro bloco inteiro+fração (a parte inteira pode ter um span aninhado)
  const whole = html.match(/<span class="a-price-whole">([0-9]+)/)?.[1]
  const fraction = html.match(/<span class="a-price-fraction">([0-9]+)/)?.[1] ?? '00'
  return whole ? parseFloat(`${whole}.${fraction}`) : null
}
