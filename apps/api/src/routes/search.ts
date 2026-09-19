import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { offers, stores } from '@radarofertas/db/schema'
import { eq, and, ilike, or, desc, sql } from 'drizzle-orm'

export const searchRouter = new Hono()

// GET /api/search?q=playstation
searchRouter.get('/', async (c) => {
  const q = c.req.query('q')?.trim()

  if (!q || q.length < 2) {
    return c.json({ error: 'Pesquisa mínima de 2 caracteres', data: [] }, 400)
  }

  // Escapar % e _ para o termo ser tratado como texto literal no ILIKE
  const term = `%${q.replace(/[\\%_]/g, (ch) => `\\${ch}`)}%`

  const results = await db.select({
    id: offers.id,
    title: offers.title,
    slug: offers.slug,
    priceCurrent: offers.priceCurrent,
    priceOriginal: offers.priceOriginal,
    priceMinimum: offers.priceMinimum,
    discountPct: offers.discountPct,
    couponCode: offers.couponCode,
    imageUrl: offers.imageUrl,
    description: offers.description,
    affiliateUrl: offers.affiliateUrl,
    dealScore: offers.dealScore,
    isMinHistoric: offers.isMinHistoric,
    upvotes: offers.upvotes,
    downvotes: offers.downvotes,
    commentCount: sql<number>`(SELECT COUNT(*)::int FROM comments WHERE comments.offer_id = ${offers.id} AND comments.status = 'approved')`,
    publishedAt: offers.publishedAt,
    updatedAt: offers.updatedAt,
    store: {
      id: stores.id,
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
        ilike(offers.title, term),
        ilike(offers.description, term),
      )
    )
  )
  .orderBy(desc(offers.dealScore))
  .limit(20)

  return c.json({ data: results, query: q })
})
