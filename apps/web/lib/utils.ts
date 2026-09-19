import { formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale'

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatTimeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: pt })
  } catch {
    return ''
  }
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 200)
}

// Pede à CDN da loja uma versão reduzida da imagem (as originais têm 1000-1600px e ~200 KB,
// para cards que mostram 160px). Para hosts desconhecidos devolve a URL original.
export function optimizeImageUrl(url: string | null | undefined, width = 400): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'cdn.shopify.com') {
      parsed.searchParams.set('width', String(width))
      return parsed.toString()
    }
    if (/(^|\.)media-amazon\.com$|(^|\.)ssl-images-amazon\.com$/.test(parsed.hostname)) {
      return url.replace(/\._AC_[^./]*_\./, `._AC_SL${width}_.`)
    }
  } catch {
    // URL inválida: usar como veio
  }
  return url
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}
