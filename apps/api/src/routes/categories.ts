import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { categories, offerCategories, offers, stores } from '@radarofertas/db/schema'
import { eq, desc, and, isNull, sql } from 'drizzle-orm'

export const categoriesRouter = new Hono()

// GET /api/categories — agrupamento de categorias e lojas com ofertas ativas
categoriesRouter.get('/', async (c) => {
  // 1. Ir buscar contagem de ofertas ATIVAS por categoria
  const catCountsRaw = await db.execute(sql`
    SELECT c.id, COUNT(oc.offer_id) as count
    FROM categories c
    LEFT JOIN offer_categories oc ON c.id = oc.category_id
    LEFT JOIN offers o ON oc.offer_id = o.id AND o.status = 'active'
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

  // 3. Obter as Lojas Dinâmicas (apenas as que têm >= 1 oferta ativa)
  const storeCountsRaw = await db.execute(sql`
    SELECT s.id, s.name, s.slug, s.logo_url, COUNT(o.id) as count
    FROM stores s
    INNER JOIN offers o ON s.id = o.store_id
    WHERE o.status = 'active'
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

// GET /api/categories/:slug — ofertas de uma categoria
categoriesRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const page = Math.max(1, parseInt(c.req.query('page') || '1'))
  const limit = Math.min(50, parseInt(c.req.query('limit') || '20'))
  const offset = (page - 1) * limit

  const cat = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: { parent: true, children: true }
  })

  if (!cat) return c.json({ error: 'Categoria não encontrada' }, 404)

  // IDs desta categoria + subcategorias
  const catIds = [cat.id, ...cat.children.map(c => c.id)]

  const offerIds = await db
    .select({ offerId: offerCategories.offerId })
    .from(offerCategories)
    .where(
      catIds.length > 1
        ? eq(offerCategories.categoryId, catIds[0]) // simplificado para MVP
        : eq(offerCategories.categoryId, cat.id)
    )

  const ids = offerIds.map(r => r.offerId)

  if (ids.length === 0) {
    return c.json({
      data: { category: cat, offers: [], pagination: { page, limit, total: 0, totalPages: 0 } }
    })
  }

  const results = await db.query.offers.findMany({
    where: and(
      eq(offers.status, 'active'),
    ),
    with: { store: true },
    orderBy: [desc(offers.dealScore), desc(offers.publishedAt)],
    limit,
    offset,
  })

  return c.json({
    data: {
      category: cat,
      offers: results,
      pagination: { page, limit, total: ids.length, totalPages: Math.ceil(ids.length / limit) }
    }
  })
})
