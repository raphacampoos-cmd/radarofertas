import type { AwinFeedRow } from './awin-feed.js'
import { getEurRate, roundMoney } from './fx.js'

// ── Categorias ─────────────────────────────────────────────────────────────
// O site não tinha categoria para moda (a loja Needs No Label vende só isso).
export const EXTRA_CATEGORIES: Record<string, { name: string; icon: string }> = {
  moda: { name: 'Moda & Acessórios', icon: '👗' },
  'thc-natural-line': { name: 'THC Natural Line', icon: '🧶' },
}

// Anunciantes com categoria própria: têm prioridade sobre as regras por texto do feed.
const MERCHANT_OWN_CATEGORY: Record<string, string> = {
  '129139': 'thc-natural-line', // THC Natural Line DE (lã de ovelha: gorros, luvas, casacos)
}

// Categoria por defeito de cada anunciante quando o feed não traz categoria própria.
const MERCHANT_DEFAULT_CATEGORY: Record<string, string> = {
  '78586': 'moda', // Needs No Label
  '114180': 'beleza-e-saude', // Sinocare
  '117317': 'beleza-e-saude', // NeuroScent
  '124878': 'beleza-e-saude', // WAU
  '75408': 'tecnologia-e-informatica', // Nothingprojector
  '88453': 'tecnologia-e-informatica', // Wondershare
  '96499': 'tecnologia-e-informatica', // Ottocast
  '119703': 'tecnologia-e-informatica', // Vatrer
  '77156': 'tecnologia-e-informatica', // Gshopper
  '59557': 'tecnologia-e-informatica', // LaserPecker (gravadores a laser)
  '128639': 'smartphones-e-acessorios', // ESR (EU) (capas, carregadores, acessórios)
  '24562': 'desporto-e-ar-livre', // Padel Market
  '36144': 'casa', // OutIn (máquinas de café expresso portáteis)
  '68106': 'casa', // HTVRont (artesanato, prensas térmicas)
  '69428': 'beleza-e-saude', // Ultrahuman Healthcare (smart rings, trackers)
  '77026': 'moda', // adidas PT
  '82371': 'moda', // The Aeternum Company
  '102509': 'desporto-e-ar-livre', // KuKirin-scooter (trotinetes elétricas)
  '105805': 'tecnologia-e-informatica', // EINSTAR (scanners 3D)
}

// O feed às vezes traz o nome da empresa e não o da marca que o utilizador conhece.
export const MERCHANT_DISPLAY_NAME: Record<string, string> = {
  '59557': 'LaserPecker', // no feed aparece como "Shenzhen Hingin Technology Co.,Ltd"
  '77026': 'adidas',
  '102509': 'KuKirin',
  '69428': 'Ultrahuman',
  '88453': 'Wondershare',
  '128639': 'ESR',
}

// Ordem importa: a primeira regra que casar ganha.
const CATEGORY_RULES: [RegExp, string][] = [
  [/video gam|game console|gaming/i, 'gaming'],
  [/cycling|scooter|\bbike|sport|fitness|outdoor/i, 'desporto-e-ar-livre'],
  [/mobile phone|handset|phone accessor|headset|\bpda|smartwatch|tablet|\bpad\b|earbud|\bbuds\b/i, 'smartphones-e-acessorios'],
  [/clothing|dress|apparel|fashion|\bbags?\b|jewel/i, 'moda'],
  [/health|beauty|skincare|haircare|bodycare|cosmetic|fragrance|medical|massage/i, 'beleza-e-saude'],
  [/kitchen|vacuum|garden|furniture|cookware|home &|household/i, 'casa'],
  [/automotive|projector|software|computer|laptop|electronic|camera|audio|speaker|monitor|usb|charger|battery|carplay/i, 'tecnologia-e-informatica'],
]

export function mapAwinCategory(row: Pick<AwinFeedRow, 'merchant_id' | 'merchant_category' | 'category_name' | 'product_name'>): string {
  const own = MERCHANT_OWN_CATEGORY[row.merchant_id]
  if (own) return own

  const categoryText = `${row.merchant_category || ''} ${row.category_name || ''}`.trim()
  const texts = categoryText ? [categoryText] : [row.product_name || '']

  for (const text of texts) {
    for (const [pattern, slug] of CATEGORY_RULES) {
      if (pattern.test(text)) return slug
    }
  }
  return MERCHANT_DEFAULT_CATEGORY[row.merchant_id] ?? 'tecnologia-e-informatica'
}

