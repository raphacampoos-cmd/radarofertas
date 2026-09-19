import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { offers, offerCategories, categories, stores, priceHistory, comments } from '@radarofertas/db/schema'
import { eq, desc, and, sql, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { offerListFields } from '../lib/offer-fields.js'
import { offerIdsForCategory } from '../lib/category-offers.js'

export const offersRouter = new Hono()

// ── Listagem paginada de ofertas ──────────────────────────────
// GET /api/offers?page=1&limit=20&category=gaming&store=amazon
offersRouter.get('/', async (c) => {
  const page = Math.max(1, parseInt(c.req.query('page') || '1') || 1)
  const limit = Math.min(200, Math.max(1, parseInt(c.req.query('limit') || '20') || 20))
  const offset = (page - 1) * limit
  const categorySlug = c.req.query('category')
  const storeSlug = c.req.query('store')
  const sort = c.req.query('sort') || 'published_at' // published_at | deal_score | price_asc

  const emptyResult = { data: [], pagination: { page, limit, total: 0, totalPages: 0 } }
  const conditions = [eq(offers.status, 'active')]

  // Filtro por loja (loja inexistente = sem resultados, em vez de ignorar o filtro)
  if (storeSlug) {
    const store = await db.query.stores.findFirst({ where: eq(stores.slug, storeSlug) })
    if (!store) return c.json(emptyResult)
    conditions.push(eq(offers.storeId, store.id))
  }

  // Filtro por categoria (inclui subcategorias)
  if (categorySlug) {
    const cat = await db.query.categories.findFirst({ where: eq(categories.slug, categorySlug) })
    if (!cat) return c.json(emptyResult)
    const ids = await offerIdsForCategory(cat.id)
    if (ids.length === 0) return c.json(emptyResult)
    conditions.push(inArray(offers.id, ids))
  }

  const orderBy = sort === 'deal_score'
    ? desc(offers.dealScore)
    : sort === 'price_asc'
    ? offers.priceCurrent
    : desc(offers.publishedAt)

  const results = await db.select(offerListFields)
    .from(offers)
    .innerJoin(stores, eq(offers.storeId, stores.id))
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset)

  // Total para paginação (com os mesmos filtros)
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

// ── Atividade recente (voto mais recente) — alimenta o ticker "X deu Fixe a Y" ──
// GET /api/offers/activity/recent
offersRouter.get('/activity/recent', async (c) => {
  const recent = await db.query.offers.findFirst({
    where: and(eq(offers.status, 'active'), sql`${offers.lastVotedAt} IS NOT NULL`),
    orderBy: [desc(offers.lastVotedAt)],
    columns: { id: true, title: true, slug: true, lastVotedAt: true, lastVoteType: true },
  })

  if (!recent) return c.json({ data: null })

  return c.json({
    data: {
      title: recent.title,
      slug: recent.slug,
      voteType: recent.lastVoteType,
      votedAt: recent.lastVotedAt,
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
        sql`${priceHistory.recordedAt} >= ${since.toISOString()}`
      )
    )
    .orderBy(priceHistory.recordedAt)

  return c.json({ data: history })
})

// ── Comentários de uma oferta ────────────────────────────────
// GET /api/offers/:id/comments
offersRouter.get('/:id/comments', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'ID inválido' }, 400)

  const data = await db
    .select({
      id: comments.id,
      name: comments.name,
      content: comments.content,
      createdAt: comments.createdAt,
    })
    .from(comments)
    .where(
      and(
        eq(comments.offerId, id),
        eq(comments.status, 'approved') // Apenas aprovados
      )
    )
    .orderBy(desc(comments.createdAt))

  return c.json({ data })
})

// POST /api/offers/:id/comments
offersRouter.post('/:id/comments', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'ID inválido' }, 400)

  const body = await c.req.json()
  const { name, email, content } = body

  if (!name || !email || !content) {
    return c.json({ error: 'Nome, email e conteúdo são obrigatórios' }, 400)
  }

  // Prevenir spam / comentários muito grandes
  if (content.length > 1000) {
    return c.json({ error: 'Comentário muito longo' }, 400)
  }

  const [newComment] = await db.insert(comments).values({
    offerId: id,
    name: name.slice(0, 100),
    email: email.slice(0, 150),
    content: content.trim(),
    status: 'pending', // Fica pendente de moderação
  }).returning()

  return c.json({ success: true, message: 'Comentário enviado e aguarda moderação.' })
})

// ── Sistema de Votos ("Fixe" / "Terminado") ────────────────
// PUT /api/offers/:id/vote
offersRouter.put('/:id/vote', async (c) => {
  const id = parseInt(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'ID inválido' }, 400)

  const body = await c.req.json().catch(() => ({}))
  const { type } = body // 'up' (Fixe) ou 'down' (Terminado)

  if (type !== 'up' && type !== 'down') {
    return c.json({ error: 'Tipo de voto inválido' }, 400)
  }

  const offer = await db.query.offers.findFirst({
    where: eq(offers.id, id)
  })

  if (!offer) {
    return c.json({ error: 'Oferta não encontrada' }, 404)
  }

  // Atualizar a contagem de votos
  const newUpvotes = type === 'up' ? (offer.upvotes || 0) + 1 : (offer.upvotes || 0)
  const newDownvotes = type === 'down' ? (offer.downvotes || 0) + 1 : (offer.downvotes || 0)

  // Avaliar a condição automática de "Terminado" (downvotes >= 5 E downvotes > upvotes * 2)
  let newStatus = offer.status
  if (newStatus === 'active' && newDownvotes >= 5 && newDownvotes > newUpvotes * 2) {
    newStatus = 'draft'
  }

  await db.update(offers)
    .set({
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      status: newStatus,
      lastVotedAt: new Date(),
      lastVoteType: type,
    })
    .where(eq(offers.id, id))

  return c.json({
    success: true,
    data: {
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      status: newStatus
    }
  })
})
