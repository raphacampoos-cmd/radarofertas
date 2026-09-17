import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { offers, offerCategories, priceHistory, subscribers } from '@radarofertas/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { z } from 'zod'
import { calculateDealScore } from '@radarofertas/deal-engine'
import { sendTelegramAlert } from '../lib/telegram.js'
import { sendWhatsAppMessage } from '../lib/whatsapp.js'

export const adminRouter = new Hono()

// Middleware de autenticação admin
adminRouter.use('*', async (c, next) => {
  const key = c.req.header('x-admin-key')
  const validKey = process.env.ADMIN_API_KEY

  if (!validKey || key !== validKey) {
    return c.json({ error: 'Não autorizado' }, 401)
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
})

// POST /api/admin/offers — criar oferta
adminRouter.post('/offers', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = createOfferSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, 400)
    }

    const data = parsed.data

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

    const [newOffer] = await db.insert(offers).values({
      title: data.title,
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
      affiliateUrl: data.affiliateUrl,
      dealScore: scoreResult.score.toFixed(2),
      isMinHistoric: false,
      availability: 'InStock',
      status: 'active',
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      source: data.source,
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
    
    const wppMsg = `🔥 *${newOffer.title}*\n\n💰 Preço: €${newOffer.priceCurrent}${priceOriginalNum > priceCurrentNum ? ` (antes €${newOffer.priceOriginal})` : ''}\n${newOffer.couponCode ? `🏷️ Cupão: ${newOffer.couponCode}\n` : ''}\n👉 Compra aqui: ${newOffer.affiliateUrl}`;

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

  await db.update(offers).set({
    ...body,
    updatedAt: new Date(),
  }).where(eq(offers.id, id))

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

