import { Hono } from 'hono'
import { db } from '@radarofertas/db/client'
import { stores, offers } from '@radarofertas/db/schema'
import { eq, desc, and, sql } from 'drizzle-orm'
import { offerListFields } from '../lib/offer-fields.js'
import { qualifiedOfferCondition } from '../lib/qualified-offer.js'

export const storesRouter = new Hono()

// GET /api/stores — todas as lojas por ordem alfabética com contagem de ofertas e cupões
storesRouter.get('/', async (c) => {
  // 1. Obter contagens de ofertas qualificadas e cupões por loja
  const countsRaw = await db.execute(sql`
    SELECT 
      s.id,
      COUNT(DISTINCT CASE WHEN o.status = 'active' THEN o.id END) as total_offers_count,
      COUNT(DISTINCT CASE 
        WHEN o.status = 'active' AND (
          (o.price_original IS NOT NULL AND CAST(o.price_original AS NUMERIC) > 0 AND CAST(COALESCE(o.discount_pct, '0') AS NUMERIC) >= 15)
          OR o.is_min_historic = true
          OR (o.coupon_code IS NOT NULL AND o.coupon_code != '')
        ) THEN o.id 
      END) as active_offers_count,
      COUNT(DISTINCT CASE 
        WHEN o.status = 'active' AND o.coupon_code IS NOT NULL AND o.coupon_code != '' THEN o.id 
      END) as coupons_count
    FROM stores s
    LEFT JOIN offers o ON s.id = o.store_id
    WHERE s.active = true
    GROUP BY s.id
  `)

  const countMap = new Map<number, { activeOffersCount: number; totalOffersCount: number; couponsCount: number }>()
  for (const r of countsRaw as any[]) {
    countMap.set(r.id, {
      activeOffersCount: parseInt(r.active_offers_count || '0', 10),
      totalOffersCount: parseInt(r.total_offers_count || '0', 10),
      couponsCount: parseInt(r.coupons_count || '0', 10),
    })
  }

  // 2. Obter todas as lojas ativas ordenadas por nome
  const allStores = await db.query.stores.findMany({
    where: eq(stores.active, true),
    orderBy: stores.name,
  })

  const data = allStores.map((s) => {
    const counts = countMap.get(s.id) || { activeOffersCount: 0, totalOffersCount: 0, couponsCount: 0 }
    return {
      ...s,
      activeOffersCount: counts.activeOffersCount,
      totalOffersCount: counts.totalOffersCount,
      couponsCount: counts.couponsCount,
    }
  })

  return c.json({ data })
})

// GET /api/stores/:slug — dados da loja, cupões ativos no topo e ofertas qualificadas
storesRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const page = Math.max(1, parseInt(c.req.query('page') || '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') || '50', 10)))
  const offset = (page - 1) * limit

  const store = await db.query.stores.findFirst({
    where: eq(stores.slug, slug),
  })

  if (!store) {
    return c.json({ error: 'Loja não encontrada' }, 404)
  }

  // 1. Cupões ativos da loja (ofertas com código de cupão válido)
  const coupons = await db
    .select(offerListFields)
    .from(offers)
    .innerJoin(stores, eq(offers.storeId, stores.id))
    .where(
      and(
        eq(offers.storeId, store.id),
        eq(offers.status, 'active'),
        sql`${offers.couponCode} IS NOT NULL AND ${offers.couponCode} != ''`
      )
    )
    .orderBy(desc(offers.dealScore), desc(offers.publishedAt))
    .limit(20)

  // 2. Ofertas qualificadas da loja
  const qualifiedOffers = await db
    .select(offerListFields)
    .from(offers)
    .innerJoin(stores, eq(offers.storeId, stores.id))
    .where(
      and(
        eq(offers.storeId, store.id),
        eq(offers.status, 'active'),
        qualifiedOfferCondition()
      )
    )
    .orderBy(desc(offers.dealScore), desc(offers.publishedAt))
    .limit(limit)
    .offset(offset)

  // 3. Contagem total de ofertas qualificadas para paginação
  const [totalRes] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(offers)
    .where(
      and(
        eq(offers.storeId, store.id),
        eq(offers.status, 'active'),
        qualifiedOfferCondition()
      )
    )

  const total = Number(totalRes?.count || 0)

  return c.json({
    data: {
      store: {
        ...store,
        activeOffersCount: total,
        couponsCount: coupons.length,
      },
      coupons,
      offers: qualifiedOffers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  })
})
