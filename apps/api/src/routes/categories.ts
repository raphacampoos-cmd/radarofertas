import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { categories, offerCategories, offers, stores } from '@radarofertas/db/schema'
import { eq, desc, and, isNull } from 'drizzle-orm'

export const categoriesRouter = new Hono()

// GET /api/categories — todas as categorias com contagem
categoriesRouter.get('/', async (c) => {
  const allCats = await db.query.categories.findMany({
    where: eq(categories.active, true),
    orderBy: [categories.sortOrder, categories.name],
    with: {
      children: {
        where: eq(categories.active, true),
        orderBy: [categories.sortOrder],
      }
    }
  })

  // Apenas raiz (sem parentId)
  const roots = allCats.filter(c => c.parentId === null)

  return c.json({ data: roots })
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
