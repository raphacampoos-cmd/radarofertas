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
  origin: [
    'http://localhost:3000',
    'https://radarofertas.pt',
    'https://www.radarofertas.pt',
  ],
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

// ── 404 handler ───────────────────────────────────────────────
app.notFound((c) => c.json({ error: 'Not found' }, 404))

// ── Error handler ─────────────────────────────────────────────
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

// ── Start server ──────────────────────────────────────────────
const port = parseInt(process.env.PORT || '3001')
console.log(`🚀 RadarOfertas API a correr em http://localhost:${port}`)

serve({ fetch: app.fetch, port })

export default app
