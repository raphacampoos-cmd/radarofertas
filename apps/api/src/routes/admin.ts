import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { offers, offerCategories, priceHistory, subscribers, categories, stores } from '@radarofertas/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { z } from 'zod'
import { calculateDealScore } from '@radarofertas/deal-engine'
import { sendTelegramAlert } from '../lib/telegram.js'
import { sendWhatsAppMessage } from '../lib/whatsapp.js'
import { runDiscoveryBot } from '../services/discovery-bot.js'
import { sendWeeklyNewsletter } from '../services/newsletter.js'
import { processOfferTranslation } from '../lib/translate.js'

export const adminRouter = new Hono()

// Chaves de exemplo e valores inseguros proibidos
const FORBIDDEN_KEYS = new Set([
  'radar_admin_secret_change_in_production',
  'admin',
  'secret',
  'password',
  'change_me',
])

// Middleware de autenticação admin estrito
adminRouter.use('*', async (c, next) => {
  // SEGURANÇA: Proibido passar chave na URL (?key=). Aceite APENAS no cabeçalho x-admin-key.
  if (c.req.query('key')) {
    return c.json({ error: 'Proibido passar chave na URL. Utiliza exclusivamente o cabeçalho X-Admin-Key.' }, 400)
  }

  const clientKey = c.req.header('x-admin-key')?.trim()
  const serverKey = process.env.ADMIN_API_KEY?.trim()

  // Se o servidor não tiver chave configurada, for muito curta ou for a chave de exemplo exposta, recusa terminantemente
  if (!serverKey || serverKey.length < 24 || FORBIDDEN_KEYS.has(serverKey)) {
    console.error('🚨 [Segurança] ADMIN_API_KEY insegura, padrão ou não configurada no servidor.')
    return c.json({ error: 'Área de administração inativa: ADMIN_API_KEY não configurada de forma segura no servidor.' }, 503)
  }

  // Recusa se o cliente tentar usar chave vazia, chaves proibidas ou diferente da chave real
  if (!clientKey || FORBIDDEN_KEYS.has(clientKey) || clientKey !== serverKey) {
    return c.json({ error: 'Não autorizado. Chave de administração inválida.' }, 401)
  }

  await next()
})

// ── Schema de validação ────────────────────────────────────────
const createOfferSchema = z.object({
  title: z.string().min(5).max(500),
  storeId: z.number().positive(),
  externalId: z.string().optional(),
  priceCurrent: z.number().positive(),
  priceOriginal: z.number().positive(),
  couponCode: z.string().optional(),
  imageUrl: z.string().url().optional(),
  description: z.string().optional(),
  affiliateUrl: z.string().url(),
  categoryIds: z.array(z.number()).min(1),
  expiresAt: z.string().datetime().optional(),
  source: z.enum(['editorial', 'community', 'auto']).default('editorial'),
  campaign: z.string().optional(),
})

// Validação estrita: O link da oferta tem de corresponder à loja selecionada
function validateStoreMatchesUrl(storeSlug: string, storeName: string, affiliateUrl: string): { valid: boolean; error?: string } {
  const urlLower = affiliateUrl.toLowerCase()
  const slug = storeSlug.toLowerCase()

  const isAmazon = slug === 'amazon'
  const isAmazonUrl = urlLower.includes('amazon.') || urlLower.includes('amzn.to')

  if (isAmazon && !isAmazonUrl) {
    return { valid: false, error: 'A loja selecionada é Amazon, mas o link fornecido não pertence à Amazon.' }
  }
  if (!isAmazon && isAmazonUrl) {
    return { valid: false, error: `O link fornecido é da Amazon, mas a loja indicada é "${storeName}". O domínio do link tem de corresponder à loja.` }
  }

  // Lojas específicas
  if (slug === 'worten' && !urlLower.includes('worten') && !urlLower.includes('12149')) {
    return { valid: false, error: 'O link fornecido não pertence à Worten nem ao seu programa de afiliados.' }
  }
  if (slug === 'pc-componentes' && !urlLower.includes('pccomponentes') && !urlLower.includes('12149')) {
    return { valid: false, error: 'O link fornecido não pertence à PC Componentes.' }
  }
  if (slug === 'fnac' && !urlLower.includes('fnac')) {
    return { valid: false, error: 'O link fornecido não pertence à Fnac.' }
  }
  if (slug === 'pcdiga' && !urlLower.includes('pcdiga')) {
    return { valid: false, error: 'O link fornecido não pertence à PCDIGA.' }
  }

  return { valid: true }
}

