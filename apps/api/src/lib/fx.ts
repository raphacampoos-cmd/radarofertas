// Conversão para EUR. O feed da Awin traz preços na moeda de cada loja (GBP, USD, ...),
// mas o site mostra tudo em euros.
const FALLBACK_RATES: Record<string, number> = { EUR: 1, GBP: 1.16, USD: 0.87 }
const CACHE_TTL_MS = 12 * 60 * 60 * 1000
const cache = new Map<string, { rate: number; at: number }>()

export async function getEurRate(currency: string): Promise<number | null> {
  const cur = (currency || 'EUR').toUpperCase()
  if (cur === 'EUR') return 1

  const cached = cache.get(cur)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.rate

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=${cur}&to=EUR`, { signal: AbortSignal.timeout(8000) })
    if (res.ok) {
      const data = await res.json() as { rates?: { EUR?: number } }
      const rate = data.rates?.EUR
      if (rate && rate > 0) {
        cache.set(cur, { rate, at: Date.now() })
        return rate
      }
    }
  } catch {
    // cai para a taxa aproximada abaixo
  }

  return cached?.rate ?? FALLBACK_RATES[cur] ?? null
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}
