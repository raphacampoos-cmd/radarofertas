import { sql } from 'drizzle-orm'
import { offers, stores } from '@radarofertas/db/schema'

// Campos devolvidos por qualquer listagem de ofertas (home, categoria, loja), para os cards
// do site funcionarem em todo o lado (inclui o link de afiliado do botão "Abrir desconto").
export const offerListFields = {
  id: offers.id,
  title: offers.title,
  slug: offers.slug,
  priceCurrent: offers.priceCurrent,
  priceOriginal: offers.priceOriginal,
  priceMinimum: offers.priceMinimum,
  discountPct: offers.discountPct,
  couponCode: offers.couponCode,
  imageUrl: offers.imageUrl,
  description: offers.description,
  affiliateUrl: offers.affiliateUrl,
  dealScore: offers.dealScore,
  isMinHistoric: offers.isMinHistoric,
  availability: offers.availability,
  expiresAt: offers.expiresAt,
  clickCount: offers.clickCount,
  publishedAt: offers.publishedAt,
  updatedAt: offers.updatedAt,
  upvotes: offers.upvotes,
  downvotes: offers.downvotes,
  commentCount: sql<number>`(SELECT COUNT(*)::int FROM comments WHERE comments.offer_id = ${offers.id} AND comments.status = 'approved')`,
  store: {
    id: stores.id,
    name: stores.name,
    slug: stores.slug,
    logoUrl: stores.logoUrl,
  },
}