// POST /api/admin/offers — criar oferta
adminRouter.post('/offers', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = createOfferSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, 400)
    }

    const data = parsed.data

    // Validar se a loja existe e se o link corresponde ao domínio da loja
    const store = await db.query.stores.findFirst({ where: eq(stores.id, data.storeId) })
    if (!store) {
      return c.json({ error: 'Loja especificada não existe.' }, 400)
    }
    const val = validateStoreMatchesUrl(store.slug, store.name, data.affiliateUrl)
    if (!val.valid) {
      return c.json({ error: val.error }, 400)
    }

    // Gerar slug a partir do título
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 200)

    // Calcular desconto
    const discountPct = ((data.priceOriginal - data.priceCurrent) / data.priceOriginal * 100)

    // Calcular Deal Score inicial (sem histórico)
    const scoreResult = calculateDealScore({
      priceCurrent: data.priceCurrent,
      priceOriginal: data.priceOriginal,
      priceMinHistoric: null,
      priceAvg90Days: null,
    })

    // Traduzir e encurtar título se necessário
    const translation = await processOfferTranslation(data.title, data.description)

    const [newOffer] = await db.insert(offers).values({
      title: data.title,
      titlePt: translation.titlePt,
      slug,
      storeId: data.storeId,
      externalId: data.externalId,
      priceCurrent: data.priceCurrent.toFixed(2),
      priceOriginal: data.priceOriginal.toFixed(2),
      priceMinimum: data.priceCurrent.toFixed(2),
      discountPct: discountPct.toFixed(2),
      couponCode: data.couponCode,
      imageUrl: data.imageUrl,
      description: data.description,
      descriptionPt: translation.descriptionPt,
      affiliateUrl: data.affiliateUrl,
      dealScore: scoreResult.score.toFixed(2),
      isMinHistoric: false,
      availability: 'InStock',
      status: (!data.imageUrl || !data.affiliateUrl) ? 'draft' : 'active',
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      source: data.source,
      campaign: data.campaign || null,
    }).returning()

    // Associar categorias
    for (const catId of data.categoryIds) {
      await db.insert(offerCategories).values({
        offerId: newOffer.id,
        categoryId: catId,
      })
    }

    // Primeiro registo de histórico de preços
    await db.insert(priceHistory).values({
      offerId: newOffer.id,
      storeId: data.storeId,
      price: data.priceCurrent.toFixed(2),
      source: 'manual',
    })

    // Enviar alerta automático para o Canal de Telegram e WhatsApp
    const priceOriginalNum = Number(newOffer.priceOriginal) || 0;
    const priceCurrentNum = Number(newOffer.priceCurrent) || 0;
    const isAmazon = newOffer.affiliateUrl?.includes('amazon');
    
    const wppMsg = isAmazon
      ? `📦 *DESTAQUE NA AMAZON!*\n\n🔥 *${newOffer.title}*\n\n💰 Preço atualizado em direto na Amazon.\n👉 Ver preço atual na Amazon: ${newOffer.affiliateUrl}`
      : `🔥 *${newOffer.title}*\n\n💰 Preço: €${newOffer.priceCurrent}${priceOriginalNum > priceCurrentNum ? ` (antes €${newOffer.priceOriginal})` : ''}\n${newOffer.couponCode ? `🏷️ Cupão: ${newOffer.couponCode}\n` : ''}\n👉 Compra aqui: ${newOffer.affiliateUrl}`;

    // Disparar o Telegram sem bloquear a resposta HTTP
    sendTelegramAlert({
      title: newOffer.title,
      priceCurrent: priceCurrentNum,
      priceOriginal: priceOriginalNum,
      affiliateUrl: newOffer.affiliateUrl,
      imageUrl: newOffer.imageUrl || undefined,
      couponCode: newOffer.couponCode || undefined
    }).catch(console.error)
    
    // Disparar o WhatsApp se existir número configurado (Ex: Grupo ou Contacto)
    if (process.env.WHATSAPP_GROUP_ID) {
       sendWhatsAppMessage(process.env.WHATSAPP_GROUP_ID, wppMsg, newOffer.imageUrl || undefined).catch(console.error)
    }

    return c.json({ data: newOffer }, 201)
  } catch (err: any) {
    if (err.code === '23505') {
      return c.json({ error: 'Já existe uma oferta com este slug' }, 409)
    }
    console.error('Erro ao criar oferta:', err)
    return c.json({ error: 'Erro interno' }, 500)
  }
})

