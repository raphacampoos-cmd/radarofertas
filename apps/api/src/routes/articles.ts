
import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { articles } from '@radarofertas/db/schema'
import { eq, desc } from 'drizzle-orm'

export const articlesRouter = new Hono()

// GET /api/articles
articlesRouter.get('/', async (c) => {
  const publishedArticles = await db.query.articles.findMany({
    where: eq(articles.published, true),
    orderBy: [desc(articles.createdAt)],
  })
  return c.json({ data: publishedArticles })
})

// GET /api/articles/:slug
articlesRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const article = await db.query.articles.findFirst({
    where: eq(articles.slug, slug),
  })
  if (!article) return c.json({ error: 'Artigo não encontrado' }, 404)
  return c.json({ data: article })
})

