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

export function extractAmazonPrice(html: string): number | null {
  const doc = new JSDOM(html, { virtualConsole: silentConsole }).window.document

  for (const selector of BUYBOX_PRICE_SELECTORS) {
    const price = parseEuroPrice(doc.querySelector(selector)?.textContent)
    if (price) return price
  }

  // Fallback: primeiro bloco inteiro+fração (a parte inteira pode ter um span aninhado)
  const whole = html.match(/<span class="a-price-whole">([0-9]+)/)?.[1]
  const fraction = html.match(/<span class="a-price-fraction">([0-9]+)/)?.[1] ?? '00'
  return whole ? parseFloat(`${whole}.${fraction}`) : null
}
