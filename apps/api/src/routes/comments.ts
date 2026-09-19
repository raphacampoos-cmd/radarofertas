import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { comments, offers } from '@radarofertas/db/schema'
import { eq, desc } from 'drizzle-orm'

export const commentsRouter = new Hono()

// ── Comentários recentes de todas as ofertas (feed da sidebar) ─────────────
// GET /api/comments/recent?limit=5
commentsRouter.get('/recent', async (c) => {
  const limit = Math.min(20, parseInt(c.req.query('limit') || '5'))

  const recent = await db.select({
    id: comments.id,
    name: comments.name,
    content: comments.content,
    createdAt: comments.createdAt,
    offer: {
      slug: offers.slug,
      title: offers.title,
      imageUrl: offers.imageUrl,
    },
  })
    .from(comments)
    .innerJoin(offers, eq(comments.offerId, offers.id))
    .where(eq(comments.status, 'approved'))
    .orderBy(desc(comments.createdAt))
    .limit(limit)

  return c.json({ data: recent })
})