// PUT /api/admin/offers/:id — atualizar oferta
adminRouter.put('/offers/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'ID inválido' }, 400)

  const body = await c.req.json()

  // Se estiver a atualizar storeId ou affiliateUrl, valida a correspondência
  if (body.storeId || body.affiliateUrl) {
    const current = await db.query.offers.findFirst({ where: eq(offers.id, id) })
    if (current) {
      const storeIdToCheck = body.storeId || current.storeId
      const urlToCheck = body.affiliateUrl || current.affiliateUrl
      const store = await db.query.stores.findFirst({ where: eq(stores.id, storeIdToCheck) })
      if (store && urlToCheck) {
        const val = validateStoreMatchesUrl(store.slug, store.name, urlToCheck)
        if (!val.valid) {
          return c.json({ error: val.error }, 400)
        }
      }
    }
  }

  await db.update(offers).set({
    ...body,
    updatedAt: new Date(),
  }).where(eq(offers.id, id))

  return c.json({ success: true })
})

// GET /api/admin/offers/pending — listar ofertas por aprovar (Awin)
adminRouter.get('/offers/pending', async (c) => {
  const pending = await db.select({
    id: offers.id,
    title: offers.title,
    priceCurrent: offers.priceCurrent,
    priceOriginal: offers.priceOriginal,
    affiliateUrl: offers.affiliateUrl,
    imageUrl: offers.imageUrl,
    createdAt: offers.createdAt
  }).from(offers).where(eq(offers.status, 'pending')).orderBy(desc(offers.createdAt))

  return c.json({ data: pending })
})

// PUT /api/admin/offers/:id/approve — aprovar oferta pendente da Awin
adminRouter.put('/offers/:id/approve', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'ID inválido' }, 400)

  // Atualizar para ativo e forçar ser o mais recente
  await db.update(offers).set({
    status: 'active',
    publishedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(offers.id, id))

  // Buscar oferta para disparar os canais
  const offer = await db.select().from(offers).where(eq(offers.id, id)).limit(1)
  
  if (offer.length > 0) {
    const o = offer[0]
    
    // Telegram
    sendTelegramAlert({
      title: `🔥 APROVADA: ${o.title}`,
      priceCurrent: o.priceCurrent?.toString() || '',
      priceOriginal: o.priceOriginal?.toString() || '',
      affiliateUrl: o.affiliateUrl,
      imageUrl: o.imageUrl || undefined,
      couponCode: o.couponCode || undefined
    }).catch(console.error)

    // WhatsApp
    if (process.env.WHATSAPP_GROUP_ID) {
       const wppMsg = `🚨 *NOVA OFERTA AWIN*\n\n🔥 *${o.title}*\n\n💰 Apenas: €${o.priceCurrent}\n\n👉 Compra aqui: ${o.affiliateUrl}`
       sendWhatsAppMessage(process.env.WHATSAPP_GROUP_ID, wppMsg, o.imageUrl || undefined).catch(console.error)
    }
  }

  return c.json({ success: true })
})

// GET /api/admin/stats — métricas básicas
adminRouter.get('/stats', async (c) => {
  const [totalOffers] = await db.select({ count: sql<number>`count(*)` }).from(offers)
  const [activeOffers] = await db.select({ count: sql<number>`count(*)` }).from(offers).where(eq(offers.status, 'active'))
  const [totalClicks] = await db.select({ clicks: sql<number>`sum(click_count)` }).from(offers)
  const [totalSubscribers] = await db.select({ count: sql<number>`count(*)` }).from(subscribers)

  return c.json({
    data: {
      totalOffers: Number(totalOffers.count),
      activeOffers: Number(activeOffers.count),
      totalClicks: Number(totalClicks.clicks) || 0,
      totalSubscribers: Number(totalSubscribers.count),
    }
  })
})

// GET /api/admin/subscribers — lista de subscritores
adminRouter.get('/subscribers', async (c) => {
  const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt))
  return c.json({ data })
})

// ── WhatsApp ────────────────────────────────────────────────
import { waStatus, waQrCode, initWhatsApp, waSocket } from '../lib/whatsapp.js'

adminRouter.get('/whatsapp/status', async (c) => {
  return c.json({ status: waStatus, qr: waQrCode })
})

adminRouter.post('/whatsapp/connect', async (c) => {
  if (waStatus === 'disconnected') {
    initWhatsApp().catch(console.error)
  }
  return c.json({ status: 'connecting' })
})

adminRouter.get('/whatsapp/groups', async (c) => {
  if (waStatus !== 'connected' || !waSocket) {
    return c.json({ error: 'WhatsApp não está conectado' }, 400)
  }
  try {
    const groups = await waSocket.groupFetchAllParticipating()
    const list = Object.values(groups).map(g => ({ id: g.id, subject: g.subject }))
    return c.json({ data: list })
  } catch (err) {
    return c.json({ error: 'Erro ao obter grupos' }, 500)
  }
})

// ── Bot Promotor (Twitter / Discord) ───────────────────────
import { runSocialBot } from '../services/social-bot.js'

