/**
 * Serviço de Tradução e Normalização para Português de Portugal (PT-PT)
 *
 * 1. Deteta idioma automaticamente (EN, ES, DE, FR, etc.)
 * 2. Traduz para Português
 * 3. Converte termos PT-BR para estritamente PT-PT ("ecrã", "telemóvel", "frigorífico", "auriculares")
 * 4. Encurta títulos longos mantendo marca, modelo e atributo principal (~80 caracteres)
 */

// Termos comuns para conversão de PT-BR / ES para PT-PT
type Replacer = string | ((substring: string, ...args: any[]) => string)
const PT_PT_REPLACEMENTS: Array<[RegExp, Replacer]> = [
  // Telas -> Ecrãs
  [/\btelas?\b/gi, (match: string) => match === match.toUpperCase() ? (match.endsWith('s') || match.endsWith('S') ? 'ECRÃS' : 'ECRÃ') : (match.endsWith('s') || match.endsWith('S') ? 'ecrãs' : 'ecrã')],
  [/\btouchscreen\b/gi, 'ecrã tátil'],
  // Celular -> Telemóvel
  [/\bcelulares\b/gi, (m: string) => m === m.toUpperCase() ? 'TELEMÓVEIS' : 'telemóveis'],
  [/\bcelular\b/gi, (m: string) => m === m.toUpperCase() ? 'TELEMÓVEL' : 'telemóvel'],
  // Fones de ouvido -> Auriculares / Auscultadores
  [/\bfones?\s+de\s+ouvido\b/gi, (m: string) => m.toLowerCase().includes('fones') ? 'auriculares' : 'auricular'],
  [/\bfones\b/gi, 'auriculares'],
  // Geladeira -> Frigorífico
  [/\bgeladeiras\b/gi, 'frigoríficos'],
  [/\bgeladeira\b/gi, 'frigorífico'],
  // Notebook -> Portátil
  [/\bnotebooks\b/gi, 'portáteis'],
  [/\bnotebook\b/gi, 'portátil'],
  // Mouse (informática)
  [/\bmouse\s+(óptico|sem\s+fio|gaming|gamer|bluetooth|usb|sem\s+fios)\b/gi, 'rato $1'],
  [/\b(óptico|sem\s+fio|gaming|gamer|bluetooth|usb)\s+mouse\b/gi, 'rato $1'],
  // Esporte -> Desporto
  [/\besportes\b/gi, 'desportos'],
  [/\besporte\b/gi, 'desporto'],
  [/\besportivo\b/gi, 'desportivo'],
  [/\besportiva\b/gi, 'desportiva'],
  [/\besportivos\b/gi, 'desportivos'],
  [/\besportivas\b/gi, 'desportivas'],
  // Controle remoto / Controle -> Comando / Controlo
  [/\bcontrole\s+remoto\b/gi, (m: string) => m[0] === m[0].toUpperCase() ? 'Comando' : 'comando'],
  [/\bcontroles\s+remotos\b/gi, (m: string) => m[0] === m[0].toUpperCase() ? 'Comandos' : 'comandos'],
  [/\bcontrole\s+de\s+voz\b/gi, 'controlo por voz'],
  [/\bcontrole\b/gi, (m: string) => m[0] === m[0].toUpperCase() ? 'Controlo' : 'controlo'],
  [/\bcontroles\b/gi, (m: string) => m[0] === m[0].toUpperCase() ? 'Controlos' : 'controlos'],
  // Usuário -> Utilizador
  [/\busuários\b/gi, 'utilizadores'],
  [/\busuário\b/gi, 'utilizador'],
  // Arquivo -> Ficheiro
  [/\barquivos\b/gi, 'ficheiros'],
  [/\barquivo\b/gi, 'ficheiro'],
  // Outros termos comuns
  [/\bcarregamento\s+rápido\b/gi, 'carregamento rápido'],
  [/\bsem\s+fio\b/gi, 'sem fios'],
  [/\binalámbrico\b/gi, 'sem fios'],
  [/\binalámbrica\b/gi, 'sem fios'],
  [/\binalámbricos\b/gi, 'sem fios'],
  [/\binalámbricas\b/gi, 'sem fios'],
  [/\bplancha\s+de\s+vapor\b/gi, 'ferro a vapor'],
  [/\bplancha\b/gi, 'ferro de engomar'],
  [/\bde\s+viaje\b/gi, 'de viagem'],
  [/\baltavoz\b/gi, 'coluna de som'],
  [/\baltavoces\b/gi, 'colunas de som'],
  [/\breloj\s+inteligente\b/gi, 'smartwatch'],
  [/\bcámara\b/gi, 'câmara'],
  [/\bcámaras\b/gi, 'câmaras'],
  [/\bvídeo\b/gi, 'vídeo'],
  [/\bfones?\b/gi, (m: string) => m.toLowerCase().endsWith('s') ? 'auriculares' : 'auricular'],
  [/\bfora\s+d[oe]\s+mini\b/gi, 'Outin Mini'],
  [/\bsônica\b/gi, 'sónica'],
  [/\bsônicas\b/gi, 'sónicas'],
  [/\bsônico\b/gi, 'sónico'],
  [/\bsônicos\b/gi, 'sónicos'],
  [/\bpara\s+trajes\b/gi, 'para roupa'],
]

/**
 * Normaliza um texto para vocabulário e ortografia estritamente PT-PT
 */
export function normalizeToPtPt(text: string): string {
  if (!text) return ''
  let result = text
  for (const [pattern, replacement] of PT_PT_REPLACEMENTS) {
    result = result.replace(pattern, replacement as any)
  }
  if (text[0] && text[0] === text[0].toUpperCase() && result[0]) {
    result = result[0].toUpperCase() + result.slice(1)
  }
  return result
}

