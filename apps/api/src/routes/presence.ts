import { Hono } from 'hono'

export const presenceRouter = new Hono()

// Contador de "pessoas no site agora": aproximação por sessão, em memória do
// processo. O browser envia um ping periódico (ver WhatsAppWidget/PresenceTicker
// no frontend) com um sessionId aleatório; consideramos "online" quem fez ping
// nos últimos 90 segundos. Não é 100% exato entre múltiplas instâncias do
// servidor, mas é uma contagem real (não inventada) do tráfego que a própria
// API está a servir.
const ONLINE_WINDOW_MS = 90_000
const lastSeen = new Map<string, number>()

function sweepExpired() {
  const cutoff = Date.now() - ONLINE_WINDOW_MS
  for (const [sessionId, ts] of lastSeen) {
    if (ts < cutoff) lastSeen.delete(sessionId)
  }
}

// POST /api/presence/ping  { sessionId: string }
presenceRouter.post('/ping', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const sessionId = typeof body.sessionId === 'string' ? body.sessionId.slice(0, 64) : null
  if (!sessionId) return c.json({ error: 'sessionId em falta' }, 400)

  lastSeen.set(sessionId, Date.now())
  sweepExpired()

  return c.json({ data: { online: lastSeen.size } })
})

// GET /api/presence/count
presenceRouter.get('/count', async (c) => {
  sweepExpired()
  return c.json({ data: { online: lastSeen.size } })
})