adminRouter.post('/trigger-bot', async (c) => {
  try {
    // Corre o bot em background (não bloqueia a resposta)
    runSocialBot().catch(console.error)
    return c.json({ success: true, message: 'Bot ativado! Verifica o Twitter e o Discord em alguns segundos.' })
  } catch (error) {
    return c.json({ error: 'Erro ao ativar o bot' }, 500)
  }
})

// POST /api/admin/trigger-discovery — corre o Robô Descobridor (Amazon bestsellers) em background
adminRouter.post('/trigger-discovery', async (c) => {
  runDiscoveryBot().catch(console.error)
  return c.json({ success: true, message: 'Robô Descobridor iniciado em segundo plano. Os novos produtos aparecem daqui a alguns minutos.' })
})

// POST /api/admin/trigger-newsletter { email } — envia a newsletter SÓ para o e-mail de teste indicado
adminRouter.post('/trigger-newsletter', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!email || !email.includes('@')) {
    return c.json({ success: false, error: 'Indica um e-mail de teste válido.' }, 400)
  }
  const result = await sendWeeklyNewsletter(true, email)
  return c.json(result.success ? { success: true } : { success: false, error: typeof result.error === 'string' ? result.error : 'Erro ao enviar.' }, result.success ? 200 : 500)
})

// POST /api/admin/awin/test-agent � injeta uma oferta teste na fila de aprova��o
adminRouter.post('/awin/test-agent', async (c) => {
  const [cat] = await db.select().from(categories).limit(1)
  
  const inserted = await db.insert(offers).values({
    title: 'Monitor Gaming AOC 24G2U 144Hz (Descoberta pela Awin!)',
    slug: 'monitor-gaming-aoc-24g2u-awin-test-' + Date.now(),
    storeId: 1, 
    priceCurrent: '149.99',
    priceOriginal: '199.99',
    priceMinimum: '149.99',
    affiliateUrl: 'https://www.awin1.com/cread.php?awinmid=12149&awinaffid=3099259&ued=https%3A%2F%2Fwww.pccomponentes.pt%2Faoc-24g2u',
    imageUrl: 'https://thumb.pccomponentes.com/w-530-530/articles/23/235303/aoc-24g2u-bk-23-8-led-ips-fullhd-144hz-freesync.jpg',
    status: 'pending',
    source: 'awin_api',
    publishedAt: new Date(),
    updatedAt: new Date()
  }).returning()

  if (inserted.length > 0 && cat) {
    await db.insert(offerCategories).values({ offerId: inserted[0].id, categoryId: cat.id })
  }

  return c.json({ success: true })
})

// ── Tradução em Lote de Ofertas (PT-PT) ──────────────────────
// GET ou POST /api/admin/translate-all?key=...&force=true&limit=200
async function handleBatchTranslation(c: any) {
  const force = c.req.query('force') === 'true'
  const limit = Math.min(500, Math.max(1, parseInt(c.req.query('limit') || '250') || 250))

  // Condição: por padrão traduz ofertas onde titlePt é nulo ou vazio
  const whereCondition = force
    ? undefined
    : sql`${offers.titlePt} IS NULL OR ${offers.titlePt} = ''`

  const targetOffers = await db
    .select({
      id: offers.id,
      title: offers.title,
      description: offers.description,
      titlePt: offers.titlePt,
    })
    .from(offers)
    .where(whereCondition)
    .limit(limit)

  console.log(`🌐 [Tradução em Lote] A processar ${targetOffers.length} ofertas (force=${force})...`)

  const results: Array<{ id: number; original: string; titlePt: string; wasTranslated: boolean }> = []
  let updatedCount = 0

  for (const item of targetOffers) {
    try {
      const translation = await processOfferTranslation(item.title, item.description)

      await db
        .update(offers)
        .set({
          titlePt: translation.titlePt,
          descriptionPt: translation.descriptionPt,
          updatedAt: new Date(),
        })
        .where(eq(offers.id, item.id))

      updatedCount++
      results.push({
        id: item.id,
        original: item.title,
        titlePt: translation.titlePt,
        wasTranslated: translation.wasTranslated,
      })

      // Intervalo de 80ms para suavizar chamadas
      await new Promise((r) => setTimeout(r, 80))
    } catch (err) {
      console.error(`Erro ao traduzir oferta #${item.id}:`, err)
    }
  }

  return c.json({
    success: true,
    message: `Tradução concluída! ${updatedCount} de ${targetOffers.length} ofertas processadas e atualizadas para PT-PT.`,
    totalProcessed: targetOffers.length,
    updatedCount,
    samples: results.slice(0, 15),
  })
}

adminRouter.get('/translate-all', handleBatchTranslation)
adminRouter.post('/translate-all', handleBatchTranslation)

