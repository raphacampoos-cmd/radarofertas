import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { offers, offerCategories, categories, stores, priceHistory } from '@radarofertas/db/schema'
import { eq, desc, and, sql, inArray } from 'drizzle-orm'
import { z } from 'zod'

export const offersRouter = new Hono()

// ── Listagem paginada de ofertas ──────────────────────────────
// GET /api/offers?page=1&limit=20&category=gaming&store=amazon
offersRouter.get('/', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(50, parseInt(c.req.query('limit') || '20'))
  const offset = (page - 1) * limit
  const categorySlug = c.req.query('category')
  const storeSlug = c.req.query('store')
  const sort = c.req.query('sort') || 'published_at' // published_at | deal_score | price_asc

  const conditions = [eq(offers.status, 'active')]

  // Filtro por loja
  if (storeSlug) {
    const store = await db.query.stores.findFirst({
      where: eq(stores.slug, storeSlug)
    })
    if (store) conditions.push(eq(offers.storeId, store.id))
  }

  // Filtro por categoria (via join)
  let categoryId: number | null = null
  if (categorySlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug)
    })
    if (cat) categoryId = cat.id
  }

  const orderBy = sort === 'deal_score'
    ? desc(offers.dealScore)
    : sort === 'price_asc'
    ? offers.priceCurrent
    : desc(offers.publishedAt)

  let query = db.select({
    id: offers.id,
    title: offers.title,
    slug: offers.slug,
    priceCurrent: offers.priceCurrent,
    priceOriginal: offers.priceOriginal,
    priceMinimum: offers.priceMinimum,
    discountPct: offers.discountPct,
    couponCode: offers.couponCode,
    imageUrl: offers.imageUrl,
    dealScore: offers.dealScore,
    isMinHistoric: offers.isMinHistoric,
    availability: offers.availability,
    expiresAt: offers.expiresAt,
    clickCount: offers.clickCount,
    publishedAt: offers.publishedAt,
    store: {
      id: stores.id,
      name: stores.name,
      slug: stores.slug,
      logoUrl: stores.logoUrl,
    },
  })
  .from(offers)
  .innerJoin(stores, eq(offers.storeId, stores.id))
  .where(and(...conditions))
  .orderBy(orderBy)
  .limit(limit)
  .offset(offset)

  // Se tem filtro de categoria, filtrar pelos IDs que pertencem à categoria
  let results: any[]
  if (categoryId) {
    const offerIdsInCat = await db
      .select({ offerId: offerCategories.offerId })
      .from(offerCategories)
      .where(eq(offerCategories.categoryId, categoryId))

    const ids = offerIdsInCat.map(r => r.offerId)
    if (ids.length === 0) {
      return c.json({ data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
    }

    results = await db.select({
      id: offers.id,
      title: offers.title,
      slug: offers.slug,
      priceCurrent: offers.priceCurrent,
      priceOriginal: offers.priceOriginal,
      priceMinimum: offers.priceMinimum,
      discountPct: offers.discountPct,
      couponCode: offers.couponCode,
      imageUrl: offers.imageUrl,
      dealScore: offers.dealScore,
      isMinHistoric: offers.isMinHistoric,
      availability: offers.availability,
      expiresAt: offers.expiresAt,
      clickCount: offers.clickCount,
      publishedAt: offers.publishedAt,
      store: {
        id: stores.id,
        name: stores.name,
        slug: stores.slug,
        logoUrl: stores.logoUrl,
      },
    })
    .from(offers)
    .innerJoin(stores, eq(offers.storeId, stores.id))
    .where(and(eq(offers.status, 'active'), inArray(offers.id, ids)))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)
  } else {
    results = await query
  }

  // Total para paginação
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(offers)
    .where(and(...conditions))

  return c.json({
    data: results,
    pagination: {
      page,
      limit,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / limit),
    }
  })
})

// ── Oferta individual por slug ────────────────────────────────
// GET /api/offers/:slug
offersRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')

  const offer = await db.query.offers.findFirst({
    where: eq(offers.slug, slug),
    with: {
      store: true,
      offerCategories: {
        with: { category: true }
      },
    }
  })

  if (!offer) {
    return c.json({ error: 'Oferta não encontrada' }, 404)
  }

  // Calcular stats do histórico
  const history = await db
    .select()
    .from(priceHistory)
    .where(eq(priceHistory.offerId, offer.id))
    .orderBy(desc(priceHistory.recordedAt))
    .limit(90)

  const prices = history.map(h => parseFloat(h.price as string))
  const avg90 = prices.length > 0
    ? prices.reduce((a, b) => a + b, 0) / prices.length
    : null

  return c.json({
    data: {
      ...offer,
      categories: offer.offerCategories.map(oc => oc.category),
      priceStats: {
        avg90Days: avg90 ? Math.round(avg90 * 100) / 100 : null,
        pointCount: history.length,
        minRecorded: prices.length > 0 ? Math.min(...prices) : null,
        maxRecorded: prices.length > 0 ? Math.max(...prices) : null,
      }
    }
  })
})

// ── Histórico de preços de uma oferta ────────────────────────
// GET /api/offers/:id/history?days=90
offersRouter.get('/:id/history', async (c) => {
  const id = parseInt(c.req.param('id'))
  const days = Math.min(365, parseInt(c.req.query('days') || '90'))

  if (isNaN(id)) return c.json({ error: 'ID inválido' }, 400)

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const history = await db
    .select({
      price: priceHistory.price,
      isMinimum: priceHistory.isMinimum,
      recordedAt: priceHistory.recordedAt,
    })
    .from(priceHistory)
    .where(
      and(
        eq(priceHistory.offerId, id),
        sql`${priceHistory.recordedAt} >= ${since}`
      )
    )
    .orderBy(priceHistory.recordedAt)

  return c.json({ data: history })
})
