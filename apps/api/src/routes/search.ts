import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { offers, stores } from '@radarofertas/db/schema'
import { eq, and, ilike, or, desc } from 'drizzle-orm'

export const searchRouter = new Hono()

// GET /api/search?q=playstation
searchRouter.get('/', async (c) => {
  const q = c.req.query('q')?.trim()

  if (!q || q.length < 2) {
    return c.json({ error: 'Pesquisa mínima de 2 caracteres', data: [] }, 400)
  }

  const results = await db.select({
    id: offers.id,
    title: offers.title,
    slug: offers.slug,
    priceCurrent: offers.priceCurrent,
    priceOriginal: offers.priceOriginal,
    discountPct: offers.discountPct,
    imageUrl: offers.imageUrl,
    dealScore: offers.dealScore,
    isMinHistoric: offers.isMinHistoric,
    publishedAt: offers.publishedAt,
    store: {
      name: stores.name,
      slug: stores.slug,
      logoUrl: stores.logoUrl,
    },
  })
  .from(offers)
  .innerJoin(stores, eq(offers.storeId, stores.id))
  .where(
    and(
      eq(offers.status, 'active'),
      or(
        ilike(offers.title, `%${q}%`),
        ilike(offers.description, `%${q}%`),
      )
    )
  )
  .orderBy(desc(offers.dealScore))
  .limit(20)

  return c.json({ data: results, query: q })
})
