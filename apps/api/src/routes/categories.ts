import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { categories, offers, stores } from '@radarofertas/db/schema'
import { eq, desc, and, sql, inArray } from 'drizzle-orm'
import { offerListFields } from '../lib/offer-fields.js'
import { offerIdsForCategory } from '../lib/category-offers.js'
import { qualifiedOfferCondition } from '../lib/qualified-offer.js'

export const categoriesRouter = new Hono()

// GET /api/categories — agrupamento de categorias e lojas com ofertas ativas qualificadas
categoriesRouter.get('/', async (c) => {
  // 1. Ir buscar contagem de ofertas ATIVAS e QUALIFICADAS por categoria
  const catCountsRaw = await db.execute(sql`
    SELECT c.id, COUNT(DISTINCT o.id) as count
    FROM categories c
    LEFT JOIN categories sub ON sub.id = c.id OR sub.parent_id = c.id
    LEFT JOIN offer_categories oc ON oc.category_id = sub.id
    LEFT JOIN offers o ON oc.offer_id = o.id AND o.status = 'active'
      AND (
        (o.price_original IS NOT NULL AND CAST(o.price_original AS NUMERIC) > 0 AND CAST(COALESCE(o.discount_pct, '0') AS NUMERIC) >= 15)
        OR o.is_min_historic = true
        OR (o.coupon_code IS NOT NULL AND o.coupon_code != '')
      )
    WHERE c.active = true
    GROUP BY c.id
  `)
  const catCounts = Object.fromEntries(catCountsRaw.map((r: any) => [r.id, parseInt(r.count)]))

  // 2. Ir buscar as categorias base
  const allCats = await db.query.categories.findMany({
    where: eq(categories.active, true),
    orderBy: [categories.sortOrder, categories.name],
  })

  const roots = allCats.filter(c => c.parentId === null).map(cat => ({
    ...cat,
    count: catCounts[cat.id] || 0
  }))

  // 3. Obter as Lojas Dinâmicas (apenas as que têm >= 1 oferta ativa e qualificada)
  const storeCountsRaw = await db.execute(sql`
    SELECT s.id, s.name, s.slug, s.logo_url, COUNT(o.id) as count
    FROM stores s
    INNER JOIN offers o ON s.id = o.store_id
    WHERE o.status = 'active'
      AND (
        (o.price_original IS NOT NULL AND CAST(o.price_original AS NUMERIC) > 0 AND CAST(COALESCE(o.discount_pct, '0') AS NUMERIC) >= 15)
        OR o.is_min_historic = true
        OR (o.coupon_code IS NOT NULL AND o.coupon_code != '')
      )
    GROUP BY s.id, s.name, s.slug, s.logo_url
    HAVING COUNT(o.id) > 0
    ORDER BY COUNT(o.id) DESC
  `)
  const dynamicStores = storeCountsRaw.map((r: any) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    logoUrl: r.logo_url,
    count: parseInt(r.count)
  }))

  return c.json({ data: { categories: roots, stores: dynamicStores } })
})

// GET /api/categories/:slug — ofertas de uma categoria (e das suas subcategorias)
categoriesRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const page = Math.max(1, parseInt(c.req.query('page') || '1') || 1)
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') || '20') || 20))
  const offset = (page - 1) * limit
  const qualified = c.req.query('qualified') !== 'false'

  const cat = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: { parent: true, children: true }
  })

  if (!cat) return c.json({ error: 'Categoria não encontrada' }, 404)

  const ids = await offerIdsForCategory(cat.id)

  if (ids.length === 0) {
    return c.json({
      data: { category: cat, offers: [], pagination: { page, limit, total: 0, totalPages: 0 } }
    })
  }

  const conditions = [eq(offers.status, 'active'), inArray(offers.id, ids)]
  if (qualified) {
    conditions.push(qualifiedOfferCondition())
  }
  const where = and(...conditions)

  const results = await db.select(offerListFields)
    .from(offers)
    .innerJoin(stores, eq(offers.storeId, stores.id))
    .where(where)
    .orderBy(desc(offers.dealScore), desc(offers.publishedAt))
    .limit(limit)
    .offset(offset)

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(offers).where(where)
  const total = Number(count)

  return c.json({
    data: {
      category: cat,
      offers: results,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    }
  })
})
