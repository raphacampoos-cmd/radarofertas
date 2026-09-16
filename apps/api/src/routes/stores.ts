import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { stores } from '@radarofertas/db/schema'
import { eq } from 'drizzle-orm'

export const storesRouter = new Hono()

storesRouter.get('/', async (c) => {
  const allStores = await db.query.stores.findMany({
    where: eq(stores.active, true),
    orderBy: stores.name,
  })
  return c.json({ data: allStores })
})

storesRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, slug),
  })
  if (!store) return c.json({ error: 'Loja não encontrada' }, 404)
  return c.json({ data: store })
})
