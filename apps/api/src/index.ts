import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { offersRouter } from './routes/offers.js'
import { categoriesRouter } from './routes/categories.js'
import { storesRouter } from './routes/stores.js'
import { searchRouter } from './routes/search.js'
import { clicksRouter } from './routes/clicks.js'
import { adminRouter } from './routes/admin.js'

const app = new Hono()

// ── Middleware ────────────────────────────────────────────────
app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    const allowed = [
      'http://localhost:3000',
      'https://radarofertas.pt',
      'https://www.radarofertas.pt',
      'https://radarofertas-psi.vercel.app',
    ]
    // Permitir qualquer subdomínio vercel.app do projeto
    if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
      return origin
    }
    return null
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
}))

// ── Health check ──────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ── Rotas públicas ────────────────────────────────────────────
app.route('/api/offers', offersRouter)
app.route('/api/categories', categoriesRouter)
app.route('/api/stores', storesRouter)
app.route('/api/search', searchRouter)
app.route('/api/clicks', clicksRouter)

// ── Rotas admin (protegidas) ──────────────────────────────────
app.route('/api/admin', adminRouter)

// ── Newsletter ────────────────────────────────────────────────
import { db } from '@radarofertas/db/src/client.js'
import { subscribers } from '@radarofertas/db/src/schema/index.js'
app.post('/api/newsletter', async (c) => {
  try {
    const { email } = await c.req.json()
    if (!email || !email.includes('@')) {
      return c.json({ error: 'Email inválido' }, 400)
    }

    await db.insert(subscribers)
      .values({ email })
      .onConflictDoNothing({ target: subscribers.email })

    return c.json({ success: true, message: 'Subscrito com sucesso!' })
  } catch (error) {
    console.error('Newsletter error:', error)
    return c.json({ error: 'Erro ao subscrever newsletter' }, 500)
  }
})

// ── 404 handler ───────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Not found' }, 404))

// ── Error handler ─────────────────────────────────────────────
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

// ── Start server ──────────────────────────────────────────────
import { startBotScheduler } from './services/bot.js'

const port = parseInt(process.env.PORT || '3001')
console.log(`🚀 RadarOfertas API a correr em http://localhost:${port}`)

// Iniciar o robô autónomo de preços em background
startBotScheduler()

serve({ fetch: app.fetch, port })

export default app