// Deteta palavras exclusivas de espanhol que por vezes enganam detetores de idioma
const SPANISH_MARKERS = /\b(con|del|para\s+viaje|inalambrico|inalambrica|inalambricos|inalambricas|plancha|pantalla|movil|auriculares|altavoz|altavoces|soporte|funda|fundas|cargador|cargadores|bateria|raton|ordenador|ordenadores)\b/i

/**
 * Chama a API do Google Translate (gratuita e sem chave de API necessária)
 */
export async function translateText(
  text: string,
  forceSourceLang?: string
): Promise<{ translated: string; detectedLang: string }> {
  const trimmed = text?.trim()
  if (!trimmed) {
    return { translated: '', detectedLang: 'pt' }
  }

  try {
    const sl = forceSourceLang || 'auto'
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=pt&dt=t&q=${encodeURIComponent(trimmed)}`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      throw new Error(`Google Translate error: ${res.status}`)
    }

    const data = await res.json() as any
    const detectedLang = (data[2] || 'unknown').toLowerCase()

    // O Google Translate devolve os blocos traduzidos em data[0]
    let translated = ''
    if (Array.isArray(data[0])) {
      translated = data[0].map((chunk: any) => chunk[0] || '').join('')
    } else {
      translated = trimmed
    }

    // Se detetou PT mas há marcadores óbvios de Espanhol, forçar tradução de ES -> PT
    if ((detectedLang === 'pt' || detectedLang.startsWith('pt')) && !forceSourceLang && SPANISH_MARKERS.test(trimmed)) {
      return await translateText(trimmed, 'es')
    }

    // Aplicar regras de conversão estritas para PT-PT
    translated = normalizeToPtPt(translated)

    return { translated, detectedLang }
  } catch (err) {
    console.warn(`[Translate] Falha na tradução de: "${trimmed.slice(0, 30)}...":`, err)
    // Fallback: retorna o texto original com substituições PT-PT básicas
    return { translated: normalizeToPtPt(trimmed), detectedLang: 'unknown' }
  }
}

/**
 * Encurta títulos de ofertas para cerca de 80 caracteres (máximo),
 * preservando marca, modelo e característica principal (ex: "REDMI Note 17 6+256GB – Roxo Celeste").
 */
export function shortenTitle(title: string, maxLength = 80): string {
  if (!title) return ''
  let cleaned = title.trim()

  // 1. Limpar aspas estranhas ou entidades HTML comuns
  cleaned = cleaned
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/""+/g, '"')

  // 2. Se o título tiver separadores de SEO típicos da Amazon/Awin (| ou • ou barra dupla)
  // Ex: "Rowenta Pure Pop, Plancha de Vapor 1300 W para Viaje | Vapor contínuo 20 g/min..."
  if (cleaned.includes('|')) {
    const parts = cleaned.split('|').map(p => p.trim())
    if (parts[0].length >= 18) {
      cleaned = parts[0]
    }
  }

  // 3. Remover frases de enchimento de keywords comuns no fim do título
  const junkPatterns = [
    /\s*[-–—]\s*(?:compatível com|para homens e mulheres|presente para|prenda de natal|alta qualidade|versão global|bateria de longa duração|design ergonómico).*$/i,
    /\s*,\s*(?:bateria de \d+.*|câmara \d+.*|ecrã \d+.*)$/i,
    /\s*\((?:presente|prenda|gift|new version|versão \d+|pack de \d+ unidades)\)$/i,
  ]

  for (const pat of junkPatterns) {
    cleaned = cleaned.replace(pat, '')
  }

  // 4. Se ainda ultrapassar maxLength, cortar na última palavra completa
  if (cleaned.length > maxLength) {
    // Tenta encontrar um separador natural (–, -, vírgula) antes do limite
    const firstDash = cleaned.indexOf(' – ')
    if (firstDash > 25 && firstDash <= maxLength) {
      return cleaned.slice(0, firstDash).trim()
    }

    // Corte na última palavra inteira
    const sub = cleaned.slice(0, maxLength)
    const lastSpace = sub.lastIndexOf(' ')
    if (lastSpace > 35) {
      cleaned = sub.slice(0, lastSpace).trim()
    } else {
      cleaned = sub.trim()
    }

    // Remover pontuação residual no final
    cleaned = cleaned.replace(/[,;:\-\s]+$/, '')
  }

  return cleaned
}

export interface ProcessedTranslation {
  titlePt: string
  descriptionPt: string | null
  detectedLang: string
  wasTranslated: boolean
}

/**
 * Processa a tradução e encurtamento completo de uma oferta
 */
export async function processOfferTranslation(
  title: string,
  description?: string | null
): Promise<ProcessedTranslation> {
  const originalTitle = title || ''

  // 1. Traduzir título se necessário
  const titleResult = await translateText(originalTitle)

  // 2. Encurtar o título traduzido para ~80 caracteres preservando marca/modelo
  const shortenedTitle = shortenTitle(titleResult.translated, 80)

  // 3. Traduzir descrição se existir
  let descriptionPt: string | null = null
  let descLang = titleResult.detectedLang

  if (description && description.trim().length > 0) {
    // Truncar descrição longa para tradução rápida e eficiente (máx 600 chars)
    const trimmedDesc = description.slice(0, 600)
    const descResult = await translateText(trimmedDesc)
    descriptionPt = descResult.translated
    descLang = descResult.detectedLang
  }

  const detectedLang = titleResult.detectedLang !== 'pt' ? titleResult.detectedLang : descLang
  const wasTranslated = detectedLang !== 'pt' && detectedLang !== 'pt-pt'

  return {
    titlePt: shortenedTitle,
    descriptionPt,
    detectedLang,
    wasTranslated,
  }
}
