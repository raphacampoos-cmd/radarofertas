import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { clicks, offers } from '@radarofertas/db/schema'
import { eq, sql } from 'drizzle-orm'
import { createHash } from 'crypto'

export const clicksRouter = new Hono()

// POST /api/clicks — registar clique numa oferta
clicksRouter.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const offerId = parseInt(body.offerId)
    const channel = body.channel || 'web'

    if (isNaN(offerId)) return c.json({ error: 'offerId inválido' }, 400)

    // Hash do IP para privacidade (RGPD)
    const ip = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || 'unknown'
    const ipHash = createHash('sha256').update(ip + (process.env.IP_SALT || 'radar_salt')).digest('hex').slice(0, 32)

    // Registar clique
    await db.insert(clicks).values({
      offerId,
      ipHash,
      userAgent: c.req.header('user-agent') || '',
      referrer: c.req.header('referer') || '',
      channel,
    })

    // Incrementar contador na oferta
    await db
      .update(offers)
      .set({ clickCount: sql`${offers.clickCount} + 1` })
      .where(eq(offers.id, offerId))

    return c.json({ success: true })
  } catch {
    return c.json({ error: 'Erro ao registar clique' }, 500)
  }
})