// ── Texto ──────────────────────────────────────────────────────────────────
const ENTITIES: Record<string, string> = { '&amp;': '&', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>' }

export function cleanDescription(raw: string | undefined | null, max = 500): string {
  const text = (raw || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(amp|nbsp|quot|#39|apos|lt|gt);/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, ' ')
    .trim()
  return truncateAtWord(text, max)
}

// Remove textos promocionais colados ao título, como 【10% Off + Extra $50 Off with Code】.
export function cleanTitle(raw: string | undefined | null): string {
  return (raw || '')
    .replace(/[【\[][^】\]]*(off|coupon|code|save|deal)[^】\]]*[】\]]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:|-]+$/, '') + '…'
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

// ── Variantes ──────────────────────────────────────────────────────────────
// "Mono Dress | Clothing Size: 16" e "Mono Dress | Size: 10" são o mesmo produto em tamanhos
// diferentes, e "Case - Pink" / "Case - Red" o mesmo produto em cores diferentes: comparamos pelo
// título sem a parte do tamanho/cor.
const COLOR_WORDS = 'black|white|pink|red|purple|green|blue|lavender|gray|grey|yellow|orange|clear|transparent|brown|beige|silver|gold|teal|coral|violet|lilac|burgundy|khaki|navy|mint|cream|rose|olive|sage|peach|turquoise|ivory'
const COLOR_MODIFIERS = 'matte|dark|light|deep|pastel|sky|baby|space|midnight|forest|hot|neon'
// Até 3 palavras de cor/modificador no fim do título, separadas por espaço, / ou & ("Navy Blue", "Pink/Purple")
const TRAILING_COLOR = new RegExp(`\\s+-\\s+(?:(?:${COLOR_WORDS}|${COLOR_MODIFIERS})(?:\\s*[/&]\\s*|\\s+)){0,2}(?:${COLOR_WORDS})\\s*$`, 'i')

export function variantKey(title: string): string {
  const segments = title
    .split('|')
    .map((s) => s.trim().replace(TRAILING_COLOR, ''))
    .filter((s) => s && !/^(clothing\s+)?(uk\s+)?size\b/i.test(s) && !/^(uk\s*)?\d{1,2}$/i.test(s))
  return segments.join(' | ').toLowerCase().replace(/\s+/g, ' ').trim()
}

function sameProduct(a: string, b: string): boolean {
  if (!a || !b) return false
  if (a === b) return true
  const [short, long] = a.length <= b.length ? [a, b] : [b, a]
  return short.length >= 20 && long.startsWith(short)
}

// ── Preços ─────────────────────────────────────────────────────────────────
/** Preço anterior REAL do feed (produto realmente reduzido); null se não houver. */
export function realOldPrice(row: { search_price: string; product_price_old?: string }): number | null {
  const price = Number(row.search_price)
  const old = Number(row.product_price_old)
  if (!(price > 0) || !(old > price)) return null
  // Acima de -60% o "preço antigo" é quase sempre um PVP inflacionado (ex.: o mesmo produto com
  // preço antigo diferente por variante), por isso não o tratamos como desconto real.
  return (old - price) / old <= 0.6 ? old : null
}

// ── Seleção ────────────────────────────────────────────────────────────────
export interface PlannedAwinOffer {
  row: AwinFeedRow
  title: string
  slug: string
  description: string
  priceEur: number
  originalEur: number
  discountPct: number
  categorySlug: string
}

export interface ExistingAwinOffer {
  externalId: string | null
  title: string
  /** Nome da loja onde a oferta está publicada (para equilibrar os anunciantes). */
  storeName?: string | null
}

// Variantes pensadas para outros mercados (tomadas US/AU/UK/JP, firmware chinês): não servem em Portugal.
const NOT_FOR_PORTUGAL = /\b(US|AU|UK|JP|CA|KR|CN)\s*(plug|version|ver\.?)\b/i

// Brindes e amostras que o anunciante lista no feed mas não vende avulso.
const NOT_FOR_SALE = /not for (?:selling|sale|resale|individual)|free gift|gift with purchase|(?:^|[^a-z])sample(?:$|[^a-z])/i

const MAX_PER_MERCHANT = 2
const MIN_PRICE_EUR = 2
// Produtos muito caros e sem desconto real não são "ofertas": ficam de fora da seleção automática.
const MAX_PRICE_EUR = 1500

export async function planAwinRun(
  candidates: AwinFeedRow[],
  existing: ExistingAwinOffer[],
  limit = 5,
  random: () => number = Math.random,
): Promise<PlannedAwinOffer[]> {
  const knownIds = new Set(existing.map((e) => e.externalId).filter(Boolean) as string[])
  const knownKeys = existing.map((e) => variantKey(e.title))

  // 1. Só produtos novos (nem o mesmo ID, nem outra variante de algo já publicado)
  const fresh = candidates.filter((c) => !NOT_FOR_PORTUGAL.test(c.product_name || '') && !NOT_FOR_SALE.test(c.product_name || '') && !knownIds.has(c.aw_product_id) && !knownKeys.some((k) => sameProduct(k, variantKey(c.product_name))))

  // 2. Uma linha por produto (as variantes de tamanho/cor contam como uma só)
  const byKey = new Map<string, AwinFeedRow>()
  for (const row of fresh) {
    const key = `${row.merchant_id}::${variantKey(row.product_name)}`
    if (!byKey.has(key)) byKey.set(key, row)
  }

  // 3. Converter para EUR e descartar o que não faz sentido
  const planned: (PlannedAwinOffer & { realDiscount: boolean; tie: number })[] = []
  for (const row of byKey.values()) {
    const rate = await getEurRate(row.currency)
    if (!rate) continue
    const priceEur = roundMoney(Number(row.search_price) * rate)
    if (priceEur < MIN_PRICE_EUR || priceEur > MAX_PRICE_EUR) continue

    const old = realOldPrice(row)
    const originalEur = old ? roundMoney(old * rate) : priceEur
    const discountPct = originalEur > priceEur ? roundMoney(((originalEur - priceEur) / originalEur) * 100) : 0

    const title = truncateAtWord(cleanTitle(row.product_name), 95)
    if (title.length < 5) continue

    planned.push({
      row,
      title,
      slug: `${slugify(title).slice(0, 90)}-${row.aw_product_id.slice(-6)}`,
      description: cleanDescription(row.description),
      priceEur,
      originalEur,
      discountPct,
      categorySlug: mapAwinCategory(row),
      realDiscount: discountPct >= 10,
      tie: random(),
    })
  }

  // 4. Dentro de cada anunciante: descontos reais primeiro. Entre anunciantes: os menos representados
  //    no site vêm primeiro, para os novos não ficarem afogados pelos que têm milhares de produtos.
  planned.sort((a, b) => Number(b.realDiscount) - Number(a.realDiscount) || b.discountPct - a.discountPct || a.tie - b.tie)

  const publishedByStore = new Map<string, number>()
  for (const e of existing) if (e.storeName) publishedByStore.set(e.storeName, (publishedByStore.get(e.storeName) ?? 0) + 1)

  const groups = new Map<string, typeof planned>()
  for (const p of planned) {
    const list = groups.get(p.row.merchant_id) ?? []
    list.push(p)
    groups.set(p.row.merchant_id, list)
  }

  const displayName = (id: string) => MERCHANT_DISPLAY_NAME[id] ?? groups.get(id)![0].row.merchant_name
  const merchantOrder = [...groups.keys()]
    .map((id) => ({ id, published: publishedByStore.get(displayName(id)) ?? 0, tie: random() }))
    .sort((a, b) => a.published - b.published || a.tie - b.tie)
    .map((m) => m.id)

  // Rodadas: 1º produto de cada anunciante, depois o 2º (no máximo MAX_PER_MERCHANT), até ao limite.
  const picked: PlannedAwinOffer[] = []
  for (let round = 0; round < MAX_PER_MERCHANT && picked.length < limit; round++) {
    for (const id of merchantOrder) {
      const item = groups.get(id)![round]
      if (item) picked.push(item)
      if (picked.length >= limit) break
    }
  }
  return picked
}
