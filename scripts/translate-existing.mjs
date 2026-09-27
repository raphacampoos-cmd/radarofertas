import postgres from '../packages/db/node_modules/postgres/src/index.js'

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_1klPRVn0hEqf@ep-gentle-snow-zawbvp2f-pooler.c-2.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require'

const sql = postgres(DATABASE_URL, { ssl: 'require' })

const PT_PT_REPLACEMENTS = [
  [/\btelas?\b/gi, (match) => match === match.toUpperCase() ? (match.endsWith('s') || match.endsWith('S') ? 'ECRÃS' : 'ECRÃ') : (match.endsWith('s') || match.endsWith('S') ? 'ecrãs' : 'ecrã')],
  [/\btouchscreen\b/gi, 'ecrã tátil'],
  [/\bcelulares\b/gi, (m) => m === m.toUpperCase() ? 'TELEMÓVEIS' : 'telemóveis'],
  [/\bcelular\b/gi, (m) => m === m.toUpperCase() ? 'TELEMÓVEL' : 'telemóvel'],
  [/\bfones?\s+de\s+ouvido\b/gi, (m) => m.toLowerCase().includes('fones') ? 'auriculares' : 'auricular'],
  [/\bfones\b/gi, 'auriculares'],
  [/\bgeladeiras\b/gi, 'frigoríficos'],
  [/\bgeladeira\b/gi, 'frigorífico'],
  [/\bnotebooks\b/gi, 'portáteis'],
  [/\bnotebook\b/gi, 'portátil'],
  [/\bmouse\s+(óptico|sem\s+fio|gaming|gamer|bluetooth|usb|sem\s+fios)\b/gi, 'rato $1'],
  [/\b(óptico|sem\s+fio|gaming|gamer|bluetooth|usb)\s+mouse\b/gi, 'rato $1'],
  [/\besportes\b/gi, 'desportos'],
  [/\besporte\b/gi, 'desporto'],
  [/\busuários\b/gi, 'utilizadores'],
  [/\busuário\b/gi, 'utilizador'],
  [/\barquivos\b/gi, 'ficheiros'],
  [/\barquivo\b/gi, 'ficheiro'],
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
]

function normalizeToPtPt(text) {
  if (!text) return ''
  let result = text
  for (const [pattern, replacement] of PT_PT_REPLACEMENTS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

const SPANISH_MARKERS = /\b(con|del|para\s+viaje|inalambrico|inalambrica|inalambricos|inalambricas|plancha|pantalla|movil|auriculares|altavoz|altavoces|soporte|funda|fundas|cargador|cargadores|bateria|raton|ordenador|ordenadores)\b/i

async function translateText(text, forceSourceLang) {
  const trimmed = text?.trim()
  if (!trimmed) return { translated: '', detectedLang: 'pt' }

  try {
    const sl = forceSourceLang || 'auto'
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=pt&dt=t&q=${encodeURIComponent(trimmed)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`Google Translate error: ${res.status}`)

    const data = await res.json()
    const detectedLang = (data[2] || 'unknown').toLowerCase()

    let translated = ''
    if (Array.isArray(data[0])) {
      translated = data[0].map((chunk) => chunk[0] || '').join('')
    } else {
      translated = trimmed
    }

    if ((detectedLang === 'pt' || detectedLang.startsWith('pt')) && !forceSourceLang && SPANISH_MARKERS.test(trimmed)) {
      return await translateText(trimmed, 'es')
    }

    return { translated: normalizeToPtPt(translated), detectedLang }
  } catch (err) {
    console.warn(`[Translate] Aviso para "${trimmed.slice(0, 30)}...":`, err.message)
    return { translated: normalizeToPtPt(trimmed), detectedLang: 'unknown' }
  }
}

function shortenTitle(title, maxLength = 80) {
  if (!title) return ''
  let cleaned = title.trim()
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/""+/g, '"')

  if (cleaned.includes('|')) {
    const parts = cleaned.split('|').map(p => p.trim())
    if (parts[0].length >= 18) {
      cleaned = parts[0]
    }
  }

  const junkPatterns = [
    /\s*[-–—]\s*(?:compatível com|para homens e mulheres|presente para|prenda de natal|alta qualidade|versão global|bateria de longa duração|design ergonómico).*$/i,
    /\s*,\s*(?:bateria de \d+.*|câmara \d+.*|ecrã \d+.*)$/i,
    /\s*\((?:presente|prenda|gift|new version|versão \d+|pack de \d+ unidades)\)$/i,
  ]

  for (const pat of junkPatterns) {
    cleaned = cleaned.replace(pat, '')
  }

  if (cleaned.length > maxLength) {
    const firstDash = cleaned.indexOf(' – ')
    if (firstDash > 25 && firstDash <= maxLength) {
      return cleaned.slice(0, firstDash).trim()
    }
    const sub = cleaned.slice(0, maxLength)
    const lastSpace = sub.lastIndexOf(' ')
    if (lastSpace > 35) {
      cleaned = sub.slice(0, lastSpace).trim()
    } else {
      cleaned = sub.trim()
    }
    cleaned = cleaned.replace(/[,;:\-\s]+$/, '')
  }

  return cleaned
}

async function run() {
  console.log('🚀 A iniciar tradução de ofertas na base de dados Neon...')

  const offers = await sql`
    SELECT id, title, description, title_pt, description_pt
    FROM offers
    WHERE title_pt IS NULL OR title_pt = ''
    ORDER BY id DESC
  `

  console.log(`📦 Encontradas ${offers.length} ofertas pendentes de tradução.`)

  let count = 0
  for (const o of offers) {
    try {
      const transTitle = await translateText(o.title)
      const shortened = shortenTitle(transTitle.translated, 80)

      let transDesc = null
      if (o.description && o.description.trim().length > 0) {
        const descResult = await translateText(o.description.slice(0, 600))
        transDesc = descResult.translated
      }

      await sql`
        UPDATE offers
        SET title_pt = ${shortened},
            description_pt = ${transDesc},
            updated_at = NOW()
        WHERE id = ${o.id}
      `

      count++
      console.log(`[${count}/${offers.length}] #${o.id}: "${o.title.slice(0, 35)}..." -> "${shortened}" (Lang: ${transTitle.detectedLang})`)
      await new Promise(r => setTimeout(r, 80))
    } catch (err) {
      console.error(`Erro ao processar oferta #${o.id}:`, err.message)
    }
  }

  console.log(`\n🎉 Concluído com sucesso! ${count} ofertas traduzidas e guardadas em title_pt e description_pt.`)
  await sql.end()
}

run().catch(console.error)
